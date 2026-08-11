# Questions for Amin

Parked decisions. Each has a default already applied so the build never stalls.
Nothing here is blocking.

---

## 1. Accreditation marks are unverified

**Status:** slots built, rendering suppressed.

Practices billing Medicare for diagnostic imaging must be accredited under the
Diagnostic Imaging Accreditation Scheme. Recover Radiology bulk bills, so this is
almost certainly true, but "almost certainly" is not a basis for a compliance
claim on a regulated health service.

Same for RANZCR membership of the reporting radiologists.

**Default applied:** the credibility band renders without them and does not
reserve visible empty space. `TODO(amin)` markers sit in the component.

**Need from you:** confirmation plus the accrediting body and, if you have it,
the accreditation number and expiry.

---

## 2. Radiologist names and qualifications

Only Khoa Le (Chief Sonographer, vascular) is named on the existing site. The
reporting radiologists are described only as "experienced".

Named, qualified radiologists are one of the strongest legitimate credibility
devices available given the testimonial ban. Their absence is a real cost.

**Default applied:** team section degrades to first names only, with clearly
marked slots for headshots and AHPRA registration numbers.

**Need from you:** whether the radiologists can be named, and whether staff
headshots can be commissioned.

---

## 3. GSAP alongside Motion for the pinned camera path

The `ui-ux-pro-max` Three.js guidance is emphatic (three High severity rules)
that a scroll driven camera must use a scrubbed timeline with pinning, and that
enter/leave callbacks snap and are the wrong tool. It expresses this in GSAP
ScrollTrigger terms.

The brief specifies Motion (motion.dev). Motion's `useScroll` handles progress
tracking well, but it has no direct equivalent of ScrollTrigger's pinning plus
scrub for a long scripted camera traverse.

§3 permits following the skill where it recommends something better.

**Default applied:** Motion for all 2D, UI and section motion as specified.
Evaluating whether the camera path needs GSAP ScrollTrigger specifically. If it
does, GSAP is scoped to the canvas only and lazy loaded with the 3D bundle, so it
never touches the initial JS budget in §4.5.

**Need from you:** nothing yet. Flagging because it is a deviation from §3 if it
happens.

---

## 4. The four photographs are AI generated, and that is an AHPRA risk

`public/img/_raw/photography/` holds four generated interior shots: reception,
scan room, clinician hands, waiting area. They are **not photographs of Recover
Radiology.**

This matters more than it would on an ordinary site. Presenting a generated
reception as this practice's reception is misleading advertising, and misleading
advertising by a regulated health service is an AHPRA problem, not a taste
problem. It sits under the same part of the National Law as the testimonial ban.

**Default applied:** they are treated strictly as layout placeholders. They give
the build correctly sized, correctly toned images to compose against. They are
**not** used anywhere that implies "this is our clinic", and `scan-room-3x2` in
particular is kept away from CT copy, since a generated machine that does not
resemble the real one implies capability the practice may not offer.

**Need from you:** a real photographer before launch. Half a day covering the
actual reception, scan rooms and team. Given that testimonials are unavailable,
real photography is the highest value trust spend on this project, and it
replaces four placeholders at once.

If any generated image does ship, it stays clearly non specific and the filename
keeps the marker so nobody later mistakes it for documentary.

The abstract plates (hero, sections, textures) have none of this problem. They
are brand art rather than a depiction of the premises, and ship as is.

---

## 5. The generated plates run cooler than the brand blue

The hero and section plates were generated against the logo, but they land on a
cyan or teal cast rather than the measured brand blue `#8AC2E0`. Left alone the
site would carry two competing blues.

**Default applied:** plates are graded toward the brand token at the point of
use rather than re-generated, so there is one blue on the page.

**Need from you:** nothing. Noted so the drift is not mistaken for a palette
change later.

---

## 6. The manual theme override is not finished

Both automatic paths are verified clean: with `prefers-color-scheme: dark` and
with `prefers-color-scheme: light`, an in-browser audit of all 167 rendered text
nodes returns **zero** contrast failures against WCAG AA.

The manual `data-theme` attribute override is a different story. Forcing
`data-theme="dark"` while the system is light flips the surface correctly but
leaves `--accent` on its light value, so the theme half applies. Explicit blocks
for both directions and raised selector specificity did not resolve it.

**Default applied:** no theme toggle is exposed in the UI, so this is not a path
any visitor can reach. §4.4 asks the site to respect `prefers-color-scheme`, and
it does, fully.

**Need from you:** a decision on whether a manual toggle is wanted at all. If it
is, the override needs finishing first. If not, the override CSS should be
deleted rather than left as a trap for the next person.

---

## 7. Higgsfield is not available

§5 and §7 step 15 call for Higgsfield to generate HDRIs, matcaps, gradient ramps,
background plates and the OG image. No Higgsfield tool is available in this
environment. `threejs-image-generator` needs a Gemini API key that is not set.

**Default applied:** environment lighting, gradient ramps and background plates
are generated procedurally in shader. §5 already states a preference for
procedural where possible, and it is sharper, cheaper and has no texture fetch
cost. The OG image is composed in Phase E from the real logo and rendered type
rather than generated.

**Need from you:** a Gemini API key if you want generated imagery instead. The
procedural path is genuinely the better default here, so this is optional.

---

## 8. Supabase is not authenticated

`supabase login` has not been run, so no project exists yet for the enquiry form.

**Default applied:** the enquiry form is built against a driver interface with a
local development implementation. Swapping to Supabase is one adapter, no
component changes. Server side zod validation, honeypot and rate limiting are
built regardless since they are not Supabase specific.

**Need from you:** run `supabase login`, then tell me the project ref, or let me
create one once authenticated.

---

## 9. Obstetric scans and the bulk billing message

The single highest anxiety question on the site is "will this cost me anything?"
The honest answer is "usually no, except obstetric and some interventional".

Stating the exception plainly is both a compliance requirement and better UX than
burying it, but it does mean the reassurance is qualified rather than absolute.

**Default applied:** the billing section leads with the bulk billed majority in
the largest type on the page, with the two exceptions stated immediately below in
the same visual block, not in a footnote. No asterisks.

**Need from you:** confirmation that this framing is acceptable to the practice.

---

## 10. Logo is shipping as PNG, not SVG

The brand kit ships vector EPS, which is the right master. Converting EPS to SVG
needs ImageMagick, Inkscape or Ghostscript, and none is installed. The `convert`
binary on PATH is the Windows filesystem utility, not ImageMagick, so it must not
be run.

**Default applied:** the 1597x969 PNG lockups are in `public/brand/`. At a header
size of roughly 180px wide that is over 8x density, so it looks correct on every
screen. The cost is bytes, not quality.

**Need from you:** either install one of those tools, or export SVG from
Illustrator directly. Recommend the latter, since it preserves the original paths
rather than tracing them. This should be resolved before launch; it is not urgent
for the build.

---

## 11. Content gaps against the brief's page list

§6 asks for a Blog index and post template. There is no existing blog content and
none was supplied.

**Default applied:** the route, index and post template are built and styled, with
one clearly marked placeholder post. Nothing fabricated, no invented clinical
content.

**Need from you:** whether the blog ships at launch or stays unlinked until there
is something to put in it. Recommend unlinked, since an empty blog reads worse
than no blog.
