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

## 4. Photography, resolved

The practice supplied its own shoot on 2026-08-12 and the AI-generated
placeholders are gone. Real photographs of the actual rooms can be presented as
the actual rooms, which closes the AHPRA exposure this item was raised for.

Two frames are deliberately unused: both show staff who have since left. The
X-ray frame is cropped at the wall return so the departed technologist is out of
shot. The former Chief Sonographer has been removed from every page.

**Standing note, not a question:** any page naming an individual is wrong the
moment they leave. Counts and totals survive turnover; names do not. If you want
named radiologists back on the site for credibility, that is worth doing, but it
needs a process for keeping it current.

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

---

## 12. Interventional procedure pages need a radiologist to read them

Six new pages describe each procedure: what it is, what it is used for, how it is
performed, benefits, risks and aftercare. `/interventional/cortisone-injection`
and the five beside it.

**This is the only clinical content on the site that did not come from you.**
Everything else traces back to `src/lib/clinic.ts`. These pages were written from
the standard, generic description of each procedure, under three self-imposed
rules: no numbers of any kind (no complication rates, no percentages), nothing
specific to how this practice performs them, and risks named without being ranked
or dismissed.

**Default applied:** every procedure carries `signedOff: false` in
`src/lib/procedures.ts`. While that is false the page renders and is linked from
`/interventional`, so it can be reviewed in place, but it carries `noindex` and
stays out of the sitemap. Unreviewed clinical content should not be accumulating
search impressions.

**Need from you:** a radiologist reads each page and confirms it is accurate for
how you actually do it. Then flip `signedOff` to `true` for that procedure, one
word each. A Playwright test asserts unsigned pages stay out of search, so this
cannot be forgotten silently.

**Resolved 2026-08-12:** the Euflexxa question. The brand name is gone; the
procedure is now "Osteoarthritis Injection", used in knee, hip, shoulder and
smaller synovial joints where indicated, as a series of three injections two to
four weeks apart. Hydrodilatation and fine needle aspiration / core biopsy were
added at the same time. Those pages still need reading, like the rest.

**Resolved 2026-08-12:** the medial branch block question. The practice does not
perform radiofrequency ablation, so every reference to an onward "longer lasting
treatment" was removed from that page. It now reads as a diagnostic test whose
result goes back to the referring doctor, which is what it is. A test asserts no
procedure page names a service we do not offer.

---

## 13. Referral upload changes what this website holds

The enquiry form now accepts referral uploads, so the site receives health
information. It previously told people not to send anything clinical.

**Default applied:** PDF/JPG/PNG/WebP/HEIC only, verified against the file's
actual bytes rather than its extension or `Content-Type`; 10MB per file, 3 files;
random UUID storage key; the display filename rebuilt from an allowlist rather
than sanitised; never overwrites an existing object. The privacy notice was
rewritten to match. Locally, files land outside the repo; on Supabase they go to
a `referrals` bucket which **must be created private**.

**Need from you:**

1. **How long do you keep an uploaded referral once it is in the patient
   record?** The privacy notice currently says the website copy "is no longer
   needed" and that enquiries are "not kept indefinitely", deliberately without a
   number. A specific retention period would be a commitment invented on your
   behalf. Give me the number of days and I will state it.
2. **Your clinical privacy policy**, to link from `/legal/privacy`. Still
   outstanding from item 5.
3. **Supabase.** Still not authenticated, so the local file driver is active and
   uploads are not going anywhere durable in production. This is the last thing
   blocking the form from being genuinely usable.

---

## 14. Team page: no photographs, no qualifications

`/our-team` is built from the roster in `clinic.ts`: three sonographers by first
name, the practice manager, the clerical lead and two clerical staff, plus "25
years of combined experience".

You asked to highlight the sonographers as highly talented. That exact framing
cannot ship: AHPRA section 133 bans superlatives about a regulated health
service. The page instead carries what is checkable, which is a stronger claim
anyway: how many sonographers, the combined experience figure, what they scan,
and the report turnaround.

**Default applied:** first names and roles only. No photographs of staff, because
the only staffed frames we hold show people who have since left. No
qualifications, ASAR registration or radiologist names, because none were
supplied.

**Need from you, all optional and all would improve the page:**

- Qualifications for each sonographer, and ASAR accreditation if they hold it.
- Subspecialty interests, so "musculoskeletal" can be attributed to a person.
- A fresh staff photograph, taken now, of people currently employed.
- Whether the radiologists may be named.

