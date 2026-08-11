import type { Metadata } from "next";
import Link from "next/link";
import { clinic, referrerGuidance, modalities, REPORT_TURNAROUND } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel, ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "For referrers",
  description:
    "Referrer information for Recover Radiology, Morphett Vale. Online image request portal, what to include on a referral, and report turnaround.",
  alternates: { canonical: "/referrers" },
};

/**
 * Peer to peer. Voice shifts here per VOICE.md: clinical shorthand is fine,
 * and the reader is a GP or specialist rather than a patient.
 */
export default function ReferrersPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[--rr-space-xl]">
          <SectionLabel>For referrers</SectionLabel>
          <h1 className="mt-4 max-w-[18ch] text-balance text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Detailed referrals get better images
          </h1>
          <p className="mt-6 max-w-[58ch] text-pretty text-[1.15rem] leading-[1.5] text-fg-muted">
            Clinical information directs protocol selection. The more specific
            the question, the more the study can be tailored to answer it.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={clinic.referrerPortal}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              Request images online
            </ButtonLink>
            <ButtonLink href={clinic.phone.href} size="lg" variant="ghost" className="tabular">
              {clinic.phone.display}
            </ButtonLink>
          </div>
        </Section>

        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-[clamp(1.6rem,3.4vw,2.2rem)] font-semibold tracking-[-0.02em]">
                Include on the referral
              </h2>
              <ol className="mt-8 space-y-5">
                {referrerGuidance.map((item, i) => (
                  <li key={item} className="flex gap-5">
                    <span className="tabular pt-1 text-[0.85rem] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[1.1rem] leading-[1.5] text-fg">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 max-w-[52ch] text-pretty leading-[1.6] text-fg-muted">
                Where a referral gives symptoms, a provisional diagnosis and the
                clinical question, the radiologist can select the most
                appropriate protocol rather than running a default study.
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                  Access
                </h3>
                <p className="mt-4 text-pretty leading-[1.6] text-fg-muted">
                  Next day and same day access is available for many studies.
                  X-ray is walk in during business hours.
                </p>
              </Card>
              <Card>
                <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                  Reporting
                </h3>
                <p className="tabular mt-4 text-[1.3rem] font-medium text-accent">
                  {REPORT_TURNAROUND}
                </p>
                <p className="mt-2 text-pretty leading-[1.6] text-fg-muted">
                  Ultrasound reports to the referring doctor. Reporting is by
                  experienced radiologists.
                </p>
              </Card>
              <Card>
                <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                  Interventional
                </h3>
                <p className="mt-4 text-pretty leading-[1.6] text-fg-muted">
                  Image guided procedures run on dedicated days each fortnight,
                  so please allow lead time when referring.
                </p>
              </Card>
            </div>
          </div>
        </Section>

        <Section>
          <h2 className="text-[clamp(1.6rem,3.4vw,2.2rem)] font-semibold tracking-[-0.02em]">
            Modalities
          </h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-border)] md:grid-cols-2">
            {modalities.map((m) => (
              <li key={m.slug} className="bg-[var(--card-bg)]">
                <Link
                  href={`/${m.slug}`}
                  className="group flex h-full flex-col p-7 transition-colors hover:bg-surface-sunken"
                >
                  <h3 className="text-[1.25rem] font-semibold">{m.name}</h3>
                  <p className="mt-3 text-pretty text-[0.97rem] leading-[1.55] text-fg-muted">
                    {m.types.map((t) => t.name).join(", ")}
                  </p>
                  <span className="tabular mt-5 text-[0.9rem] text-fg-subtle">
                    {m.duration}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-[62ch] text-pretty leading-[1.6] text-fg-muted">
            Questions about protocol selection or urgent access, call the
            practice on{" "}
            <a
              href={clinic.phone.href}
              className="tabular font-medium text-accent hover:underline"
            >
              {clinic.phone.display}
            </a>
            , {clinic.hours.display.toLowerCase()}. Fax {clinic.fax.display}.
          </p>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
