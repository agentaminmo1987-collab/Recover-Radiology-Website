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
  "/interventional/cortisone-injection",
  "/interventional/nerve-root-block",
  "/our-clinic",
  "/our-team",
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
  // Walks every route in one body, so it needs more than the default budget
  // when the screenshot tests are saturating the machine alongside it.
  test.setTimeout(120_000);
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
  // Wait for images to actually decode rather than guessing with a fixed
  // delay. Image-heavy pages at 2560 full-page were timing out on the guess.
  await page
    .waitForFunction(
      () => [...document.images].every((i) => i.complete),
      undefined,
      { timeout: 15_000 },
    )
    .catch(() => {});
  await page.waitForTimeout(300);
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
    test.setTimeout(180_000);
    for (const [w, h] of WIDTHS) await shoot(page, path, name, w, h);
  });
}

test("button hover: lift, ghost fill, and an echo that leaves nothing behind", async ({
  page,
}) => {
  // Samples an animation mid-flight, so it is sensitive to a loaded machine.
  test.setTimeout(60_000);
  await page.goto("/");
  const cta = page.locator('main a[href="/contact"]').first();
  // Selected by the class under test, not by a route. An earlier version of
  // this test named a[href="/x-ray"], which was the hero's ghost button until
  // that CTA changed; the selector then quietly resolved to a plain service
  // card and asserted the card's background instead of a button's.
  const ghost = page.locator("main a.btn-ghost").first();

  // The echo must be invisible at rest. An earlier version used a transition,
  // which needed a visible resting state to travel from and left a permanent
  // second outline around the button.
  await page.mouse.move(0, 0);
  const restOpacity = await cta.evaluate(
    (e) => +getComputedStyle(e, "::after").opacity,
  );
  expect(restOpacity).toBe(0);

  await cta.hover();
  await page.waitForTimeout(60);
  const mid = await cta.evaluate((e) => {
    const a = getComputedStyle(e, "::after");
    const s = getComputedStyle(e);
    return { echo: +a.opacity, transform: s.transform, shadow: s.boxShadow };
  });
  expect(mid.echo, "echo should be visible just after entry").toBeGreaterThan(0.1);
  expect(mid.transform, "button should lift").not.toBe("none");
  expect(mid.shadow, "button should bloom").not.toBe("none");

  // Ghost fills rather than only recolouring its outline.
  await ghost.hover();
  await page.waitForTimeout(120);
  const bg = await ghost.evaluate((e) => getComputedStyle(e).backgroundColor);
  expect(bg).toContain("245, 243, 228"); // Dust 30
});

test("reduced motion removes the lift and the echo, keeps the colour", async ({
  browser,
}) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  const cta = page.locator('main a[href="/contact"]').first();
  await cta.hover();
  await page.waitForTimeout(120);
  const s = await cta.evaluate((e) => ({
    transform: getComputedStyle(e).transform,
    echoDisplay: getComputedStyle(e, "::after").display,
    bg: getComputedStyle(e).backgroundColor,
  }));
  expect(s.transform, "no lift under reduced motion").toBe("none");
  expect(s.echoDisplay, "no echo under reduced motion").toBe("none");
  expect(s.bg, "colour feedback is kept").not.toBe("rgba(0, 0, 0, 0)");
  await ctx.close();
});

/* ------------------------------------------------- booking form and uploads */

test("the enquiry form asks for a preferred date and time", async ({ page }) => {
  await page.goto("/contact");

  const date = page.locator('input[name="preferredDate"]');
  await expect(date).toHaveAttribute("type", "date");
  // Bounds are applied after mount, so wait for the effect rather than racing it.
  await expect(date).toHaveAttribute("min", /^\d{4}-\d{2}-\d{2}$/);
  await expect(date).toHaveAttribute("max", /^\d{4}-\d{2}-\d{2}$/);

  // Time is a fixed set of options, never free text. A typed "10:15am" would
  // read to the patient as a slot they had secured.
  const time = page.locator('select[name="preferredTime"]');
  await expect(time).toBeVisible();
  expect(await time.locator("option").count()).toBeGreaterThan(3);
});

