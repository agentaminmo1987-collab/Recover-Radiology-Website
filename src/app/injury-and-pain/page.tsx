import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  clinic, team, modalities, MSK, RECOVERY, SAME_DAY, REPORT_TURNAROUND,
} from "@/lib/clinic";
import { procedures } from "@/lib/procedures";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Section, SectionLabel, Card, ButtonLink, CallButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Injury and pain imaging",
  description: `Imaging and image guided injections for work, sport and everyday injuries in ${clinic.address.suburb}. Specialist MSK sonographers. Most services bulk billed.`,
  alternates: { canonical: "/injury-and-pain" },
  openGraph: {
    title: `Injury and pain imaging | ${clinic.name}`,
    description: `Imaging and image guided treatment for injury and pain in ${clinic.address.suburb}.`,
    url: "/injury-and-pain",
  },
};

/**
 * The injury and recovery hub. The page the practice's name has been promising
 * since launch without ever delivering.
 *
 * WHY THIS PAGE EXISTS. The competitor at Morphett Vale is a general bulk
 * billed imaging network with five sites, more pages and seven named
 * radiologists. Competing with them on "bulk billed imaging near me" is a fight
 * decided by scale, and they have the scale.
 *
 * This is different ground and the practice already occupies it: specialist MSK
 * sonographers, an MSK specialist radiologist, a complete image guided pain
 * suite, and direct billing to ReturnToWorkSA and motor vehicle claims. Nobody
 * else in the suburb can say that sentence.
 *
 * NOTHING NEW IS CLAIMED HERE. Every service, procedure and billing rule is
 * already in clinic.ts and on another page. This page reorganises them around
 * the person who has the problem rather than around the equipment that solves
 * it, which is the whole difference between a clinic that lists modalities and
 * one that answers a question.
 *
 * The register stays flat. No "elite", no "leading", no promises about
 * outcomes. AHPRA section 133 rules that out, and it would ring false anyway to
 * the audience this is written for.
 */

/** Procedures worth naming here, drawn straight from the procedure set. */
const PAIN_PROCEDURES = [
  "cortisone-injection",
  "osteoarthritis-injection",
  "hydrodilatation",
  "facet-joint-injection",
  "nerve-root-block",
  "medial-branch-block",
];

