/**
 * Measures hero text contrast against the video actually playing behind it.
 *
 * Three things make this harder than reading two colours out of the CSS, and
 * getting any of them wrong produces a number that looks authoritative and is
 * not:
 *
 * 1. THE BACKGROUND MOVES. A single screenshot lands wherever the loop happens
 *    to be, so two runs of the same build can differ by more than the change
 *    being measured. This seeks to fixed positions across the loop and takes the
 *    worst of all of them.
 *
 * 2. ONLY GLYPH PIXELS COUNT. A wrapped paragraph's bounding box includes the
 *    blank space at the end of every short line. Sampling the whole box reports
 *    failures at the ragged right edge where there is no text at all. So a glyph
 *    mask is built first, by diffing a paused frame with the text shown against
 *    the same frame with it hidden, and only those pixels are measured.
 *
 * 3. BUTTONS ARE NOT TEXT ON VIDEO. They carry their own opaque fill, so what
 *    is behind them is irrelevant. They are excluded.
 *
 * Run: node scripts/hero-contrast.mjs        (defaults to localhost:3272)
 *      BASE=https://... node scripts/hero-contrast.mjs
 */
import { chromium } from "@playwright/test";
import sharp from "sharp";

const BASE = process.env.BASE ?? "http://localhost:3272";
const WIDTHS = [
  [390, 844, "mobile"],
  [430, 932, "large phone"],
  [768, 1024, "tablet"],
  [1024, 900, "small laptop"],
  [1440, 900, "desktop"],
];
/** Positions across the loop, in seconds. */
const SEEKS = [0, 1.5, 3, 4.5, 6, 7.5];
const TEXT = "section:first-of-type h1, section:first-of-type p";
const HIDE =
  "section:first-of-type h1, section:first-of-type p, section:first-of-type .brand-mark, section:first-of-type .brand-word";

const lum = (r, g, b) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = a > b ? [a, b] : [b, a];
  return (x + 0.05) / (y + 0.05);
};

const raw = (buf) => sharp(buf).raw().toBuffer({ resolveWithObject: true });

const browser = await chromium.launch();
let failures = 0;

for (const [w, h, label] of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3500);

  // The hero is min-height 100svh, so on a short viewport its last line sits
  // below the fold. Clipping to the viewport silently skipped it and reported
  // "no glyph pixels" rather than a number, which reads like a pass and is not.
  // Clip to the section itself and let fullPage reach past the fold.
  const box = await page.locator("section").first().boundingBox();
  const clip = {
    x: 0,
    y: 0,
    width: w,
    height: Math.ceil(box?.height ?? Math.min(h, 844)),
  };
  const seekTo = (t) =>
    page.evaluate((time) => {
      const v = document.querySelector("video");
      if (!v) return false;
      v.pause();
      v.currentTime = time % (v.duration || 8);
      return new Promise((res) => {
        v.onseeked = () => res(true);
        setTimeout(() => res(true), 600);
      });
    }, t);

  const setHidden = (hidden) =>
    page.evaluate(
      ([sel, hide]) => {
        document.querySelectorAll(sel).forEach((el) => {
          el.style.visibility = hide ? "hidden" : "";
        });
      },
      [HIDE, hidden],
    );

  const targets = await page.evaluate((sel) => {
    return [...document.querySelectorAll(sel)]
      .map((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          text: (el.textContent ?? "").trim().slice(0, 30),
          colour: cs.color,
          size: parseFloat(cs.fontSize),
          weight: Number(cs.fontWeight),
          x: Math.max(0, Math.round(r.x)),
          y: Math.max(0, Math.round(r.y)),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      })
      .filter((t) => t.w > 4 && t.h > 4);
  }, TEXT);

  // Glyph mask: same paused frame, text on vs off.
  await seekTo(SEEKS[0]);
  await setHidden(false);
  await page.waitForTimeout(120);
  const withText = await raw(await page.screenshot({ clip, fullPage: true }));
  await setHidden(true);
  await page.waitForTimeout(120);
  const noText = await raw(await page.screenshot({ clip, fullPage: true }));

  const info = withText.info;
  const mask = new Uint8Array(info.width * info.height);
  for (let i = 0, p = 0; p < mask.length; p++, i += info.channels) {
    const d =
      Math.abs(withText.data[i] - noText.data[i]) +
      Math.abs(withText.data[i + 1] - noText.data[i + 1]) +
      Math.abs(withText.data[i + 2] - noText.data[i + 2]);
    mask[p] = d > 40 ? 1 : 0;
  }

  // Background, text hidden, across the loop.
  const frames = [noText];
  for (const t of SEEKS.slice(1)) {
    await seekTo(t);
    await page.waitForTimeout(120);
    frames.push(await raw(await page.screenshot({ clip, fullPage: true })));
  }

  console.log(`\n=== ${label}  ${w}x${h} ===`);
  let worstOverall = Infinity;

  for (const t of targets) {
    const [tr, tg, tb] = t.colour.match(/\d+/g).slice(0, 3).map(Number);
    const tl = lum(tr, tg, tb);
    let worst = Infinity;
    let sampled = 0;

    for (const { data } of frames) {
      for (let y = t.y; y < Math.min(t.y + t.h, info.height); y++) {
        for (let x = t.x; x < Math.min(t.x + t.w, info.width); x++) {
          if (!mask[y * info.width + x]) continue;
          sampled++;
          const i = (y * info.width + x) * info.channels;
          const c = ratio(tl, lum(data[i], data[i + 1], data[i + 2]));
          if (c < worst) worst = c;
        }
      }
    }

    if (!sampled) {
      console.log(`  SKIP        no glyph pixels found  "${t.text}"`);
      continue;
    }
    const large = t.size >= 24 || (t.size >= 18.66 && t.weight >= 700);
    const need = large ? 3.0 : 4.5;
    if (worst < worstOverall) worstOverall = worst;
    if (worst < need) failures++;
    console.log(
      `  ${worst >= need ? "PASS" : "FAIL"}  ${worst.toFixed(2)} (need ${need})  ${t.size}px  "${t.text}"`,
    );
  }
  console.log(`  worst glyph pixel in hero copy: ${worstOverall.toFixed(2)}`);
  await page.close();
}

await browser.close();
console.log(failures === 0 ? "\nAll widths pass." : `\n${failures} failing text runs.`);
process.exit(failures === 0 ? 0 : 1);