test("the referral upload accepts documents and photos, not scripts", async ({
  page,
}) => {
  await page.goto("/contact");
  const input = page.locator('input[name="referral"]');
  await expect(input).toHaveAttribute("type", "file");
  await expect(input).toHaveAttribute("multiple", "");

  const accept = (await input.getAttribute("accept")) ?? "";
  for (const ext of [".pdf", ".jpg", ".png", ".heic"]) {
    expect(accept, `${ext} should be offered`).toContain(ext);
  }
  // SVG is script. It must never appear in the picker, and the server sniff
  // rejects it regardless of what the picker allows.
  expect(accept.toLowerCase()).not.toContain("svg");
});

test("every form control still has its own visible label", async ({ page }) => {
  await page.goto("/contact");
  const orphans = await page.evaluate(() => {
    const out: string[] = [];
    document
      .querySelectorAll<HTMLElement>("form input, form select, form textarea")
      .forEach((el) => {
        const name = el.getAttribute("name") ?? "";
        if (name === "website" || el.getAttribute("type") === "hidden") return;
        if (!el.id || !document.querySelector(`label[for="${el.id}"]`)) out.push(name);
      });
    return out;
  });
  expect(orphans, JSON.stringify(orphans)).toHaveLength(0);
});

test("the privacy notice covers uploaded referrals", async ({ page }) => {
  await page.goto("/legal/privacy");
  const body = (await page.locator("main").innerText()).toLowerCase();

  // The site now solicits health information, so the old "do not send clinical
  // information" framing must not survive anywhere on this page.
  expect(body).toContain("referral");
  expect(body).not.toContain("not a secure channel");
});

/* ----------------------------------------------------------- call to action */

test("every phone button carries the number, never just 'call us'", async ({
  page,
}) => {
  for (const path of ["/", "/x-ray", "/ct", "/billing", "/our-team"]) {
    await page.goto(path);
    const labels = await page
      .locator('a[href^="tel:"]')
      .evaluateAll((els) => els.map((e) => (e.textContent ?? "").trim()));

    expect(labels.length, `${path} should offer a phone link`).toBeGreaterThan(0);
    for (const label of labels) {
      // Anything that reads as a button must state the number. A bare "Call us"
      // two sections below the number makes a visitor stop and reconcile them.
      expect(label, `${path}: "${label}"`).toContain(PHONE);
    }
  }
});

test("service pages name the scan in their booking CTA", async ({ page }) => {
  const expected: [string, string][] = [
    ["/x-ray", "Book an X-ray"],
    ["/ct", "Book a CT scan"],
    ["/ultrasound", "Book an ultrasound"],
    ["/interventional", "Book a procedure"],
  ];
  for (const [path, label] of expected) {
    await page.goto(path);
    await expect(
      page.locator("main a", { hasText: label }).first(),
      `${path} should say "${label}"`,
    ).toBeVisible();
  }
});

/* --------------------------------------------------- interventional details */

test("each procedure links to a page that states risks and aftercare", async ({
  page,
}) => {
  await page.goto("/interventional");
  const links = page.locator('main a[href^="/interventional/"]');
  expect(await links.count(), "every procedure should link out").toBeGreaterThan(4);

  await page.goto("/interventional/cortisone-injection");
  const body = await page.locator("main").innerText();
  for (const heading of [
    "What it is",
    "How it is performed",
    "Benefits",
    "Risks",
    "Afterwards",
  ]) {
    expect(body, `missing "${heading}"`).toContain(heading);
  }
});

test("the blood thinner warning appears on every procedure page", async ({
  page,
}) => {
  // The single most consequential thing a patient can fail to mention, and
  // someone arriving from a search may never see /interventional itself.
  for (const slug of ["", "/cortisone-injection", "/epidural-injection"]) {
    await page.goto(`/interventional${slug}`);
    const body = (await page.locator("main").innerText()).toLowerCase();
    expect(body, `/interventional${slug}`).toContain("blood thinning");
  }
});

