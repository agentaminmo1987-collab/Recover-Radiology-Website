# Recover Radiology, brand foundation

Phase A output. Every value here was measured, not estimated.

## Source of truth

The client brand kit at
`OneDrive/ドキュメント/Taco Cat Radiology/Brand Kit/Final logos/Final logos/`
supersedes the CDN PNGs listed in the build brief. It ships vector EPS plus PNG,
in horizontal and vertical lockups, in black, white and CMYK.

```
eps/  RecoverRadiology_Logo_{H,V}_{BLACK,CMYK,WHITE}.eps   (~750-795 KB each)
png/  RecoverRadiology_Logo_{H,V}_{BLACK,CMYK,WHITE}.png   (~57-64 KB each)
jpg/  RecoverRadiology_Logo_{H,V}_{BLACK,CMYK}.jpg
```

Use EPS as the master for any new derivative. Convert to SVG for web rather than
shipping the PNGs, so the mark stays crisp at every density.

The logo is not to be redesigned. The tagline "Forming your road to recovery"
stays as written.

## The mark

Two interlocking rounded forms, one sky blue and one olive green, reading as a
pair of nodes locking together, set beside a lowercase wordmark in the green.

This matters for the 3D concept in the brief. The mark is already two distinct
forms resolving into a single shape, which is the same argument the scroll makes:
signal becoming clarity. The reconstruction sequence should land on a composition
that rhymes with the mark rather than quoting it literally.

## Core palette, extracted from logo pixels

Decoded from `RecoverRadiology_Logo_H_CMYK.png` (1597x969, RGBA). Every other
colour in the file is antialiasing at under 0.05 percent.

| Token | Hex | RGB | Share of mark |
|---|---|---|---|
| `brand-blue` | `#8AC2E0` | 138, 194, 224 | 52.1% |
| `brand-green` | `#465E19` | 70, 94, 25 | 47.9% |

A near even two colour system. There is no third brand colour, so the extended
palette below is derived, not invented.

## The governing constraint

The two brand colours have inverted accessibility. Measured as WCAG 2.1 relative
luminance contrast:

| Colour | on `#FFFFFF` | on `#0E1411` |
|---|---|---|
| `#8AC2E0` blue | 1.93 FAIL | 9.65 PASS |
| `#465E19` green | 7.30 PASS | 2.55 FAIL |

Neither colour is usable in both modes. This is the single most important fact
about this palette and it decides the whole system:

- **Light mode is green led.** Green carries headings, links and primary buttons.
  Blue appears only as a large-area fill, never as text or a small UI boundary.
- **Dark mode is blue led.** Blue carries headings, links and emphasis. Green
  must be lightened before it can appear on dark at all.

Each colour leads exactly where it passes AA. Nothing is being compromised.

## Derived ramps, all verified

### Blue, darkened for text on light surfaces

| Hex | on white | Verdict |
|---|---|---|
| `#6892A8` | 3.35 | large text and UI boundaries only |
| `#5A7E92` | 4.34 | still short of 4.5, do not use for body |
| `#4C6B7B` | 5.68 | PASS, minimum for body text |
| `#456170` | 6.57 | PASS, comfortable |
| `#3E5765` | 7.62 | PASS, high emphasis |

Body copy and links on light must be `#4C6B7B` or darker. `#8AC2E0` is never text
on a light surface.

### Green, lightened for use on dark surfaces

| Hex | on `#0E1411` | Verdict |
|---|---|---|
| `#7E8E5E` | 5.25 | PASS |
| `#99A681` | 7.21 | PASS |
| `#B5BFA3` | 9.71 | PASS, high emphasis |

`#465E19` at source is unusable on dark at 2.55 and must never appear as text
there.

### Neutrals

| Token | Hex | Note |
|---|---|---|
| `ink` | `#0B0F0A` | light mode body text, green biased black |
| `canvas-dark` | `#0E1411` | dark mode base, green biased near black |
| `white` | `#FFFFFF` | 18.64 on `canvas-dark`, PASS |

The neutrals carry a slight green bias so the dark surface reads as related to
the mark rather than as generic charcoal.

## Usage rules

1. No hard coded colour anywhere in the codebase. Everything consumes semantic
   tokens which resolve per mode.
2. Blue is signal, not decoration. It marks the interactive and the important.
   It is not a background wash.
3. Never place `#8AC2E0` text on white, and never place `#465E19` text on the
   dark canvas. Both fail AA and both are easy mistakes to make.
4. Contrast is verified per token pair before a component ships, not assumed.
5. The mark has clear space equal to the height of the wordmark's lowercase r on
   all sides. Use the WHITE lockup on the dark canvas and the CMYK lockup on light.

## Still open

- Typography is not yet chosen. Pending the `ui-ux-pro-max` font pairing query in
  Phase A step 1, which needs the skills loaded.
- No `og:image` exists for this business anywhere. Being produced in Phase E.
- Accreditation marks (DIAS, RANZCR) are unverified and must not be rendered until
  confirmed. See QUESTIONS.md.
