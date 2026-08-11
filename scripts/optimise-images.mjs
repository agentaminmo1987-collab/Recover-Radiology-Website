/**
 * Converts the 2K PNG masters in public/img/_raw into responsive AVIF and WebP.
 *
 * The masters are ~110MB and must never be committed or served. This writes
 * only what ships. Run after adding or replacing a master:
 *
 *   node scripts/optimise-images.mjs
 *
 * Widths are chosen per role rather than uniformly: a hero plate needs to cover
 * a 2560px viewport, a matcap is sampled by the GPU at 512, and a noise tile is
 * never displayed at size.
 */
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, basename, extname, dirname } from "node:path";
import sharp from "sharp";

const RAW = "public/img/_raw";
const OUT = "public/img";

/** width sets per directory */
const WIDTHS = {
  hero: [640, 1024, 1600, 2560],
  sections: [640, 1024, 1600],
  photography: [640, 1024, 1600],
  social: [1200],
  textures: [512, 1024],
  ref: [640, 1024, 1600, 2560],
  clinic: [640, 1024, 1600, 2560],
  staff: [320, 640],
};

// Textures are sampled by the GPU and must stay lossless-ish and square-safe.
const TEXTURE_DIRS = new Set(["textures"]);

/**
 * Uses stat() rather than the dirent flags: these files live in a OneDrive
 * synced folder, where placeholders are reparse points and isDirectory() on the
 * dirent can come back false for a real directory.
 */
async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(png|jpe?g)$/i.test(name)) out.push(p);
  }
  return out;
}

const fmt = (n) => `${(n / 1024).toFixed(0)}KB`.padStart(7);

let totalIn = 0;
let totalOut = 0;

const files = await walk(RAW);
for (const file of files) {
  const rel = file.slice(RAW.length + 1).replace(/\\/g, "/");
  const group = rel.split("/")[0];
  const name = basename(rel, extname(rel));
  const outDir = join(OUT, group);
  await mkdir(outDir, { recursive: true });

  const src = sharp(file);
  const meta = await src.metadata();
  const inSize = (await stat(file)).size;
  totalIn += inSize;

  const widths = (WIDTHS[group] ?? [1024]).filter((w) => w <= meta.width);
  if (widths.length === 0) widths.push(meta.width);

  const isTexture = TEXTURE_DIRS.has(group);
  const line = [];

  for (const w of widths) {
    const suffix = widths.length === 1 ? "" : `-${w}`;

    const avifPath = join(outDir, `${name}${suffix}.avif`);
    await sharp(file)
      .resize({ width: w, withoutEnlargement: true })
      .avif({ quality: isTexture ? 70 : 52, effort: 6 })
      .toFile(avifPath);

    const webpPath = join(outDir, `${name}${suffix}.webp`);
    await sharp(file)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: isTexture ? 82 : 74 })
      .toFile(webpPath);

    const a = (await stat(avifPath)).size;
    const b = (await stat(webpPath)).size;
    totalOut += a + b;
    line.push(`${w}:${fmt(a).trim()}/${fmt(b).trim()}`);
  }

  console.log(
    `${rel.padEnd(42)} ${meta.width}x${meta.height} ${fmt(inSize)} -> ${line.join("  ")}`,
  );
}

console.log(
  `\nmasters ${(totalIn / 1024 / 1024).toFixed(1)}MB  ->  shipped ${(totalOut / 1024 / 1024).toFixed(1)}MB`,
);
