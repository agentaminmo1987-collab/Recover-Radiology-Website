# Recover Radiology

Public website for Recover Radiology, a bulk billed diagnostic imaging practice
in Morphett Vale, South Australia.

**Live:** https://recover-radiology-web.vercel.app

Not to be confused with `recover-radiology/` in this workspace, which is the
internal marketing dashboard and referral CRM. Different product, different repo.

## Run it

```bash
npm install
npm run dev          # http://localhost:3270
npm run build && npx next start
```

## Test it

```bash
npx playwright test  # 36 tests + screenshots at 4 widths, against a prod build
```

Tests run against a production build, never the dev server: dev serves different
CSS and different chunking, so a pass there says nothing about what ships.

## Regenerate assets

```bash
node scripts/optimise-images.mjs   # masters in public/img/_raw -> AVIF + WebP
```

Masters are gitignored. 237 MB in, 7.2 MB shipped.

## Read these before changing anything

| File | Why |
|---|---|
| `BRAND.md` | The measured palette and the rule that governs it |
| `VOICE.md` | How this practice is allowed to sound, and the banned-phrase table |
| `DESIGN-DECISIONS.md` | What was rejected and why |
| `SECURITY.md` | The secure-data-access checklist result |
| `PERF.md` | Lighthouse, budgets, and where the headroom is thin |
| `QUESTIONS.md` | Everything parked for the client, each with a default applied |

## Three constraints that are not preferences

**AHPRA section 133.** This is a regulated health service. No testimonials, no
ratings, no reviews, no superlatives, no before-and-after imagery. A Playwright
test guards the one claim most likely to drift: the bulk billing headline must
never ship without its exception beside it.

**`lib/clinic.ts` is a closed fact set.** Every clinical claim, preparation
instruction, duration and billing rule lives there and came from the practice.
If a component needs a fact that is not in it, that gets a marked placeholder and
a line in `QUESTIONS.md`, never an invention. An assistant confidently repeating
a wrong fasting time is a clinical problem, not a marketing one.

**The palette is inverted.** Forest and Bloom are the only brand colours that may
carry type; Sky, Moss, Rain and Dust are backgrounds only. That is the brand's own
rule from the style guide, and measurement agrees with it on every line.

## Stack

Next.js 16 App Router, TypeScript strict, Tailwind v4 with a three-layer token
system, zod, Playwright, Vercel. Almost everything is a Server Component: the
only client components are the enquiry form, the scroll logo and the video mount.
