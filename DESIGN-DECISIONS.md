# Design decisions, Phase A step 1

Source: `ui-ux-pro-max` v2.13.0, queried 2026-08-11 with
`--design-system --variance 6 --motion 8 --density 3`, plus targeted queries on
the `style`, `typography`, `ux`, `nextjs` and `threejs` domains.

The brief (§3) says to follow the skill where it recommends something better.
It does on the technical guidance. It does not on three points, and those
rejections are recorded here with reasons so nobody quietly reverts them.

## Rejected

### 1. Pattern: "Social Proof-Focused"

The database's top landing pattern for this vertical puts social proof above the
fold. **This is prohibited.** Recover Radiology is a regulated health service
under the Health Practitioner Regulation National Law, and section 133 bans
testimonials in advertising. No reviews, ratings, patient quotes, star widgets or
embedded Google reviews may appear anywhere on this site.

The database has no visibility into AHPRA. Its recommendation is correct for a
generic clinic in an unregulated market and wrong here.

**Replaced with:** a credibility band built from substantiable fact. Bulk billing
clarity, report turnaround, named sub specialties, combined sonographer
experience, equipment, and accreditation slots that stay empty until verified.

### 2. Palette: teal `#0891B2` + green `#16A34A`

The brand palette is fixed and the logo is not to be redesigned. The measured
values in `BRAND.md` win.

Worth noting: the database independently converged on a medical blue plus green
pairing, which is close in spirit to the real mark. That is reassurance about the
direction, not a reason to substitute the hexes.

### 3. Style: "Soft UI Evolution" / Neumorphism

Both surfaced for the health vertical. Neumorphism is flagged in the database
itself as **low contrast**, which collides directly with the WCAG 2.2 AA
requirement in §4.4. Soft, embossed, pastel surfaces also contradict the stated
direction of medical grade instrumentation and clinical clarity.

**Replaced with:** the dark canvas informed by the database's "Dark Mode (OLED)"
entry (deep near black base, 7:1 or better text contrast, minimal glow), with its
neon accent recommendation discarded. Brand blue is the only accent.

## Tension resolved, not rejected

The database lists **"motion heavy animations"** under AVOID for this vertical,
while the brief asks for an ambitious scroll driven 3D experience.

Both are right. The resolution is the database's own UX rule: **animate one to
two key elements per view, maximum.** This site has exactly one continuous
animation, the reconstruction, driven by a single scroll progress value. It is
not many decorative animations layered on a page. Everything else moves only to
show state or maintain spatial continuity.

If a section ends up with independent decorative motion competing with the
canvas, that rule has been broken and the motion comes out.

## Accepted

### Stack, from `--stack nextjs`

- App Router, `app/` directory. Severity Medium.
- **Server Components by default.** Do not add `use client` unnecessarily.
  Severity High. This matters here because the 3D canvas and motion are the only
  legitimate client boundaries; all copy stays server rendered, which also
  satisfies §4.4's requirement that content works without JS.
- Fetch data in async Server Components, never `useEffect` for initial data.

### 3D, from `--stack threejs`

- **Scroll driven camera uses a scrubbed timeline, not enter/leave callbacks.**
  `onEnter` / `onLeave` fire once and snap. Severity High.
- Use a scrubbed value with roughly one second of lag for cinematic smoothing,
  which also satisfies the brief's "damped and interruptible" requirement.
- **No OrbitControls.** This is a scripted reveal, not a model viewer. A user who
  orbits away mid sequence breaks the argument. Severity High.
- Use a timeline for any sequence beyond two steps rather than boolean flags and
  frame counters. Severity High.

Note: the database expresses all three in GSAP ScrollTrigger terms. The brief
specifies Motion (motion.dev). The *principles* are library independent and are
what is being adopted. Library choice is recorded in QUESTIONS.md as an open item,
since §3 permits following the skill where it is better and ScrollTrigger's
`scrub` and pinning have no exact Motion equivalent for a pinned camera path.

### UX rules pulled, all High severity

- `prefers-reduced-motion` honoured, not ignored
- 44x44px minimum touch targets, 8px minimum spacing between them
- Visible focus rings, never removed without replacement
- Contrast: darker text on light backgrounds, no grey on grey
- Animate one to two key elements per view maximum

## Typography

The healthcare pairing returned **Figtree / Noto Sans**. The technical pairings
returned Fira Code / Fira Sans and JetBrains Mono / IBM Plex Sans, matching the
"precise, instrumentation" half of the direction.

**Decision: Figtree for everything, IBM Plex Mono for data only.**

- **Figtree** is the database's healthcare heading recommendation. Geometric,
  highly legible, variable, warm enough for anxious patients without being
  chirpy. Carries headings and body at weight contrast rather than face contrast,
  which keeps the font payload small and protects LCP.
- **IBM Plex Mono** is the instrumentation layer, used only for measured values:
  report turnaround, scan durations, phone and fax, opening hours, address. It is
  what makes the site read as clinical equipment rather than a brochure, and
  confining it to real numbers keeps that meaning honest.

Both self hosted through `next/font/google`. No render blocking external
stylesheet, no layout shift.

## Density and spacing

`--density 3` (spacious, 24 to 96px scale) is correct for this audience and is
kept. §4.4 requires generous line height and a 17px minimum body size on mobile
for elderly and in-pain visitors. Dense dashboard spacing would be actively
hostile here.
