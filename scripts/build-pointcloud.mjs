/**
 * Samples the generated hero plate into a point cloud, at build time.
 *
 * Why build time rather than in the browser: reading a 2K image into a canvas
 * and walking its pixels is tens of milliseconds of main-thread work during the
 * exact window where LCP is decided. Doing it here means the runtime cost is a
 * single fetch of a compact binary.
 *
 * Why sample the plate at all rather than model a torso: the plate is the
 * approved art direction (§5 says match the 3D to it). Deriving the target
 * positions from the image guarantees the resolved frame IS that image, instead
 * of something that merely resembles it.
 *
 * Output: a quantised binary, 7 bytes per point.
 *   x, y, z  Int16, normalised position scaled by 32767 over a [-2, 2] range
 *   b        Uint8 luminance, used for size and alpha in the shader
 *
 * Float32 would be 16 bytes per point. At this scale the extra precision is
 * invisible (a point moves less than a pixel) and costs more than twice the
 * bytes, on an asset that ships to phones.
 *
 * Layout is planar rather than interleaved: all x, then all y, then all z, then
 * all b. Planar Int16 compresses far better than interleaved, because
 * neighbouring values in each plane are correlated.
 *
 * Run: node scripts/build-pointcloud.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCES = [
  { name: "torso", file: "public/img/_raw/hero/hero-torso-resolve-21x9.png" },
  { name: "knee", file: "public/img/_raw/hero/hero-knee-wireframe-21x9.png" },
];

/**
 * Points per cloud. Tiers downsample from this at runtime by taking a prefix,
 * so the sampler must stay unbiased across the whole array for a prefix to
 * still cover the whole form.
 */
const COUNT = 65_536;
/** Positions are quantised into this half-range. */
const RANGE = 2;
/** Sampling resolution. Higher finds finer structure, at build cost only. */
const GRID = 900;
/** Ignore near-black pixels: they are background, not anatomy. */
const FLOOR = 0.06;

await mkdir("public/data", { recursive: true });

for (const src of SOURCES) {
  const img = sharp(src.file).removeAlpha();
  const meta = await img.metadata();
  const w = GRID;
  const h = Math.max(1, Math.round((GRID * meta.height) / meta.width));

  const { data } = await img
    .resize(w, h, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Build a cumulative distribution over luminance so sampling is weighted:
  // bright structure gets proportionally more points than faint haze, which is
  // what makes the resolved form legible rather than uniformly speckled.
  const weights = new Float64Array(w * h);
  let total = 0;
  for (let i = 0; i < w * h; i++) {
    const l = data[i] / 255;
    const v = l < FLOOR ? 0 : Math.pow(l, 1.6); // gamma pushes points into highlights
    weights[i] = v;
    total += v;
  }
  if (total === 0) throw new Error(`No luminance above floor in ${src.file}`);

  const cdf = new Float64Array(w * h);
  let acc = 0;
  for (let i = 0; i < w * h; i++) {
    acc += weights[i] / total;
    cdf[i] = acc;
  }

  // Deterministic sampler. A fixed seed means the cloud is identical on every
  // build, so a visual diff between deploys reflects real changes only.
  let seed = 0x9e3779b9;
  const rand = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return ((seed >>> 0) % 1e6) / 1e6;
  };

  // Planar layout: xs, ys, zs as Int16, then bs as Uint8.
  const xs = new Int16Array(COUNT);
  const ys = new Int16Array(COUNT);
  const zs = new Int16Array(COUNT);
  const bs = new Uint8Array(COUNT);
  const q = (v) => Math.max(-32767, Math.min(32767, Math.round((v / RANGE) * 32767)));
  const aspect = w / h;

  for (let p = 0; p < COUNT; p++) {
    // Binary search the CDF.
    const r = rand();
    let lo = 0;
    let hi = w * h - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    const px = lo % w;
    const py = (lo / w) | 0;

    // Jitter within the source pixel so the cloud does not band on the grid.
    const jx = (px + rand()) / w;
    const jy = (py + rand()) / h;

    const b = data[lo] / 255;

    xs[p] = q((jx * 2 - 1) * aspect);
    ys[p] = q(-(jy * 2 - 1));
    // Depth from brightness, signed so the volume has front and back.
    zs[p] = q((b - 0.5) * 0.55 + (rand() - 0.5) * 0.06);
    bs[p] = data[lo];
  }

  // Sort by Morton (Z-order) code before writing.
  //
  // The sampler walks the CDF, so consecutive points land anywhere in the
  // image and the Int16 planes are effectively noise, which gzip cannot touch.
  // Z-order interleaves the bits of x and y so that array neighbours are also
  // spatial neighbours, which makes each plane locally smooth and compressible.
  //
  // It also keeps a STRIDED sample representative: every Nth point along a
  // Z-order curve still covers the whole form. A prefix would not, which is why
  // the runtime must downsample by stride and never by slice.
  const part1by1 = (n) => {
    n &= 0xffff;
    n = (n | (n << 8)) & 0x00ff00ff;
    n = (n | (n << 4)) & 0x0f0f0f0f;
    n = (n | (n << 2)) & 0x33333333;
    n = (n | (n << 1)) & 0x55555555;
    return n;
  };
  const order = Array.from({ length: COUNT }, (_, i) => i).sort((a, b) => {
    const ma =
      part1by1((xs[a] + 32768) >> 6) | (part1by1((ys[a] + 32768) >> 6) << 1);
    const mb =
      part1by1((xs[b] + 32768) >> 6) | (part1by1((ys[b] + 32768) >> 6) << 1);
    return ma - mb;
  });
  const sx = new Int16Array(COUNT);
  const sy = new Int16Array(COUNT);
  const sz = new Int16Array(COUNT);
  const sb = new Uint8Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const j = order[i];
    sx[i] = xs[j];
    sy[i] = ys[j];
    sz[i] = zs[j];
    sb[i] = bs[j];
  }

  // Delta encode each plane. After the Z-order sort neighbouring values are
  // close, so deltas cluster near zero and gzip finally has something to work
  // with. The runtime prefix-sums once at load.
  const delta = (arr) => {
    const d = new Int16Array(arr.length);
    let prev = 0;
    for (let i = 0; i < arr.length; i++) {
      // Wrap into Int16 range; the decoder wraps identically.
      d[i] = (arr[i] - prev) << 16 >> 16;
      prev = arr[i];
    }
    return d;
  };

  const buf = Buffer.concat([
    Buffer.from(delta(sx).buffer),
    Buffer.from(delta(sy).buffer),
    Buffer.from(delta(sz).buffer),
    Buffer.from(sb.buffer),
  ]);
  const path = `public/data/points-${src.name}.bin`;
  await writeFile(path, buf);

  const { gzipSync } = await import("node:zlib");
  const gz = gzipSync(buf).byteLength;
  console.log(
    `${src.name.padEnd(6)} ${w}x${h} grid -> ${COUNT.toLocaleString()} points, ` +
      `${(buf.byteLength / 1024).toFixed(0)}KB raw, ${(gz / 1024).toFixed(0)}KB gzip`,
  );
}
