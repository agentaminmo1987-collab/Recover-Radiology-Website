# SEO

Audited and rebuilt 2026-08-17. Every number here was read off the built site,
not estimated.

## The query that matters

Australian diagnostic imaging search is dominated by one qualifier: **bulk
billing**. The pattern is `bulk billed <modality> <suburb | near me>`. Every
competing practice in the results ranks on it.

The service pages did not contain that phrase in a title. They read
"CT in Morphett Vale", and nobody searches "CT" either.

### Titles, before and after

| Page | Before | After |
|---|---|---|
| X-ray | X-ray in Morphett Vale | **Bulk billed X-ray in Morphett Vale** |
| CT | CT in Morphett Vale | **CT scan in Morphett Vale** |
| Ultrasound | Ultrasound in Morphett Vale | Ultrasound in Morphett Vale |
| Interventional | Interventional procedures in Morphett Vale | **Cortisone injections in Morphett Vale** |

Two deliberate restraints:

**"Bulk billed" is only in the title where it is unconditionally true.** That is
X-ray alone. Ultrasound has an obstetric exception and interventional has its
own, and a 60-character title has no room to carry the exception beside the
claim. An unqualified billing claim in those titles would be misleading
advertising by a regulated health service, which is exactly what the existing
compliance test exists to prevent. Those two state it, qualified, in the
description instead.

**"Cortisone injections" replaced "interventional procedures".** Nobody searches
the category. They search the procedure they were referred for, and cortisone is
by far the most common.

## Meta descriptions

Three were being truncated by Google and losing their most useful clause.

| Page | Before | After |
|---|---|---|
| Home | 246 | 140 |
| Billing | 205 | 154 |
| Contact | 187 | 151 |
| Interventional | 230 | 112 |

The service description is now self-limiting: it drops the duration clause
rather than overflowing, because interventional's duration is a sentence and a
half and composing blindly pushed the phone number off the end. A test asserts
every description stays between 60 and 165 characters.

## Suburbs

Requested: capture the surrounding suburbs.

They are in `areaServed` as 14 named `City` entries, and in a visible sentence
on the contact page. They are **not** in titles. A title stuffed with suburb
names is the doorway pattern Google demotes, and it would push the service name
out of the characters a title actually gets to show.

The list was derived from the map, not supplied by the practice. Prune anything
outside the real catchment.

## Structured data

Was already strong. What was missing and is now present:

- **BreadcrumbList** on every page below the root, rendered as real visible
  links rather than crawler-only markup. Google shows the trail instead of a raw
  URL, and an assistant retrieving a leaf page gets no hierarchy without it.
- **sameAs and hasMap** pointing at the Google Business Profile by CID. This is
  the strongest single local signal and it was absent.
- **FAQPage on all four service pages**, 6 to 8 questions each, composed
  entirely from `clinic.ts`. Feeds People Also Ask and gives an assistant
  discrete question and answer pairs to retrieve.
- **Person entries** on the team page for the sonographers and radiographers.
- `priceRange`, `paymentAccepted`, `medicalSpecialty`, `image`, `logo`.

**Never present, by design: `aggregateRating` and `review`.** AHPRA section 133
prohibits using ratings or testimonials to advertise a regulated health service.
The Google listing carries a 4.9; it must not be reproduced here. A test asserts
no page publishes a rating.

## AI search

`llms.txt` was already published, which is ahead of most practices.

`robots.txt` now names the AI crawlers explicitly and allows them: GPTBot,
OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot,
Perplexity-User, Google-Extended, Applebot-Extended, meta-externalagent,
Bytespider, CCBot.

This changes no behaviour, since `User-agent: *` already permitted them. It is
there so the decision is deliberate and legible: a clinic whose patients ask an
assistant "where can I get a bulk billed ultrasound near me" wants to be in the
answer. Opting out later is one line per agent.

The FAQ blocks matter more for AI retrieval than for Google. An assistant
answering a question wants a passage that already answers it, and these are
written as answers rather than as marketing.

## Content structure

- `/about` no longer duplicates the team roster. Two pages competing on the same
  content split whatever authority either would have had, and a visitor read the
  same cards twice. The roster lives on `/our-team`; `/about` now carries
  equipment, method and referrer information.
- The enquiry confirmation was a dead end. It now offers preparation, cost and
  the clinic tour, ordered by what actually happens next.

## Still open

- **The domain.** Everything canonical points at `recoverradiology.com.au`,
  which still serves the old site. None of this ranks until the domain moves.
  This is the single highest-value action outstanding and it is not a code
  change.
- **Google Search Console** is not connected, so none of this is measurable yet.
- **`/insights` is disallowed and empty.** A handful of genuinely useful posts,
  the sort a GP would send a patient, is the cheapest remaining ranking gain.
- Accreditation marks (DIAS, RANZCR) unverified and suppressed.
