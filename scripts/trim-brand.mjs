/**
 * Trims transparent padding from the supplied horizontal lockups.
 *
 * The masters carry a large transparent margin: `logo-h-colour.png` is
 * 1597x969 with the artwork occupying only x194-1406, y192-776. That is about
 * 24% empty across and 40% empty down.
 *
 * CSS sizes a background by its outer box, not its ink, so a 38px-tall
 * background drew roughly 23px of actual logo. The markup said 44px, the header
 * reserved 172px of width for something 63px wide, and the logo looked small
 * for reasons nothing in the stylesheet could explain.
 *
 * Trimming makes box height equal ink height, so the CSS means what it says.
 * The masters are left untouched; these are additional `-tight` files.
 *
 * Run: node scripts/trim-brand.mjs
 */
import sharp from "sharp";

const SOURCES = ["logo-h-colour", "logo-h-white"];

for (const name of SOURCES) {
  const src = `public/brand/${name}.png`;
  const out = `public/brand/${name}-tight.png`;

  const before = await sharp(src).metadata();
  // threshold 1 so only genuinely transparent pixels are trimmed, never a
  // faint edge of the artwork itself.
  const buf = await sharp(src).trim({ threshold: 1 }).png().toBuffer();
  const after = await sharp(buf).metadata();
  await sharp(buf).toFile(out);

  const inkRatio = (after.height / before.height) * 100;
  console.log(
    `${name}  ${before.width}x${before.height} -> ${after.width}x${after.height}  ` +
      `aspect ${(after.width / after.height).toFixed(3)}  ` +
      `(ink was ${inkRatio.toFixed(0)}% of the master's height)`,
  );
}