test("unreviewed clinical pages stay out of search", async ({ page, request }) => {
  // procedures.ts ships with signedOff false until a radiologist reads each
  // page. Until then the page is linked and readable but must not be indexed.
  await page.goto("/interventional/cortisone-injection");
  const robots = await page
    .locator('meta[name="robots"]')
    .getAttribute("content");
  expect(robots ?? "", "unsigned procedure should be noindex").toContain("noindex");

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/interventional/cortisone-injection");
});

/* --------------------------------------------------------------- navigation */

test("the main nav is grouped, not a flat list of everything", async ({ page }) => {
  await page.goto("/");
  const top = page.locator('nav[aria-label="Main"] > ul > li');
  const count = await top.count();
  // Past about seven, a nav stops being scannable and becomes a list you read.
  expect(count, "top level nav should stay short").toBeLessThanOrEqual(6);

  // Grouping must not cost reachability: every destination still has a link in
  // the header markup, open or not.
  const hrefs = await page
    .locator('nav[aria-label="Main"] a')
    .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  for (const href of [
    "/ultrasound",
    "/ct",
    "/x-ray",
    "/interventional",
    "/patient-information",
    "/billing",
    "/contact",
    "/our-clinic",
    "/our-team",
    "/about",
    "/referrers",
  ]) {
    expect(hrefs, `${href} should be reachable from the header`).toContain(href);
  }
});

test("nav menus open on keyboard focus, not hover alone", async ({ page }) => {
  await page.goto("/");
  const panel = page
    .locator('nav[aria-label="Main"] > ul > li')
    .first()
    .locator("div")
    .first();

  await page.mouse.move(0, 0);
  expect(await panel.evaluate((e) => getComputedStyle(e).visibility)).toBe("hidden");

  await page.locator('nav[aria-label="Main"] a').first().focus();
  await page.waitForTimeout(120);
  expect(
    await panel.evaluate((e) => getComputedStyle(e).visibility),
    "focus-within must open the menu, or keyboard users cannot reach it",
  ).toBe("visible");
});

test("procedures are named by what they treat, not by product brand", async ({
  page,
}) => {
  // Dropped 2026-08-12 at the practice's direction. A brand name is not what a
  // patient with an arthritic knee searches for, and advertising a therapeutic
  // product by brand is its own regulatory problem.
  for (const path of ["/interventional", "/interventional/osteoarthritis-injection"]) {
    await page.goto(path);
    const body = (await page.locator("main").innerText()).toLowerCase();
    expect(body, `${path} still names the brand`).not.toContain("euflexxa");
  }
});

test("the interventional page covers every procedure the practice performs", async ({
  page,
}) => {
  await page.goto("/interventional");
  const body = await page.locator("main").innerText();
  for (const name of [
    "Cortisone Injection",
    "Osteoarthritis Injection",
    "Hydrodilatation",
    "Facet Joint Injection",
    "Nerve Root Block",
    "Epidural Injection",
    "Medial Branch Block",
    "Fine Needle Aspiration and Core Biopsy",
  ]) {
    expect(body, `missing ${name}`).toContain(name);
  }
});

test("billing covers work and motor vehicle claims, not private health", async ({
  page,
}) => {
  await page.goto("/billing");
  const body = (await page.locator("main").innerText()).toLowerCase();
  expect(body).toContain("returntoworksa");
  expect(body).toContain("motor vehicle");
  // Removed at the practice's direction 2026-08-12.
  expect(body).not.toContain("private health insurance");
});

test("the team page names radiographers as well as sonographers", async ({
  page,
}) => {
  await page.goto("/our-team");
  const body = await page.locator("main").innerText();
  for (const name of ["Matt", "David", "Laura", "Marlon", "Yasna"]) {
    expect(body, `missing ${name}`).toContain(name);
  }
  expect(body).toContain("Radiography");

  // AHPRA s133: no superlatives about a regulated health service.
  const lower = body.toLowerCase();
  for (const word of ["highly talented", "best ", "leading ", "expert", "world class"]) {
    expect(lower, `superlative "${word.trim()}" must not ship`).not.toContain(word);
  }
});

