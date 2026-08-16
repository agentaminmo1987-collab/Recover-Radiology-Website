import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { clinic, team, modalities, REPORT_TURNAROUND } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Section, SectionLabel, Card, ButtonLink, CallButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "About us",
  description: `${clinic.name}, a bulk billed imaging practice in ${clinic.address.suburb} serving ${clinic.serviceArea}. Ultrasound, CT, X-ray and image guided procedures.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${clinic.name}`,
    description: `A bulk billed imaging practice in ${clinic.address.suburb}.`,
    url: "/about",
  },
};

/**
 * About the practice.
 *
 * REBUILT to carry credibility rather than repeat the roster. It previously
 * listed every staff member, which duplicated /our-team exactly: bad for a
 * visitor, who reads the same cards twice, and bad for search, where two pages
 * competing on the same content split whatever authority either would have had.
 * The roster now lives on /our-team and this page links to it.
 *
 * CREDIBILITY HERE IS EVIDENCE, NOT ADJECTIVES. AHPRA section 133 bans
 * testimonials, ratings and superlatives for a regulated health service, which
 * removes every lever a normal "about us" page would pull. What is left is
 * better anyway: what equipment is in the building, how fast the report moves,
 * how the dose is managed, what it costs, and who reads the images. All of it
 * checkable, none of it asserted.
 *
 * Nothing on this page states a fact that is not in clinic.ts. In particular
 * there is no claim about accreditation, years in operation or patient numbers,
 * because none of those have been supplied. See QUESTIONS.md.
 */

