/**
 * Extracts frame 0 of each hero video as its poster.
 *
 * The poster has to be the video's own first frame. Anything else, even a
 * closely-related still, shows as a visible flash the moment the video starts
 * playing over it.
 *
 * No ffmpeg on this machine, so this uses the Chromium that Playwright already
 * installs: load the video, seek to the first frame, draw it to a canvas, read
 * the pixels back.
 *
 * Run: node scripts/video-poster.mjs
 */
import { chromium } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const VIDEOS = ["ct-forming", "ct-scan", "ultrasound"];
const PORT = 4599;

const types = { ".mp4": "video/mp4", ".html": "text/html" };
const server = createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/__blank")) {
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end("<!doctype html><title>poster</title>");
    }
    const p = join("public", decodeURIComponent(req.url.split("?")[0]));
    const buf = await readFile(p);
    res.writeHead(200, { "Content-Type": types[extname(p)] ?? "application/octet-stream" });
    res.end(buf);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const page = await browser.newPage();
// Same origin as the video, otherwise the canvas is tainted and cannot be read
// back. about:blank counts as a different origin.
await page.goto(`http://localhost:${PORT}/__blank`).catch(() => {});
await page.setContent("<!doctype html><title>poster</title>");
await mkdir("public/img/_raw/poster", { recursive: true });

for (const name of VIDEOS) {
  const data = await page.evaluate(async (url) => {
    const v = document.createElement("video");
    v.crossOrigin = "anonymous";
    v.src = url;
    v.muted = true;
    v.playsInline = true;
    await new Promise((res, rej) => {
      v.onloadeddata = res;
      v.onerror = rej;
    });
    // Nudge past 0: some encoders leave frame 0 black or partially decoded.
    v.currentTime = 0.12;
    await new Promise((res) => (v.onseeked = res));
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    return { png: c.toDataURL("image/png"), w: v.videoWidth, h: v.videoHeight };
  }, `http://localhost:${PORT}/video/${name}.mp4`);

  const b64 = data.png.split(",")[1];
  await writeFile(`public/img/_raw/poster/${name}.png`, Buffer.from(b64, "base64"));
  console.log(`${name}  ${data.w}x${data.h}  frame captured`);
}

await browser.close();
server.close();