Note the standing risk: every name on this page is wrong the moment that person
leaves. The counts and the combined-experience figure survive turnover; the names
do not.


---

## 15. Which imaging guides the other six procedures

You confirmed on 2026-08-12 that the osteoarthritis injection and hydrodilatation
are both performed under CT. Those two pages now say so, in a highlighted note,
and describe the steps as a CT procedure rather than a generic one.

**The other six do not say.** Their pages describe the needle as "guided by
imaging", which is true but vague, and the two that named a modality generically
were softened: the facet joint page previously said "CT or fluoroscopy", which
asserted equipment nobody had told me you have.

**Need from you:** the guidance modality for each of cortisone injection, facet
joint injection, nerve root block, epidural injection, medial branch block, and
fine needle aspiration / core biopsy. One word each is enough. It is a
`guidance:` line per procedure in `src/lib/procedures.ts` and it renders as a
highlighted note on the page.

Worth being exact about: saying "ultrasound guided" about something you do under
CT is wrong in a way a patient has no way to catch, and it is the kind of detail
a referring GP will notice immediately.

**A note on wording.** You described CT as giving "the best accuracy" and "more
accurate placement". Those pages do not use that phrasing, because a comparative
claim about a regulated health service runs at AHPRA section 133. They say what
CT actually does instead: it shows the needle tip against the bone and the joint
space directly, so the medication goes inside the joint rather than around it.
That is the same point, and it is checkable rather than an assertion.


---

## 16. Staff portraits, and who is in the photographs

**We looked. The old site has no staff portraits.** Its team section is a list
of text buttons: "Emily - Practice Manager", "Matt - Sonographer" and so on,
with no images attached. Every photograph on it is either a room or the
building.

Its images are also 650x433 web copies of the same shoot you already gave us.
Our masters are 7400x4936, so pulling anything across from there would have been
a downgrade. The team page uses ours.

**Two photographs on the site show people. Please confirm both:**

1. **The reception photograph** (three staff at the front desk, now the lead
   image on /our-team and used again on /about). Are all three still with the
   practice?
2. **The reporting workstation photograph** (a man in green scrubs reading CT,
   now in the Radiologists section of /our-team). Earlier in this build we were
   told this frame showed someone who had left, which is why /our-clinic uses
   only architectural shots. If that is still true, say so and it comes out
   today.

**What would improve this page most:** a headshot of each of the nine current
staff. `team` in clinic.ts is shaped so a `photo` field drops straight in
without touching the layout. Plain background, consistent framing, any phone
from the last few years is fine.

Nothing generated. Not for faces, on a regulated health service.

---

## 17. The suburb list

/contact and the areaServed schema now name 13 neighbouring suburbs: Reynella,
Old Reynella, Woodcroft, Hackham, Christie Downs, Christies Beach, Noarlunga,
Port Noarlunga, Seaford, Happy Valley, Aberfoyle Park, Flagstaff Hill and
Huntfield Heights.

**Derived from the map, not supplied by you.** They are geography rather than a
claim, but prune anything you would not call your catchment.

---

## 18. The domain is the blocker

Every canonical URL, the sitemap and the robots host all point at
recoverradiology.com.au, which still serves the old site. **None of the SEO work
ranks until the domain points here.** It is the highest-value outstanding action
on the project and it is not a code change.


---

## 19. Credentials now published, and what backs them

Added to /our-team on 2026-08-17, set quietly as small lines under each name
rather than as badges. Each is a position held or an award received, which is
verifiable fact rather than a superlative, so it sits inside AHPRA section 133
where "expert" or "leading" would not.

**Matt Le, Chief Sonographer**
- ASA Sonographer of the Year, 2025
- Head Sonographer, Royal Adelaide Hospital

**Marlon Ledesma, Chief Radiographer**

**Two things to close off.**

1. **The award wording.** The ASA article supplied features Matthew Le among its
   2025 award recipients but does not name which award, and "Sonographer of the
   Year 2025" is not independently verifiable online. It is published on the
   practice's statement. Keep the ASA confirmation on file in case a competitor
   or a regulator ever queries it, and correct the wording now if it was a
   different ASA award.

2. **The hospital affiliation.** Naming someone's other employer on a commercial
   site needs that person's agreement, and some hospitals have policies about
   staff using the affiliation commercially. Published on the practice's
   instruction; worth a quick confirmation from Matt.

