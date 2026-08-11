# Security

`secure-data-access` pre-delivery checklist, run against the production build on
2026-08-12. Every line was verified by reading code or by inspecting build
output. Nothing here is asserted from memory.

## The shape of this site

Worth stating first, because it determines which controls apply: **this site has
no authentication, no accounts, no sessions and no read path to stored data.**

There is exactly one write: the enquiry form. Nothing on the site can read an
enquiry back. The practice reads submissions out of band.

That means most of the checklist, which exists to catch one signed-in user
reaching another's records, is not applicable rather than passed. Marking those
"pass" would overstate the assurance, so they are marked N/A with the reason.

## Checklist

| # | Check | Result |
|---|---|---|
| 1 | Every page under an authenticated group calls a guard | **N/A** — no authenticated group exists |
| 2 | Every route handler calls a guard | **N/A** — the three routes (`sitemap`, `robots`, `llms.txt`) emit only public facts |
| 3 | Every exported server action guards inside the body | **Pass** — one action, `submitEnquiry`; gates run before anything touches storage |
| 4 | No mutation uses a client ID without owner scoping | **Pass** — insert-only. No client-supplied ID is used anywhere |
| 5 | Every service-role call is session-derived or pre-verified | **Pass** — the Supabase driver inserts only, with a server-validated payload and no client input in the request path |
| 6 | Role and grant gates for anything the nav hides | **N/A** — nothing is hidden; every route is public |
| 7 | Deactivating a user takes effect next request | **N/A** — no users |
| 8 | No `NEXT_PUBLIC_` secret, `.env*` gitignored | **Pass** — verified both, see below |
| 9 | Cron and webhook endpoints require a shared secret | **N/A** — none exist |
| 10 | Rate limiting on every public form | **Pass** — per-IP, 5 per 10 minutes |
| 11 | RLS smoke test passes | **N/A** — no Supabase project yet. **Blocked**, see below |

## Evidence

**Order of gates in `submitEnquiry`.** Rate limit, then parse, then spam checks,
then store. Nothing reaches the driver until every gate has passed:

```
36  rateLimited(ip)          -> reject
43  enquirySchema.safeParse  -> reject on failure
66  honeypot || too fast     -> return success, store nothing
71  enquiryDriver().save()
```

The honeypot and the minimum-time check deliberately return a *success* state
without storing. Telling a bot it was detected only helps it adapt.

**No read path.** The Supabase driver issues one `POST` and nothing else. There
is no `GET`, no `select`, and no route that returns an enquiry. Even a total
compromise of the front end cannot read submissions back.

**The service key never reaches a browser.** All 16 client chunks in the
production build were scanned for `SUPABASE_SERVICE_ROLE` and `service_role`.
Zero occurrences. `lib/enquiry.ts` carries `import "server-only"`, so a client
import is a build error rather than a runtime leak.

**No secrets in public env.** A regex sweep for
`NEXT_PUBLIC_*(SECRET|SERVICE|KEY|PASSWORD|TOKEN)` across the repo returns
nothing. `.gitignore` line 34 is `.env*`, and `git check-ignore` confirms
`.env.local` is ignored.

**No personal data in logs.** The failure path logs `err.message` only, with a
comment saying why. The submission itself is never logged, and the Supabase
request uses `Prefer: return=minimal` so no echoed row can end up in an error.

## Health-adjacent data, handled accordingly

The form asks for a name, a phone number, and optionally an email and message.
That is contact data for a diagnostic imaging practice, which makes it sensitive
by association even though it is not clinical.

Three deliberate decisions:

1. **The form tells people not to send clinical information**, at the point of
   entry rather than in a policy nobody opens.
2. **The field set is minimal.** No date of birth, no Medicare number, no
   referral details. Nothing is collected that the practice can gather by phone.
3. **The local driver writes outside the repository**, to `%LOCALAPPDATA%`, so a
   development submission can never be committed.

## Open items

**RLS is not yet provable.** Supabase is not authenticated, so the local driver
is active and no project exists to test against. Before launch, the `enquiries`
table must:

- have RLS enabled and forced,
- carry an insert policy for the service role only, with no anon policy,
- have **no select policy at all**, so the data is write-only from the
  application's perspective,
- be verified by a smoke test that an anon key can neither insert nor read.

Until that exists, item 11 is blocked rather than passed.

**Rate limiting is in-process.** A fixed window in memory, which resets on cold
start and does not span instances. Adequate for a single-region clinic site and
an accepted limit at this scale, not an oversight. If the form is ever abused,
the fix is a shared store rather than tuning the window.

**No CSP.** The site sets no Content-Security-Policy. With no third-party
scripts, no inline event handlers and no user-generated HTML, the exposure is
low, but a CSP is cheap defence in depth and should land before launch.

## Re-run

```bash
node -e "/* scan client chunks for the service key */"   # see Evidence above
grep -rnE "NEXT_PUBLIC_[A-Z_]*(SECRET|SERVICE|KEY|PASSWORD|TOKEN)" .
git check-ignore -v .env.local
```

Re-run the full checklist whenever a route handler, a server action or a storage
driver is added.