test("no procedure page points at a service the practice does not offer", async ({
  page,
}) => {
  // The practice confirmed 2026-08-12 that it does not perform radiofrequency
  // ablation. A page that gestures at a next step we do not provide sets up a
  // conversation the referring doctor then has to unwind.
  const absent = ["radiofrequency", "ablation", "longer lasting treatment"];
  for (const slug of [
    "medial-branch-block",
    "facet-joint-injection",
    "nerve-root-block",
  ]) {
    await page.goto(`/interventional/${slug}`);
    const body = (await page.locator("main").innerText()).toLowerCase();
    for (const term of absent) {
      expect(body, `${slug} mentions "${term}"`).not.toContain(term);
    }
  }
});

test("map links point at the practice's own listing, and no rating is quoted", async ({
  page,
}) => {
  for (const path of ["/", "/contact"]) {
    await page.goto(path);
    const hrefs = await page
      .locator('main a[href*="maps"], main a[href*="google"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute("href") ?? ""));
    expect(hrefs.length, `${path} should link to Maps`).toBeGreaterThan(0);
    for (const href of hrefs) {
      // cid resolves to the Business Profile, which carries the hours, photos
      // and directions. A lat/lng search just drops an anonymous pin.
      expect(href, `${path}: ${href}`).toContain("cid=");
    }
  }

  // AHPRA s133 prohibits using ratings or testimonials to advertise a regulated
  // health service. The Google listing has a score; it must never appear here.
  for (const path of ["/", "/contact", "/about", "/our-team"]) {
    await page.goto(path);
    const body = await page.locator("body").innerText();
    expect(body, `${path} quotes a star rating`).not.toMatch(
      /\b[1-5]\.\d\s*(stars?|\/\s*5|out of 5)/i,
    );
    expect(body.toLowerCase()).not.toContain("google review");
  }
});

/* -------------------------------------------------------------- mobile hero */

test("the booking CTA is on screen without scrolling, on a phone", async ({
  browser,
}) => {
  // It rendered fine and clicked fine; it was simply below the fold at load, so
  // a phone user landed on the home page with no visible booking button. The
  // fixed bottom bar covers the last ~73px, which the hero did not account for.
  const sizes: [number, number, string][] = [
    [320, 568, "small phone"],
    [390, 664, "iPhone"],
    [412, 839, "large android"],
  ];
  for (const [width, height, label] of sizes) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      hasTouch: true,
      isMobile: true,
    });
    const page = await ctx.newPage();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    const r = await page.evaluate(() => {
      const el = document.querySelector('main a[href="/contact"]')!;
      const rect = el.getBoundingClientRect();
      const bar = document.querySelector(".fixed.inset-x-0.bottom-0");
      const barTop = bar ? bar.getBoundingClientRect().top : window.innerHeight;
      return { top: rect.top, bottom: rect.bottom, barTop };
    });

    expect(r.top, `${label}: CTA above the viewport`).toBeGreaterThanOrEqual(0);
    expect(
      r.bottom,
      `${label}: CTA bottom ${Math.round(r.bottom)} is under the booking bar at ${Math.round(r.barTop)}`,
    ).toBeLessThanOrEqual(r.barTop);
    await ctx.close();
  }
});

test("the mobile menu closes itself when left alone", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 664 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(600);

  const open = () =>
    page.evaluate(() => {
      const el = document.getElementById("mobile-menu");
      return el instanceof HTMLDetailsElement ? el.open : null;
    });
  const tapSummary = async () => {
    await page.locator("#mobile-menu > summary").tap();
    await page.waitForTimeout(200);
  };

  await tapSummary();
  expect(await open(), "menu should open").toBe(true);

  // Still open partway through: the timer measures idle time, so it must not
  // close in the face of someone still reading it.
  await page.waitForTimeout(3000);
  expect(await open(), "must not close early").toBe(true);

  await page.waitForTimeout(2800);
  expect(await open(), "should close once idle").toBe(false);

  // Escape and outside tap, neither of which a bare <details> gives you.
  await tapSummary();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  expect(await open(), "Escape should close it").toBe(false);

  await tapSummary();
  await page.touchscreen.tap(30, 400);
  await page.waitForTimeout(300);
  expect(await open(), "tapping outside should close it").toBe(false);

  await ctx.close();
});