const principles = [
  {
    h: "The referral decides the scan",
    p: "Every examination answers a specific question your doctor has asked. Where a referral carries the symptoms, a provisional diagnosis and the clinical question, the radiologist can select the protocol that answers it rather than running a default study.",
  },
  {
    h: "The lowest dose that still answers it",
    p: "X-ray follows the ALARA principle, As Low As Reasonably Achievable. CT uses the lowest dose consistent with a diagnostic image. Ultrasound uses no ionising radiation at all, which is why it is first for soft tissue and in pregnancy.",
  },
  {
    h: "The report is the product",
    p: `An image nobody has read is not a result. Ultrasound reports reach your referring doctor within ${REPORT_TURNAROUND}, and digital images are available to the radiologist immediately after the examination rather than after a processing step.`,
  },
  {
    h: "Cost is settled before you commit",
    p: "Most services are bulk billed, which means Medicare is billed directly and there is no gap fee. Obstetric scans and some interventional procedures are the exceptions, and our clerical team will tell you the fee when you book.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[--rr-space-xl]">
          <Breadcrumbs trail={[{ label: "About us" }]} />

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <SectionLabel>About</SectionLabel>
              <h1 className="mt-4 max-w-[18ch] text-balance text-[clamp(2.2rem,5.6vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                Imaging for {clinic.serviceArea}
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-[1.12rem] leading-[1.5] text-fg-muted">
                {clinic.name} is a diagnostic imaging practice in{" "}
                {clinic.address.suburb}, inside the health precinct on Doctors
                Road. Ultrasound, CT, X-ray and image guided procedures, under
                one roof, with most services bulk billed.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact" size="lg" echo>
                  Book a scan
                </ButtonLink>
                <CallButton variant="ghost" />
              </div>
            </div>

            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)]">
                <Image
                  src="/img/clinic/exterior-1600.avif"
                  alt="The Recover Radiology entrance on Doctors Road, Morphett Vale, with X-ray, CT, ultrasound and interventional signage above the door"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>

          <dl className="mt-16 grid gap-8 border-t border-[var(--card-border)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: "4", l: "Modalities on site: ultrasound, CT, X-ray and interventional." },
              { v: String(team.sonographerCount), l: `Sonographers, with ${team.combinedExperience.toLowerCase()}.` },
              { v: REPORT_TURNAROUND, l: "Ultrasound reports to your referring doctor." },
              { v: "Bulk billed", l: "Most services. Obstetric and some interventional are the exceptions." },
            ].map((f, i) => (
              <div key={f.l} style={{ "--i": i } as React.CSSProperties}>
                <dt className="tabular rr-hl__title text-[1.6rem] font-medium leading-[1.15]">
                  {f.v}
                </dt>
                <span aria-hidden className="rr-hl__rule mt-3 block h-px w-full" />
                <dd className="mt-3 max-w-[30ch] text-[0.95rem] leading-[1.55] text-fg-muted">
                  {f.l}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* What is actually in the building. The most concrete credibility a
            practice has, and the thing a referring GP most wants to know. */}
        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <SectionLabel>What we have on site</SectionLabel>
          <h2 className="mt-4 max-w-[20ch] text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            Four modalities, one building
          </h2>
          <p className="mt-5 max-w-[56ch] text-pretty leading-[1.65] text-fg-muted">
            Having all four in one place matters more than it sounds. It means a
            scan that turns out to need a different modality does not become a
            second referral, a second trip and another wait.
          </p>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {modalities.map((m) => (
              <li key={m.slug}>
                <Link href={`/${m.slug}`} className="group block h-full">
                  <Card className="h-full transition-colors group-hover:border-accent">
                    <h3 className="text-[1.2rem] font-semibold tracking-[-0.01em]">
                      {m.name}
                      <span
                        aria-hidden
                        className="ml-2 inline-block text-accent transition-transform group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </h3>
                    <p className="mt-3 max-w-[44ch] text-pretty text-[0.97rem] leading-[1.55] text-fg-muted">
                      {m.summary}
                    </p>
                    <p className="tabular mt-4 text-[0.88rem] text-fg-subtle">
                      {m.duration}
                    </p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        {/* How we work. Four principles, each one checkable. */}
        <Section>
          <SectionLabel>How we work</SectionLabel>
          <h2 className="mt-4 max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            What we hold ourselves to
          </h2>

          <div className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
            {principles.map((p, i) => (
              <div key={p.h} style={{ "--i": i } as React.CSSProperties}>
                <h3 className="rr-hl__title text-[1.15rem] font-semibold tracking-[-0.01em]">
                  {p.h}
                </h3>
                <span aria-hidden className="rr-hl__rule mt-3 block h-px w-full" />
                <p className="mt-3 max-w-[52ch] text-pretty leading-[1.65] text-fg-muted">
                  {p.p}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Who you meet, and who reads the images. Points at the team page
            rather than repeating it. */}
        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                Who you will meet
              </h2>
              <p className="mt-6 max-w-[48ch] text-pretty leading-[1.65] text-fg-muted">
                Your scan is performed by {team.sonographerCount} sonographers
                and {team.radiographers.length} radiographers, and reported by
                radiologists, the specialist doctors trained to read the images.
                The same radiologists perform the image guided injections on our
                procedure days.
              </p>
              <p className="mt-4 max-w-[48ch] text-pretty leading-[1.65] text-fg-muted">
                Reception book the appointment, check the referral and confirm
                what Medicare covers before you commit to anything.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/our-team" size="lg" variant="ghost">
                  Meet the team
                </ButtonLink>
                <ButtonLink href="/our-clinic" size="lg" variant="ghost">
                  See the clinic
                </ButtonLink>
              </div>
            </div>

            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)]">
                <Image
                  src="/img/clinic/reception-team-1600.avif"
                  alt="Reception staff at Recover Radiology taking a booking at the front desk"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>
        </Section>

        {/* Referrers. A GP checking a new practice is a real audience for this
            page, and they want different things from a patient. */}
        <Section tone="sunken" className="border-b border-[var(--card-border)]">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                For referring doctors
              </h2>
              <p className="mt-6 max-w-[50ch] text-pretty leading-[1.65] text-fg-muted">
                Images and reports are available through our online portal.
                Ultrasound reports are returned within {REPORT_TURNAROUND}, and
                next day or same day access is available for many studies.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/referrers" size="lg">
                  Referrer information
                </ButtonLink>
                <ButtonLink
                  href={clinic.referrerPortal}
                  size="lg"
                  variant="ghost"
                >
                  Image portal
                </ButtonLink>
              </div>
            </div>

            <Card>
              <h3 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                Practice details
              </h3>
              <dl className="mt-6 space-y-4">
                {[
                  ["Address", clinic.address.full],
                  ["Hours", clinic.hours.display],
                  ["Phone", clinic.phone.display],
                  ["Fax", clinic.fax.display],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6">
                    <dt className="shrink-0 text-[0.95rem] text-fg-subtle">{k}</dt>
                    <dd className="tabular max-w-[24ch] text-right text-[0.95rem] text-fg">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </Section>

        <Section>
          <h2 className="max-w-[20ch] text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            Ready when you are
          </h2>
          <p className="mt-5 max-w-[52ch] text-pretty leading-[1.65] text-fg-muted">
            {clinic.address.full}. {clinic.hours.display}. Bring your referral
            and your Medicare card.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg" echo>
              Book a scan
            </ButtonLink>
            <CallButton variant="ghost" />
          </div>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
