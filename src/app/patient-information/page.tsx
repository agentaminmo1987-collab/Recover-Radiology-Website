import type { Metadata } from "next";
import Link from "next/link";
import { clinic, modalities, REPORT_TURNAROUND } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "Preparing for your scan",
  description:
    "How to prepare for an ultrasound, CT, X-ray or interventional procedure at Recover Radiology. Fasting, full bladder, what to bring and what to tell us.",
  alternates: { canonical: "/patient-information" },
};

/**
 * The most used page on any radiology site. Someone reads this the night
 * before, on a phone, possibly anxious.
 *
 * So: one instruction per line, imperative verbs, numbers as numerals, and the
 * safety items separated out rather than buried in a list of eight things. No
 * marketing copy anywhere on this page.
 */
export default function PatientInformationPage() {
  const safetyItems = modalities.filter((m) => m.mustKnow);

  const faqs = [
    {
      q: "What should I bring?",
      a: "Your referral and your Medicare card. Bring your Concession or DVA card if you have one.",
    },
    {
      q: "How long will I be here?",
      a: modalities
        .map((m) => `${m.name}: ${m.duration.toLowerCase()}`)
        .join(". "),
    },
    {
      q: "When do I get my results?",
      a: `A radiologist reports your images and sends the result to your referring doctor, within ${REPORT_TURNAROUND} for ultrasound. Discuss your results with the doctor who referred you.`,
    },
    {
      q: "Do I need an appointment?",
      a: "Ultrasound, CT and interventional procedures need to be booked. For X-ray you can walk in during business hours, no appointment needed.",
    },
  ];

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
          <SectionLabel>Patient information</SectionLabel>
          <h1 className="mt-4 max-w-[16ch] text-balance text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Preparing for your scan
          </h1>
          <p className="mt-6 max-w-[54ch] text-pretty text-[1.15rem] leading-[1.5] text-fg-muted">
            Find your scan below. If your referral says something different to
            this page, follow your referral and call us if you are unsure.
          </p>

          {/* Jump list. This page is long and read on a phone. */}
          <nav aria-label="On this page" className="mt-10">
            <ul className="flex flex-wrap gap-2">
              {modalities.map((m) => (
                <li key={m.slug}>
                  <a
                    href={`#prep-${m.slug}`}
                    className="inline-flex min-h-[44px] items-center rounded-[var(--radius-pill)] border border-[var(--card-border)] px-5 text-[0.95rem] text-fg-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    {m.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        {/* Safety first, separated so it cannot be skimmed past. */}
        {safetyItems.length > 0 ? (
          <Section tone="raised" className="border-y border-[var(--card-border)]">
            <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-accent">
              Tell us before your scan
            </h2>
            <ul className="mt-6 space-y-4">
              {safetyItems.map((m) => (
                <li
                  key={m.slug}
                  className="max-w-[62ch] border-l-4 border-accent pl-6 text-pretty text-[1.1rem] leading-[1.5] text-fg"
                >
                  {m.mustKnow}
                </li>
              ))}
              <li className="max-w-[62ch] border-l-4 border-accent pl-6 text-pretty text-[1.1rem] leading-[1.5] text-fg">
                Tell us if you have had a reaction to contrast before, or if you
                have kidney problems, before a CT with contrast.
              </li>
            </ul>
          </Section>
        ) : null}

        {modalities.map((m, i) => (
          <Section
            key={m.slug}
            id={`prep-${m.slug}`}
            tone={i % 2 === 1 ? "sunken" : "base"}
            className="scroll-mt-24"
          >
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div>
                <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                  {m.name}
                </h2>
                <p className="tabular mt-3 text-[0.97rem] text-fg-subtle">
                  {m.duration}
                </p>
                <Link
                  href={`/${m.slug}`}
                  className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-[0.97rem] font-semibold text-accent hover:underline"
                >
                  About {m.name.toLowerCase()} <span aria-hidden>&rarr;</span>
                </Link>
              </div>

              <dl className="divide-y divide-[var(--card-border)] border-y border-[var(--card-border)]">
                {m.preparation.map((p) => (
                  <div key={p.label} className="py-6">
                    <dt className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">
                      {p.label}
                    </dt>
                    {/* One instruction, one line, imperative. */}
                    <dd className="mt-2 max-w-[54ch] text-pretty text-[1.1rem] leading-[1.5] text-fg">
                      {p.instruction}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Section>
        ))}

        <Section tone="raised" className="border-t border-[var(--card-border)]">
          <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            Common questions
          </h2>
          <div className="mt-8 max-w-[70ch] divide-y divide-[var(--card-border)] border-y border-[var(--card-border)]">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-[1.08rem] font-medium text-fg [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="shrink-0 text-accent transition-transform duration-[var(--rr-dur-base)] group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-pretty leading-[1.6] text-fg-muted">
                  {f.a}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-10 text-[1.02rem] text-fg-muted">
            Anything else, call us on{" "}
            <a
              href={clinic.phone.href}
              className="tabular font-medium text-accent hover:underline"
            >
              {clinic.phone.display}
            </a>
            , {clinic.hours.display.toLowerCase()}.
          </p>
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