test("the menu still opens with JavaScript disabled", async ({ browser }) => {
  // The auto-close is an enhancement. The menu itself is a native <details> and
  // must keep working without it.
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 664 },
    javaScriptEnabled: false,
  });
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // Two disclosures deep by design: the sheet, then the group. That is what
  // keeps it to four rows instead of eleven, and both levels are native
  // <details>, so both work without a line of script.
  await page.locator("#mobile-menu > summary").click();
  await expect(
    page.locator("#mobile-menu summary", { hasText: "Services" }),
  ).toBeVisible();

  await page.locator("#mobile-menu summary", { hasText: "Services" }).click();
  await expect(page.locator('#mobile-menu a[href="/ultrasound"]')).toBeVisible();
  await ctx.close();
});

/* --------------------------------------------------------------- trust band */

test("each trust fact links to the page that substantiates it", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page
    .locator(".trust-item a")
    .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  expect(hrefs).toEqual(["/billing", "/ultrasound", "/x-ray", "/contact"]);

  // The visible affordance is aria-hidden, so the accessible name has to carry
  // the destination itself or the link reads as a bare fact to a screen reader.
  const names = await page
    .locator(".trust-item a")
    .evaluateAll((els) => els.map((e) => (e.textContent ?? "").trim()));
  expect(names[0]).toContain("What is covered");
  expect(names[2]).toContain("About X-ray");
});

test("the trust highlight is driven by scroll position, not a timer", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(800);

  const supported = await page.evaluate(() =>
    CSS.supports("animation-timeline: view()"),
  );
  test.skip(!supported, "no scroll-driven animation support in this browser");

  const read = () =>
    page.evaluate(() =>
      [...document.querySelectorAll(".trust-item")].map((it) => {
        const rule = it.querySelector(".trust-item__rule")!;
        return new DOMMatrixReadOnly(getComputedStyle(rule).transform).a;
      }),
    );

  const bandTop = await page.evaluate(() => {
    const s = document.querySelector(".trust-item")!.closest("section")!;
    return s.getBoundingClientRect().top + window.scrollY;
  });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const before = await read();
  expect(Math.max(...before), "nothing highlighted before the band arrives").toBeLessThan(0.1);

  // Partway: the point of the stagger is that the items are NOT in step.
  await page.evaluate((y) => window.scrollTo(0, y), bandTop - 520);
  await page.waitForTimeout(500);
  const mid = await read();
  expect(mid[0], "first item leads").toBeGreaterThan(mid[3]);

  await page.evaluate((y) => window.scrollTo(0, y), bandTop);
  await page.waitForTimeout(500);
  const after = await read();
  expect(Math.min(...after), "all highlighted once the band is up").toBeGreaterThan(0.9);

  // Scroll-linked, not fire-once: going back up must un-highlight.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  expect(Math.max(...(await read())), "must reverse on scroll up").toBeLessThan(0.1);
});

test("trust band text is never mid-fade unreadable, and reduced motion keeps meaning", async ({
  browser,
}) => {
  // Deliberately no opacity fade on the text: the colour travels between two
  // legible endpoints instead, so stopping mid-scroll never leaves it washed out.
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.waitForTimeout(800);

  const bandTop = await page.evaluate(() => {
    const s = document.querySelector(".trust-item")!.closest("section")!;
    return s.getBoundingClientRect().top + window.scrollY;
  });
  await page.evaluate((y) => window.scrollTo(0, y - 300), bandTop);
  await page.waitForTimeout(500);

  const state = await page.evaluate(() =>
    [...document.querySelectorAll(".trust-item")].map((it) => {
      const v = it.querySelector(".trust-item__value")!;
      const r = it.querySelector(".trust-item__rule")!;
      return {
        opacity: getComputedStyle(v).opacity,
        scaleX: new DOMMatrixReadOnly(getComputedStyle(r).transform).a,
      };
    }),
  );

  for (const s of state) {
    expect(s.opacity, "value text must never be faded out").toBe("1");
    // The wipe is decoration and is dropped; the colour change carries meaning
    // and is kept.
    expect(s.scaleX, "rule must not animate under reduced motion").toBe(1);
  }
  await ctx.close();
});