---

## 20. Roster complete. Two surnames outstanding

**Resolved 2026-08-17.** All five sonographers named and titled:

- Matt Le, Chief Sonographer
- David, Senior Sonographer
- Laura, Senior Sonographer
- Danny Tran, Senior Sonographer
- Marko Krinic, Senior Sonographer

Radiography: Marlon Ledesma, Chief Radiographer, and Yasna, Senior Radiographer.

"Senior" was confirmed for David and Laura rather than inferred. It was
initially stated only alongside Danny and Marko, and promoting the other two on
a loose reading would have been inventing a colleague's title in public.

**Resolved, in the other direction.** The practice set the rule on 2026-08-17:
the two leads carry surnames, everyone else is a first name. Danny and Marko
were briefly published with surnames and had them removed.

That is the better answer. Surnames on Matt Le and Marlon Ledesma mark the two
roles a patient or referrer might want to look up; first names everywhere else
keeps the page warm rather than corporate, and gives the team less exposure than
a full roster of searchable names.

---

## 21. Ownership, and the positioning claim

The competitor claims to be "locally owned and operated" and an "independent
imaging provider", while their own structured data names Vision Radiology, a
Victorian company, as the parent organisation.

**If Recover is genuinely independent and South Australian owned, that is a
claim worth making plainly and often.** It is not currently in the verified fact
set and so is not on the site. Confirm the exact ownership position and the
wording you want.


---

## 22. THE PRESENTATION CONTRADICTS THE WEBSITE ON BILLING. Please resolve.

The Jan 26 presentation states billing that differs from what the site says,
and the site's version came from the OLD website when this was built. **Billing
is the highest-stakes content here, so nothing was changed off a seven month old
deck without you confirming it.**

| | Website says now | Presentation says |
|---|---|---|
| Ultrasound | Bulk billed, obstetric excepted | Bulk billed, obstetric **$100 gap** |
| CT | Usually bulk billed | **Fully** bulk billed |
| X-ray | Bulk billed | **Fully** bulk billed |
| Interventional | **Some are not bulk billed** | **Fully bulk billed** |

The interventional row is the one that matters. The site currently warns
patients that some procedures are not bulk billed. If that is wrong, we are
deterring referrals for no reason. If the presentation is out of date, the site
is right and should stay.

**The obstetric gap is a specific number, $100.** Publishing an actual figure is
far more useful than "not bulk billed" and reduces calls, but only if it is
current.

**Also differs: report turnaround.** The site says 24 to 48 hours. The
presentation says urgent within 4 hours and routine same day or within 24 hours.
The referrer page currently carries the slower, safer figure. If the faster one
is accurate it is a significant competitive advantage being left unstated.

---

## 23. Service detail from the presentation, not yet on the site

The presentation is more specific than the website about what is and is not
offered. Confirm and we will add:

- **CT excludes** cardiac, calcium scoring and National Lung Screening.
- **X-ray excludes** dental, DEXA and mammography.
- **Ultrasound guided:** cortisone injections, joint aspirations, breast and
  thyroid FNA.
- **CT guided:** spinal injections (nerve root, epidural, facet), shoulder
  hydrodilatation, hyaluronic acid joint injections.

Stating exclusions plainly saves wasted referrals, which referrers appreciate
more than a longer list.

---

## 24. The osteoarthritis injection article needs a radiologist to read it

/insights/osteoarthritis-injections-evidence is written and live but **noindex
and excluded from the sitemap** until signed off, the same gate the procedure
pages use.

Figures come from your presentation. The Altman 2015 study was verified against
PLoS One directly: real, 182,022 patients, and it has a published correction
which is cited alongside it.

**One deliberate editorial decision you should look at.** The article includes a
section on what the evidence does NOT establish: both studies are retrospective
claims analyses showing association rather than causation, delay to arthroplasty
is not automatically a benefit, and guideline positions differ. That section is
there because a referrer page that presents observational data as though it were
randomised evidence damages your credibility with the exact audience you are
trying to win. It reads as more trustworthy, not less.

**Brand naming:** you asked to remove "Euflexxa" from patient-facing pages, and
it is gone from those. This referrer article names hyaluronic acid generically
too. Tell us if you want the brand named in the referrer context, where the
audience is clinical.
