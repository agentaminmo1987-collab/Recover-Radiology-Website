import { test, expect, type Page } from "@playwright/test";

/**
 * Smoke tests for every route, plus the checks that are easy to break and hard
 * to notice: one h1 per page, keyboard reachability, the form's no-JS path, and
 * the facts that must never drift (phone, address, the bulk billing exception).
 */

const ROUTES = [
  "/",
  "/ultrasound",
  "/ct",
  "/x-ray",
  "/interventional",
  "/our-clinic",
  "/patient-information",
  "/billing",
  "/referrers",
  "/about",
  "/contact",
  "/insights",
  "/legal/privacy",
];

const PHONE = "08 7081 3078";

test.describe("every route", () => {
  for (const path of ROUTES) {
    test(`${path} renders and is well formed`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status(), `${path} should be 200`).toBe(200);

      // Exactly one h1. More than one breaks the document outline; none breaks
      // it worse.
      await expect(page.locator("h1")).toHaveCount(1);

      // Title and description are what search and assistants quote.
      await expect(page).toHaveTitle(/Recover Radiology/);
      const desc = page.locator('meta[name="description"]');
      await expect(desc).toHaveAttribute("content", /.{60,}/);

      // NAP must be crawlable text on every page: the whole commercial value
      // of this site is local search.
      await expect(page.locator("footer")).toContainText(PHONE);
      await expect(page.locator("footer")).toContainText("Morphett Vale");

      // Landmarks.
      await expect(page.locator("main#main")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    });
  }
});

test("heading order never skips a level", async ({ page }) => {
  for (const path of ROUTES) {
    await page.goto(path);
    const levels = await page
      .locator("h1,h2,h3,h4")
      .evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    for (let i = 1; i < levels.length; i++) {
      expect(
        levels[i] - levels[i - 1],
        `${path} jumps from h${levels[i - 1]} to h${levels[i]}`,
      ).toBeLessThanOrEqual(1);
    }
  }
});

test("skip link is the first thing keyboard focus reaches", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.textContent);
  expect(focused).toContain("Skip to content");
});

test("every interactive target clears 44px, inline links excepted", async ({
  page,
}) => {
  await page.goto("/");
  const small = await page.evaluate(() => {
    const out: { tag: string; text: string; h: number }[] = [];
    document
      .querySelectorAll("a[href],button,summary,input,select,textarea")
      .forEach((el) => {
        const e = el as HTMLElement;
        if (!e.offsetParent || e.closest(".sr-only")) return;
        // WCAG 2.5.8 exempts targets inline in a sentence.
        if (e.tagName === "A" && e.closest("p")) return;
        const h = e.getBoundingClientRect().height;
        if (h > 1 && h < 44)
          out.push({ tag: e.tagName, text: (e.textContent ?? "").trim().slice(0, 24), h });
      });
    return out;
  });
  expect(small, JSON.stringify(small)).toHaveLength(0);
});

test("the bulk billing exception is never separated from the claim", async ({
  page,
}) => {
  // The single most compliance-sensitive statement on the site. If the headline
  // ever ships without the exception beside it, that is misleading advertising
  // by a regulated health service.
  for (const path of ["/", "/billing"]) {
    await page.goto(path);
    const body = await page.locator("main").innerText();
    expect(body).toContain("Most services are bulk billed");
    expect(body.toLowerCase()).toContain("obstetric");
  }
});

test("enquiry form works with JavaScript disabled", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/contact");
  // Server-rendered, real form element, real inputs. Progressive enhancement is
  // the point: the client bundle adds inline errors, not the ability to submit.
  await expect(page.locator("form")).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="phone"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  await ctx.close();
});

test("every form field has a real label", async ({ page }) => {
  await page.goto("/contact");
  const unlabelled = await page.evaluate(() =>
    [...document.querySelectorAll("input:not([type=hidden]),select,textarea")]
      .filter((el) => {
        const e = el as HTMLElement;
        if (!e.offsetParent) return false;
        return !document.querySelector(`label[for="${e.id}"]`);
      })
      .map((e) => (e as HTMLInputElement).name),
  );
  expect(unlabelled).toHaveLength(0);
});

test("honeypot stays hidden from everyone", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('input[name="website"]')).toBeHidden();
});

test("SEO endpoints serve", async ({ page }) => {
  for (const [path, must] of [
    ["/sitemap.xml", "<urlset"],
    ["/robots.txt", "Sitemap:"],
    ["/llms.txt", "# Recover Radiology"],
  ] as const) {
    const res = await page.request.get(path);
    expect(res.status(), path).toBe(200);
    expect(await res.text(), path).toContain(must);
  }
});

test("structured data is valid JSON and names the right type", async ({
  page,
}) => {
  await page.goto("/");
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(blocks.length).toBeGreaterThan(0);
  const types = blocks.map((b) => JSON.parse(b)["@type"]);
  expect(types).toContain("MedicalBusiness");
});

test("404 returns a real page", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("does not exist");
});

async function shoot(page: Page, path: string, name: string, w: number, h: number) {
  await page.setViewportSize({ width: w, height: h });
  // Not networkidle: the hero video loops, so the network never goes idle and
  // the wait always burns its full timeout.
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  await page.screenshot({
    path: `screenshots/${name}-${w}.png`,
    fullPage: true,
    animations: "disabled",
  });
}

const WIDTHS: [number, number][] = [
  [390, 844],
  [768, 1024],
  [1440, 900],
  [2560, 1440],
];

// One test per route, so a single slow page cannot take the whole capture down
// with it and the failure names the page.
for (const path of ROUTES) {
  const name = path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-");
  test(`screenshots: ${name}`, async ({ page }) => {
    test.setTimeout(90_000);
    for (const [w, h] of WIDTHS) await shoot(page, path, name, w, h);
  });
}
