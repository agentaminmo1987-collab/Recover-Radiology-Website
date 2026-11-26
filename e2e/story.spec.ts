import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

/**
 * The home page scroll story. These guard the three promises it makes:
 * it is complete without JavaScript, it is gentle under reduced motion, and
 * when it is pinned the picture and the ground really do follow the scroll.
 */

const STAGES = 5;

test("the story is complete with JavaScript disabled", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/");

  const panels = page.locator("[data-story-panel]");
  await expect(panels).toHaveCount(STAGES);

  // Stacked, not pinned: every stage has its own height and its own ground,
  // and every heading, still and link is there to be read.
  const boxes = await panels.evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      const copy = el.querySelector<HTMLElement>("[data-story-copy]")!;
      const still = el.querySelector<HTMLImageElement>("[data-story-still]")!;
      return {
        top: r.top + window.scrollY,
        height: r.height,
        bg: getComputedStyle(el).backgroundColor,
        copyOpacity: getComputedStyle(copy).opacity,
        stillOpacity: getComputedStyle(still).opacity,
        alt: still.alt,
      };
    }),
  );
  for (let i = 0; i < boxes.length; i++) {
    expect(boxes[i].height, `stage ${i + 1} has no height`).toBeGreaterThan(300);
    expect(boxes[i].copyOpacity, `stage ${i + 1} copy is hidden`).toBe("1");
    expect(boxes[i].stillOpacity, `stage ${i + 1} still is hidden`).toBe("1");
    expect(boxes[i].alt, `stage ${i + 1} still has no alt`).toMatch(/^Illustration:/);
    if (i > 0) {
      expect(boxes[i].top, `stage ${i + 1} overlaps the one before`).toBeGreaterThanOrEqual(
        boxes[i - 1].top + boxes[i - 1].height - 1,
      );
      expect(boxes[i].bg, `stage ${i + 1} shares a ground`).not.toBe(boxes[i - 1].bg);
    }
  }
  await ctx.close();
});

test("reduced motion gets the stacked story, with nothing pinned", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.waitForTimeout(500);

  const r = await page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>("[data-story-stage]")!;
    const last = [...document.querySelectorAll<HTMLElement>("[data-story-copy]")].at(-1)!;
    return {
      position: getComputedStyle(stage).position,
      lastOpacity: getComputedStyle(last).opacity,
      framesRequested: performance
        .getEntriesByType("resource")
        .filter((e) => e.name.includes("/frames-")).length,
    };
  });
  expect(r.position).not.toBe("sticky");
  expect(r.lastOpacity).toBe("1");
  // No frame sequence is downloaded for someone who will never see it play.
  expect(r.framesRequested).toBe(0);
  await ctx.close();
});

test("pinned, the picture and the ground follow the scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const go = (u: number) =>
    page.evaluate((u) => {
      const s = document.querySelector<HTMLElement>("[data-story]")!;
      const st = document.querySelector<HTMLElement>("[data-story-stage]")!;
      const travel = s.offsetHeight - st.offsetHeight;
      const top =
        s.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(st).top);
      window.scrollTo(0, top + (u / (5 - 1 + 0.22)) * travel);
    }, u);

  const read = () =>
    page.evaluate(() => {
      const st = document.querySelector<HTMLElement>("[data-story-stage]")!;
      const copies = [...document.querySelectorAll<HTMLElement>("[data-story-copy]")];
      return {
        position: getComputedStyle(st).position,
        ground: getComputedStyle(st).backgroundColor,
        visible: copies.map((c) => Number(getComputedStyle(c).opacity) > 0.9),
        canvas: getComputedStyle(document.querySelector(".story-canvas")!).opacity,
      };
    });

  const start = await read();
  expect(start.position).toBe("sticky");
  expect(start.visible).toEqual([true, false, false, false, false]);

  // Frames arrive after idle. Wait for the canvas to take over from the stills.
  await expect
    .poll(async () => (await read()).canvas, { timeout: 15_000 })
    .toBe("1");

  const grounds = [start.ground];
  for (let i = 1; i < STAGES; i++) {
    await go(i);
    await expect
      .poll(async () => (await read()).visible[i], { timeout: 5_000 })
      .toBe(true);
    const now = await read();
    // Exactly one stage of copy on screen at a hold, never two fighting.
    expect(now.visible.filter(Boolean).length, `stage ${i + 1}`).toBe(1);
    grounds.push(now.ground);
  }
  expect(new Set(grounds).size, "every stage has its own ground").toBe(STAGES);

  // Scroll back and it rewinds: the story is tied to position, not to a timer.
  await go(0);
  await expect.poll(async () => (await read()).visible[0], { timeout: 5_000 }).toBe(true);
});

test("no stage of the story carries a red or orange ground", () => {
  // The owner's palette rule. Grounds are sampled from generated frames, so a
  // re-render could drift without anyone choosing it.
  const manifest = JSON.parse(
    readFileSync("src/lib/story-frames.json", "utf8"),
  ) as { clips: { bg: string[] }[] };
  for (const clip of manifest.clips) {
    for (const hexColour of clip.bg) {
      const n = parseInt(hexColour.slice(1), 16);
      const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      const warm = r > 150 && r - b > 70 && r - g > 40;
      expect(warm, `${hexColour} reads as red or orange`).toBe(false);
    }
  }
});
