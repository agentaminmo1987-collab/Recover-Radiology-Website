import Link from "next/link";
import { billing } from "@/lib/clinic";
import { Section, SectionLabel, Card } from "@/components/ui";

/**
 * Billing. The single highest anxiety question on the site is "will this cost
 * me anything?", and it deserves to be answered in one glance.
 *
 * Compliance and UX agree here: the exception is stated in the same visual
 * block as the reassurance, at readable size, not in a footnote and not behind
 * an asterisk. Someone who only reads the two biggest lines still leaves with
 * an accurate understanding.
 */
export function Billing() {
  return (
    <Section id="billing">
      <SectionLabel>Cost</SectionLabel>

      <div className="mt-4 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <h2 className="text-balance text-[clamp(2.1rem,5vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.025em]">
            {billing.headline}
          </h2>
          {/* Same block, same breath, readable size. Never a footnote. */}
          <p className="mt-5 text-pretty text-[1.15rem] leading-[1.5] text-fg md:text-[1.3rem]">
            {billing.exceptions}
          </p>

          <p className="mt-8 max-w-[52ch] text-pretty leading-[1.6] text-fg-muted">
            {billing.whatBulkBilledMeans}
          </p>
          <p className="mt-4 max-w-[52ch] text-pretty leading-[1.6] text-fg-muted">
            {billing.eligibility}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="tabular text-[0.95rem] text-fg">{billing.payment}</p>
          </div>

          <p className="mt-3 text-[0.95rem] text-fg-subtle">
            {billing.feesNote}
          </p>

          <Link
            href="/billing"
            className="mt-8 inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent hover:underline"
          >
            Full billing detail
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        <Card>
          <h3 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
            By situation
          </h3>
          {/* Each situation highlights as it comes up the screen, staggered, in
              the same language as the trust band and the service cards.

              This list is the one place on the home page where a visitor is
              looking for THEIR row rather than reading top to bottom, so
              lighting them one at a time helps the eye step through them
              instead of meeting five equal-weight lines at once. */}
          <dl className="mt-6 space-y-6">
            {billing.cases.map((c, i) => (
              <div
                key={c.who}
                style={
                  { "--i": i, "--hl-to": "var(--fg)" } as React.CSSProperties
                }
              >
                <dt className="rr-hl__title font-semibold">{c.who}</dt>
                <span aria-hidden className="rr-hl__rule mt-2 block h-px w-full" />
                <dd className="mt-2 text-pretty text-[0.97rem] leading-[1.55] text-fg-muted">
                  {c.detail}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </Section>
  );
}
