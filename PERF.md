# Performance

Measured on the deployed site, **https://recover-radiology-web.vercel.app**, on
2026-08-12. Lighthouse 12, headless Chrome. Not the dev server and not a local
build: these are the numbers a real visitor gets.

## Lighthouse

| | Desktop | Mobile |
|---|---|---|
| Performance | **100** | **97** |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |

Mobile is the throttled run: simulated mid-tier device on 4G, which is the
condition §4.5 actually specifies.

## Core Web Vitals against the brief's budgets

| Metric | Target (§4.5) | Desktop | Mobile |
|---|---|---|---|
| LCP | < 2.5 s | **0.5 s** | **2.4 s** |
| CLS | < 0.1 | **0** | **0** |
| TBT | proxy for INP < 200 ms | **0 ms** | **70 ms** |
| FCP | not specified | — | 0.9 s |
| Speed Index | not specified | — | 1.2 s |

Every budget in the brief is met.

**Mobile LCP has almost no headroom.** 2.4 s against a 2.5 s target is a pass,
not a comfortable one. The hero poster is the LCP element, so anything that
grows it, or any change that lets the video become the LCP element instead, will
blow the budget. This is the number to re-check after any hero change.

## Why the numbers hold

**The video is never in the critical path.** A 6.5 MB loop sits behind the hero,
but the poster image is what paints and what LCP measures. The video carries
`preload="none"`, is only mounted after first paint via `requestIdleCallback`,
and is skipped entirely under `prefers-reduced-motion`, Data Saver, or a 2g
connection. It also pauses when scrolled out of view rather than decoding frames
nobody is looking at.

**Almost everything is a Server Component.** The only client components on the
site are the enquiry form, the scroll logo, the video mount and the Lenis
smooth-scroll initialiser. Nothing else ships JavaScript.

**There is no WebGL on this site.** The background shader field was removed
along with three.js, react-three-fiber, drei, postprocessing and gsap. Removing
them did NOT shrink the bundle, because nothing had imported them since the
video hero replaced the canvas and tree-shaking had already dropped them. The
gain is install size and maintenance surface, not runtime.

**CLS is 0, not merely under budget.** Every image has explicit dimensions or a
fixed aspect container, and the fonts are self-hosted through `next/font` with
no external stylesheet to block or swap.

## Assets

| | |
|---|---|
| Images shipped, AVIF + WebP | 7.2 MB total across all responsive widths |
| Image masters, gitignored, never served | 237 MB |
| Hero video | 6.5 MB, lazy, never blocking |
| Total transfer on first load, mobile | 3.87 MB |

That transfer figure looks large and is mostly the video, which arrives after
paint. The measured LCP is the honest number for what a visitor experiences.

## Test suite

36 Playwright tests, all passing, run against a production build. Screenshots
captured for 13 routes at 390, 768, 1440 and 2560, 52 images in `screenshots/`.

```bash
npm run build && npx playwright test
```

## Remaining Lighthouse suggestions

All are informational rather than budget failures, and each is a deliberate
trade:

- **Enormous network payload / next-gen images.** The hero video. Already
  deferred, gated and pausable. Reducing it further means re-encoding the
  supplied render, which is a client asset decision rather than a code one.
- **Unused JavaScript / legacy JavaScript.** Next.js framework chunks and its
  browser-target polyfills. Not ours to remove without ejecting from the
  framework.
- **LCP request discovery.** The poster is a CSS background on the video mount,
  so the preload scanner cannot see it early. Worth revisiting if mobile LCP
  ever needs to come down: moving the poster to a real `<img>` with `priority`
  would let Next preload it.

## Not yet measured

- **A real mobile device.** These are simulated conditions, which are a
  reasonable proxy and not the same thing.
- **Field data.** No real user monitoring yet. Vercel Speed Insights is the
  cheapest way to get it and is not wired up.
