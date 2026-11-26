/**
 * Builds everything the home page scroll story ships, from the masters in
 * public/img/_raw/story (gitignored):
 *
 *   s1.png ... s5.png   the five stage stills, 2048 square
 *   c1.mp4 ... c4.mp4   the four morph clips between them, 720 square
 *
 *   node scripts/build-story-frames.mjs
 *
 * Writes:
 *   public/img/story/knee-*-{480,800,1270}.{avif,webp}   the stills
 *   public/img/story/frames-lg, frames-sm                the scroll frames
 *   src/lib/story-frames.json                            counts and ground colours
 *
 * WHY A BROWSER. The clips are H.264 and the only decoder guaranteed to be on
 * this machine is the one in Edge, so each frame is seeked and screenshotted
 * there rather than through ffmpeg. Playwright's bundled Chromium has no H.264,
 * which is why the channel is named explicitly.
 *
 * WHY THE CROP. The object sits in the middle third of a square frame. Cropped
 * to a portrait window it reads twice as large on a phone for the same bytes.
 * The same window is cut from stills and frames so they register exactly.
 *
 * WHY THE GROUND COLOUR. A video model does not hold a flat background to an
 * exact hex, and it shifts through the morph. Rather than fight that, the edge
 * of every frame is sampled here and the page sets its ground to that colour
 * as the frame is drawn, so the picture has no visible edge at any point.
 */
import { mkdir, rm, writeFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { chromium } from "@playwright/test";

const RAW = resolve("public/img/_raw/story");
const OUT = resolve("public/img/story");
const MANIFEST = resolve("src/lib/story-frames.json");

/** Crop window, as fractions of the square source. */
const CROP = { left: 0.12, top: 0.03, width: 0.62, height: 0.94 };
const FRAMES_PER_CLIP = 48;
const SM_SCALE = 0.68;

const STILLS = [
  ["s1.png", "knee-1-form"],
  ["s2.png", "knee-2-ultrasound"],
  ["s3.png", "knee-3-xray"],
  ["s4.png", "knee-4-ct"],
  ["s5.png", "knee-5-whole"],
];
const STILL_WIDTHS = [480, 800, 1270];

const cropOf = (w, h) => ({
  left: Math.round(CROP.left * w),
  top: Math.round(CROP.top * h),
  width: Math.round(CROP.width * w),
  height: Math.round(CROP.height * h),
});

const toHex = (r, g, b) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

/** Mean colour of the left and right edge strips, above the ground shadow. */
async function groundOf(buffer) {
  const { data, info } = await sharp(buffer)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const strip = Math.max(4, Math.round(width * 0.02));
  const y0 = Math.round(height * 0.05);
  const y1 = Math.round(height * 0.8);
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = y0; y < y1; y++) {
    for (const x0 of [2, width - strip - 2]) {
      for (let x = x0; x < x0 + strip; x++) {
        const i = (y * width + x) * channels;
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
    }
  }
  return toHex(r / n, g / n, b / n);
}

await mkdir(OUT, { recursive: true });

/* ------------------------------------------------------------------ stills */
const stillGround = [];
for (const [file, name] of STILLS) {
  const src = sharp(join(RAW, file));
  const meta = await src.metadata();
  const cropped = await src.extract(cropOf(meta.width, meta.height)).png().toBuffer();
  stillGround.push(await groundOf(cropped));
  for (const w of STILL_WIDTHS) {
    await sharp(cropped).resize(w).avif({ quality: 55 }).toFile(join(OUT, `${name}-${w}.avif`));
    await sharp(cropped).resize(w).webp({ quality: 78 }).toFile(join(OUT, `${name}-${w}.webp`));
  }
  console.log(`still  ${name}  ground ${stillGround.at(-1)}`);
}

/* ------------------------------------------------------------------ frames */
const clipFiles = (await readdir(RAW)).filter((f) => /^c\d+\.mp4$/.test(f)).sort();
const lgDir = join(OUT, "frames-lg");
const smDir = join(OUT, "frames-sm");
for (const d of [lgDir, smDir]) {
  await rm(d, { recursive: true, force: true });
  await mkdir(d, { recursive: true });
}

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({
  viewport: { width: 1100, height: 1100 },
  deviceScaleFactor: 1,
});

const clips = [];
let sizes = null;
let bytes = { lg: 0, sm: 0 };

for (const [ci, file] of clipFiles.entries()) {
  // A file page beside the clip, not setContent: a blank document is not
  // allowed to load a file:// video.
  const host = join(RAW, "_frame.html");
  await writeFile(
    host,
    `<body style="margin:0;background:#000"><video id="v" muted playsinline preload="auto" src="${file}"></video></body>`,
  );
  await page.goto(pathToFileURL(host).href);
  await page.waitForFunction(() => document.getElementById("v").readyState >= 2, null, {
    timeout: 60_000,
  });
  const info = await page.evaluate(() => {
    const v = document.getElementById("v");
    v.style.width = v.videoWidth + "px";
    v.style.height = v.videoHeight + "px";
    return { d: v.duration, w: v.videoWidth, h: v.videoHeight };
  });
  const crop = cropOf(info.w, info.h);
  const sm = { w: Math.round(crop.width * SM_SCALE), h: Math.round(crop.height * SM_SCALE) };
  sizes ??= {
    lg: { w: crop.width, h: crop.height, dir: "/img/story/frames-lg" },
    sm: { w: sm.w, h: sm.h, dir: "/img/story/frames-sm" },
  };

  const bg = [];
  for (let f = 0; f < FRAMES_PER_CLIP; f++) {
    const t = Math.min(info.d - 0.03, (f / (FRAMES_PER_CLIP - 1)) * info.d);
    await page.evaluate(
      (t) =>
        new Promise((done) => {
          const v = document.getElementById("v");
          const ok = () => requestAnimationFrame(() => requestAnimationFrame(done));
          if (Math.abs(v.currentTime - t) < 0.001) return ok();
          v.addEventListener("seeked", ok, { once: true });
          v.currentTime = t;
        }),
      t,
    );
    const shot = await page.locator("#v").screenshot({ type: "png" });
    const cropped = await sharp(shot).extract(crop).png().toBuffer();
    bg.push(await groundOf(cropped));
    const name = `c${ci + 1}-${String(f).padStart(3, "0")}.webp`;
    const a = await sharp(cropped).webp({ quality: 74 }).toFile(join(lgDir, name));
    const b = await sharp(cropped).resize(sm.w, sm.h).webp({ quality: 72 }).toFile(join(smDir, name));
    bytes.lg += a.size;
    bytes.sm += b.size;
  }
  clips.push({ count: FRAMES_PER_CLIP, bg });
  console.log(`clip   ${file}  ${info.w}x${info.h}  ${info.d.toFixed(2)}s  ${bg[0]} -> ${bg.at(-1)}`);
}
await browser.close();

await writeFile(
  MANIFEST,
  JSON.stringify({ sizes, stills: stillGround, clips }, null, 1) + "\n",
);
console.log(
  `frames lg ${(bytes.lg / 1048576).toFixed(2)}MB, sm ${(bytes.sm / 1048576).toFixed(2)}MB`,
);