test("the trust link affordance is visible on touch, where hover never fires", async ({
  browser,
}) => {
  // An opacity-0-until-hover affordance is invisible forever on a phone. This
  // also guards the Tailwind arbitrary-variant trap: the media-query variant
  // compiled to zero rules and the markup looked correct the whole time.
  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const p1 = await touch.newPage();
  await p1.goto("/");
  await p1.waitForTimeout(600);
  const onTouch = await p1
    .locator(".trust-item__more")
    .evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(onTouch.every((o) => o === "1"), JSON.stringify(onTouch)).toBe(true);
  await touch.close();

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p2 = await desktop.newPage();
  await p2.goto("/");
  const link = p2.locator('.trust-item a[href="/billing"]');
  await link.scrollIntoViewIfNeeded();
  const more = p2.locator('.trust-item a[href="/billing"] .trust-item__more');
  expect(await more.evaluate((e) => getComputedStyle(e).opacity)).toBe("0");
  await link.hover();
  await p2.waitForTimeout(400);
  expect(await more.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
  await desktop.close();
});

test("the service cards and the cost list highlight on scroll too", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(800);
  const supported = await page.evaluate(() =>
    CSS.supports("animation-timeline: view()"),
  );
  test.skip(!supported, "no scroll-driven animation support in this browser");

  for (const [label, sel] of [
    ["service cards", "#services li"],
    ["cost list", "#billing dl > div"],
  ] as const) {
    const top = await page.evaluate((s) => {
      const el = document.querySelector(s)!;
      return el.getBoundingClientRect().top + window.scrollY;
    }, sel);

    const read = async (y: number) => {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(450);
      return page.evaluate(
        (s) =>
          [...document.querySelectorAll(s)].map((it) => {
            const r = it.querySelector(".rr-hl__rule")!;
            return new DOMMatrixReadOnly(getComputedStyle(r).transform).a;
          }),
        sel,
      );
    };

    const before = await read(Math.max(0, top - 1400));
    expect(Math.max(...before), `${label}: dark before it arrives`).toBeLessThan(0.1);

    const mid = await read(top - 520);
    expect(mid[0], `${label}: first leads`).toBeGreaterThan(mid[mid.length - 1]);

    // Scroll-linked, so going back up must reverse it.
    const again = await read(Math.max(0, top - 1400));
    expect(Math.max(...again), `${label}: reverses`).toBeLessThan(0.1);
  }
});

test("no ancestor of a scroll timeline creates a scroll container", async ({
  page,
}) => {
  // overflow:hidden makes an element a scroll container, so view() on any
  // descendant resolves against IT and the timeline freezes at a fixed value
  // forever. It happened here: the service card list used overflow-hidden for
  // its rounded corners, the animations stayed attached with a real
  // ViewTimeline, and nothing in the markup or the keyframes looked wrong.
  // clip-path masks the same way without creating a scroll container.
  await page.goto("/");
  await page.waitForTimeout(600);

  const clipped = await page.evaluate(() => {
    const bad: string[] = [];
    document.querySelectorAll(".rr-hl__rule, .trust-item__rule").forEach((el) => {
      let n = el.parentElement;
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        if (cs.overflow !== "visible" && cs.overflow !== "") {
          bad.push(
            `${n.tagName}.${String(n.className).slice(0, 40)} -> overflow:${cs.overflow}`,
          );
          break;
        }
        n = n.parentElement;
      }
    });
    return [...new Set(bad)];
  });

  expect(clipped, JSON.stringify(clipped, null, 1)).toHaveLength(0);
});