export default function InjuryAndPainPage() {
  const ultrasound = modalities.find((m) => m.slug === "ultrasound")!;
  const msk = ultrasound.types.find((t) => t.name === "Musculoskeletal");
  const painProcedures = PAIN_PROCEDURES.map((s) =>
    procedures.find((p) => p.slug === s),
  ).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "Injury and pain imaging",
    description: `Imaging and image guided injections for work, sport and everyday injuries at ${clinic.name}.`,
    about: {
      "@type": "MedicalSpecialty",
      name: "Musculoskeletal radiology",
    },
    provider: {
      "@type": "MedicalBusiness",
      name: clinic.name,
      telephone: clinic.phone.display,
      address: {
        "@type": "PostalAddress",
        streetAddress: clinic.address.line1,
        addressLocality: clinic.address.suburb,
        addressRegion: clinic.address.state,
        postalCode: clinic.address.postcode,
        addressCountry: clinic.address.country,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[--rr-space-xl]">
          <Breadcrumbs trail={[{ label: "Injury and pain" }]} />

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <SectionLabel>Injury and pain</SectionLabel>
              <h1 className="mt-4 max-w-[17ch] text-balance text-[clamp(2.2rem,5.6vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                We are called Recover for a reason
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-[1.12rem] leading-[1.5] text-fg-muted">
                Most of what we do is finding out why something hurts, and then
                helping to settle it. Work injuries, sporting injuries, and the
                pain that has been there long enough that you have stopped
                mentioning it.
              </p>
              <p className="mt-4 max-w-[52ch] text-pretty leading-[1.6] text-fg-muted">
                You do not need to be an athlete to be taken seriously here.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact" size="lg" echo>
                  Book a scan
                </ButtonLink>
                <CallButton variant="ghost" />
              </div>
              <p className="mt-5 text-[0.95rem] text-fg-subtle">
                {SAME_DAY.short}
              </p>
            </div>

            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)]">
                <Image
                  src="/img/clinic/ultrasound-room-1600.avif"
                  alt="The ultrasound room at Recover Radiology, with the examination bed and machine"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>
        </Section>

        {/* Who it is for, in their words rather than ours. */}
        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <SectionLabel>What brings people here</SectionLabel>
          <h2 className="mt-4 max-w-[24ch] text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            If any of this sounds like you
          </h2>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {RECOVERY.reasons.map((r, i) => (
              <li key={r.title} style={{ "--i": i } as React.CSSProperties}>
                <Card className="h-full">
                  <h3 className="rr-hl__title text-[1.15rem] font-semibold tracking-[-0.01em]">
                    {r.title}
                  </h3>
                  <span aria-hidden className="rr-hl__rule mt-3 block h-px w-full" />
                  <p className="mt-3 max-w-[44ch] text-pretty leading-[1.6] text-fg-muted">
                    {r.body}
                  </p>
                </Card>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-[0.97rem] text-fg-subtle">
            You will need a referral from your doctor, physiotherapist or
            specialist.{" "}
            <Link href="/billing" className="text-accent hover:underline">
              What it will cost
            </Link>
          </p>
        </Section>

        {/* The specialisation. The reason this page is credible. */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                Who looks at it matters
              </h2>
              <p className="mt-6 max-w-[50ch] text-pretty leading-[1.65] text-fg-muted">
                Musculoskeletal ultrasound is operator dependent in a way most
                imaging is not. The image is made live, and finding a small
                tendon tear depends on the sonographer knowing where to look and
                what to move while they look.
              </p>
              <p className="mt-4 max-w-[50ch] text-pretty leading-[1.65] text-fg-muted">
                {MSK.short} Between our {team.sonographerCount} sonographers
                there is {team.combinedExperience.toLowerCase()}.
              </p>
              <div className="mt-8">
                <ButtonLink href="/our-team" variant="ghost">
                  Meet the team
                </ButtonLink>
              </div>
            </div>

            <Card>
              <h3 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                What musculoskeletal ultrasound covers
              </h3>
              <p className="mt-4 text-pretty leading-[1.6] text-fg-muted">
                {msk?.detail}
              </p>
              <dl className="mt-8 space-y-4 border-t border-[var(--card-border)] pt-6">
                <div className="flex justify-between gap-6">
                  <dt className="text-[0.95rem] text-fg-subtle">How long</dt>
                  <dd className="tabular text-right text-[0.95rem] text-fg">
                    {ultrasound.duration}
                  </dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-[0.95rem] text-fg-subtle">Radiation</dt>
                  <dd className="text-right text-[0.95rem] text-fg">None</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-[0.95rem] text-fg-subtle">Report</dt>
                  <dd className="tabular text-right text-[0.95rem] text-fg">
                    {REPORT_TURNAROUND}
                  </dd>
                </div>
              </dl>
              <p className="mt-6">
                <Link href="/ultrasound" className="font-semibold text-accent hover:underline">
                  About ultrasound &rarr;
                </Link>
              </p>
            </Card>
          </div>
        </Section>

        {/* Treatment, not just diagnosis. The commercially important half. */}
        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <SectionLabel>Treatment, not just pictures</SectionLabel>
          <h2 className="mt-4 max-w-[26ch] text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            Image guided injections, on site
          </h2>
          <p className="mt-6 max-w-[58ch] text-pretty leading-[1.65] text-fg-muted">
            Finding the problem and treating it in the same building saves a
            referral, a wait and a trip. Our radiologists perform image guided
            injections and blocks on dedicated procedure days, using imaging to
            place the needle exactly where it needs to go rather than by feel.
          </p>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {painProcedures.map((p) => (
              <li key={p!.slug}>
                <Link href={`/interventional/${p!.slug}`} className="group block h-full">
                  <Card className="h-full transition-colors group-hover:border-accent">
                    <h3 className="text-[1.05rem] font-semibold">
                      {p!.name}
                      <span
                        aria-hidden
                        className="ml-2 inline-block text-accent transition-transform group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </h3>
                    <p className="mt-2 max-w-[40ch] text-pretty text-[0.92rem] leading-[1.5] text-fg-muted">
                      {p!.summary}
                    </p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>

          <p
            role="note"
            className="mt-10 max-w-[70ch] rounded-[var(--radius-md)] border-l-4 border-accent bg-surface-sunken p-6 text-pretty text-[1.02rem] leading-[1.55] text-fg"
          >
            Tell our staff if you are taking any blood thinning medication when
            you book. It is the main limitation on these procedures and we need
            to know in advance rather than on the day.
          </p>

          <p className="mt-8">
            <Link href="/interventional" className="font-semibold text-accent hover:underline">
              All procedures we perform &rarr;
            </Link>
          </p>
        </Section>

        {/* Claims. The practical question for an injured worker. */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                Work and accident claims
              </h2>
              <p className="mt-6 max-w-[50ch] text-pretty leading-[1.65] text-fg-muted">
                If your injury happened at work, we bill ReturnToWorkSA directly
                for accepted claims. If it happened in a motor vehicle accident,
                the imaging is billed to the claim. Either way there is nothing
                for you to pay on the day.
              </p>
              <p className="mt-4 max-w-[50ch] text-pretty leading-[1.65] text-fg-muted">
                Bring your claim number and, for a work injury, your
                employer&rsquo;s details. If you are not sure whether your claim
                covers the scan, call us before you come and we will check.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CallButton />
                <ButtonLink href="/billing" size="lg" variant="ghost">
                  Billing detail
                </ButtonLink>
              </div>
            </div>

            <Card>
              <h3 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                Bring with you
              </h3>
              <ul className="mt-5 space-y-3">
                {[
                  "Your referral",
                  "Your Medicare card",
                  "Your claim number, if you have one",
                  "Your employer's details, for a work injury",
                  "Any previous imaging of the same area",
                ].map((b) => (
                  <li key={b} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[0.6em] h-[6px] w-[6px] shrink-0 rounded-full bg-accent"
                    />
                    <span className="text-pretty leading-[1.55] text-fg-muted">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>

        <Section tone="sunken" className="border-t border-[var(--card-border)]">
          <h2 className="max-w-[20ch] text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            Start where it hurts
          </h2>
          <p className="mt-5 max-w-[52ch] text-pretty leading-[1.65] text-fg-muted">
            {clinic.address.full}. {clinic.hours.display}. {SAME_DAY.short}
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
