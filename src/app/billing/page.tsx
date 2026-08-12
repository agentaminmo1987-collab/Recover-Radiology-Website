import type { Metadata } from "next";
import Link from "next/link";
import { clinic, billing, modalities } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel, Card, ButtonLink , CallButton} from "@/components/ui";

export const metadata: Metadata = {
  title: "Billing and bulk billing",
  description:
    "Most services at Recover Radiology are bulk billed. Obstetric scans and some interventional procedures are the exceptions. What bulk billing means, and what applies to concession, DVA and private patients.",
  alternates: { canonical: "/billing" },
};

/** FAQPage schema, §8. Every answer is drawn from the verified fact set. */
const faqs = [
  {
    q: "Will my scan cost me anything?",
    a: `${billing.headline} ${billing.exceptions} ${billing.whatBulkBilledMeans}`,
  },
  { q: "What does bulk billed mean?", a: billing.whatBulkBilledMeans },
  {
    q: "What decides whether I am bulk billed?",
    a: billing.eligibility,
  },
  {
    q: "Does my private health insurance cover this?",
    a: billing.cases.find((c) => c.who === "Private health insurance")!.detail,
  },
  { q: "How can I pay?", a: `${billing.payment} ${billing.feesNote}` },
];

export default function BillingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[--rr-space-xl]">
          <SectionLabel>Cost</SectionLabel>
          {/* The answer, at the top, at the largest size on the page. Someone
              who reads only the next two lines still leaves correctly informed. */}
          <h1 className="mt-4 max-w-[18ch] text-balance text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            {billing.headline}
          </h1>
          <p className="mt-6 max-w-[46ch] text-pretty text-[1.25rem] leading-[1.45] text-fg md:text-[1.45rem]">
            {billing.exceptions}
          </p>

          <div className="mt-12 max-w-[62ch] space-y-5">
            <p className="text-pretty text-[1.08rem] leading-[1.6] text-fg-muted">
              {billing.whatBulkBilledMeans}
            </p>
            <p className="text-pretty text-[1.08rem] leading-[1.6] text-fg-muted">
              {billing.eligibility}
            </p>
          </div>
        </Section>

        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            What applies to you
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {billing.cases.map((c) => (
              <Card key={c.who}>
                <h3 className="text-[1.15rem] font-semibold">{c.who}</h3>
                <p className="mt-3 text-pretty leading-[1.6] text-fg-muted">
                  {c.detail}
                </p>
              </Card>
            ))}
          </div>
        </Section>

        <Section>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                By service
              </h2>
              <dl className="mt-8 divide-y divide-[var(--card-border)] border-y border-[var(--card-border)]">
                {modalities.map((m) => (
                  <div
                    key={m.slug}
                    className="flex items-baseline justify-between gap-6 py-5"
                  >
                    <dt>
                      <Link
                        href={`/${m.slug}`}
                        className="text-[1.05rem] font-medium text-fg hover:text-accent"
                      >
                        {m.name}
                      </Link>
                    </dt>
                    <dd className="text-right text-[0.97rem] text-fg-muted">
                      {m.bulkBilled === "yes" && "Bulk billed"}
                      {m.bulkBilled === "mostly" && "Usually bulk billed"}
                      {m.bulkBilled === "exceptions" && m.bulkBilledNote}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 space-y-3">
                <p className="tabular text-[1.02rem] text-fg">{billing.payment}</p>
                <p className="text-[0.97rem] text-fg-subtle">{billing.feesNote}</p>
              </div>
            </div>

            <div>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                Common questions
              </h2>
              <div className="mt-8 divide-y divide-[var(--card-border)] border-y border-[var(--card-border)]">
                {faqs.map((f) => (
                  <details key={f.q} className="group py-5">
                    <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-[1.05rem] font-medium text-fg [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span
                        aria-hidden
                        className="shrink-0 text-accent transition-transform duration-[var(--rr-dur-base)] group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-[58ch] text-pretty leading-[1.6] text-fg-muted">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section tone="sunken">
          <h2 className="text-[clamp(1.6rem,3.4vw,2.2rem)] font-semibold tracking-[-0.02em]">
            Still not sure what you will pay?
          </h2>
          <p className="mt-4 max-w-[52ch] text-pretty leading-[1.6] text-fg-muted">
            Our clerical team will tell you the fee when you book, before you
            come in. Ask them.
          </p>
          <div className="mt-8">
            <CallButton />
          </div>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
