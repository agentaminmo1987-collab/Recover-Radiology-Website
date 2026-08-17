import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  clinic, team, modalities, billing, referrerGuidance,
  ORIGIN, MSK, SAME_DAY, CAPACITY, REFERRING, SCAN_CAPABILITY, REPORT_TURNAROUND,
} from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StickySection } from "@/components/sticky-section";
import { Section, Card, ButtonLink, CallButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "For referring doctors",
  description: `Refer to ${clinic.name}, ${clinic.address.suburb}. Ultrasound, CT, X-ray and image guided procedures. Most bulk billed, reports in ${REPORT_TURNAROUND}.`,
  alternates: { canonical: "/referrers" },
  openGraph: {
    title: `For referring doctors | ${clinic.name}`,
    description: `Imaging for ${clinic.serviceArea}, most services bulk billed.`,
    url: "/referrers",
  },
};

/**
 * The referrer page, built to be presented from.
 *
 * WHAT MAKES THIS DIFFERENT FROM THE REST OF THE SITE. Every other page is read
 * alone, on a phone, by someone anxious. This one is likely to be scrolled on a
 * laptop turned sideways across a GP's desk, with someone talking over it. That
 * changes the layout requirements completely.
 *
 * Hence the sticky panes. The point stays pinned while the evidence for it
 * scrolls past, so whoever is presenting always has the current heading on
 * screen and never has to scroll back to remind the room what section they are
 * in. It answers the five things a GP asks in the order they ask them: who are
 * you, why would I send patients, what can you do, what does it cost them, and
 * where do they go.
 *
 * The scroll highlights are the same mechanism as the rest of the site, so this
 * reads as one page of one website rather than a slide deck bolted on.
 *
 * NO SUPERLATIVES, same as everywhere. A GP is the least receptive audience
 * alive to "excellence in imaging", and the competitor's page is full of it.
 * Turnaround times, bulk billing status and a phone number do more.
 */

/** What a GP is actually weighing up. Each one is answerable from fact. */
const reasons = [
  {
    h: "Reports come back fast",
    p: `Ultrasound reports reach you within ${REPORT_TURNAROUND}. Digital images are on the radiologist's workstation immediately after the examination rather than after a processing step, so nothing is waiting on us.`,
  },
  {
    h: "Your patient is unlikely to pay",
    p: "Most services are bulk billed. Obstetric scans and some interventional procedures are the exceptions, and your patient is told the fee at booking rather than at the counter.",
  },
  {
    h: "Musculoskeletal is a genuine strength",
    p: `${MSK.short} Ultrasound is operator dependent in a way most imaging is not, and MSK work in particular rewards a sonographer who has seen a great many normal tendons.`,
  },
  {
    h: "Diagnosis and treatment in one place",
    p: "Image guided injections and blocks are performed on site on dedicated procedure days, so a patient who needs one does not require a second referral to a third party.",
  },
  {
    h: "Urgent scans are generally same day",
    p: "Any modality, not just ultrasound. Call and say it is urgent and we will find a slot, and the report comes back the same day.",
  },
  {
    h: "The team is experienced",
    p: `${team.sonographerCount} sonographers with ${team.combinedExperience.toLowerCase()}, none of them junior, led by the Head Sonographer at the Royal Adelaide Hospital.`,
  },
  {
    h: "Work and accident claims are handled",
    p: "ReturnToWorkSA is billed directly for accepted claims, and motor vehicle accident imaging is billed to the claim. Your patient does not pay on the day.",
  },
];

export default function ReferrersPage() {
  const billingLabel = (b: string) =>
    b === "yes" ? "Bulk billed" : b === "mostly" ? "Usually bulk billed" : "Bulk billed, with exceptions";

  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        {/* Opening. Deliberately spare: a title, the one line that matters and
            the two actions a GP might take. */}
        <Section className="pt-[var(--rr-space-xl)]">
          <Breadcrumbs trail={[{ label: "For referring doctors" }]} />

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <p className="text-[0.78rem] font-semibold tracking-[0.01em] text-accent">
                For referring doctors
              </p>
              <h1 className="mt-4 max-w-[18ch] text-balance text-[clamp(2.2rem,5.6vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                Imaging for {clinic.serviceArea}
              </h1>
              <p className="mt-6 max-w-[50ch] text-pretty text-[1.12rem] leading-[1.55] text-fg-muted">
                Ultrasound, CT, X-ray and image guided procedures under one roof
                in {clinic.address.suburb}. Most services bulk billed, reports
                back within {REPORT_TURNAROUND}.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={clinic.referrerPortal} size="lg" echo>
                  Image portal
                </ButtonLink>
                <CallButton variant="ghost" />
              </div>
            </div>

            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)]">
                <Image
                  src="/img/clinic/exterior-1600.avif"
                  alt="Recover Radiology on Doctors Road, Morphett Vale, with X-ray, CT, ultrasound and interventional signage"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>
        </Section>

        {/* 1. Who we are */}
        <StickySection
          label="01"
          title="Who we are"
          lede={ORIGIN.short}
          tone="raised"
          aside={
            <dl className="grid gap-6 sm:grid-cols-2">
              {[
                [String(team.sonographerCount), "Sonographers"],
                [team.combinedExperienceDisplay, "Combined experience"],
                [String(team.radiographerCount), "Radiographers"],
                [REPORT_TURNAROUND, "Ultrasound reports"],
              ].map(([v, l], i) => (
                <div key={l} style={{ "--i": i } as React.CSSProperties}>
                  <dt className="tabular rr-hl__title text-[1.4rem] font-medium leading-[1.15]">
                    {v}
                  </dt>
                  <span aria-hidden className="rr-hl__rule mt-2 block h-px w-full" />
                  <dd className="mt-2 text-[0.9rem] text-fg-muted">{l}</dd>
                </div>
              ))}
            </dl>
          }
        >
          <div className="max-w-[62ch] space-y-5">
            <p className="text-pretty text-[1.08rem] leading-[1.7] text-fg-muted">
              {ORIGIN.long}
            </p>
            <p className="text-pretty leading-[1.7] text-fg-muted">
              Imaging is performed by {team.sonographerCount} sonographers and{" "}
              {team.radiographerCount} radiographers, none of them junior, and
              reported by radiologists who also perform the image guided
              procedures on our dedicated procedure days.
            </p>
            <p className="text-pretty leading-[1.7] text-fg-muted">
              Our Chief Sonographer is also Head Sonographer at the Royal
              Adelaide Hospital, and hand picked the sonography team.
            </p>
          </div>

          <div className="mt-10">
            <ButtonLink href="/our-team" variant="ghost">
              Meet the team
            </ButtonLink>
          </div>
        </StickySection>

        {/* 2. Availability. Deliberately the second section and the longest.
            A GP does not choose a provider on quality claims, which everyone
            makes and nobody can prove in a brochure. They choose on whether the
            patient in front of them can actually be seen. */}
        <StickySection
          label="02"
          title="Availability is the whole point"
          lede={`Urgent scans are generally same day, whatever the modality. And demand for bulk billed ultrasound in particular is high, with waits of ${CAPACITY.marketWait} common, which leaves you delaying management or sending the patient somewhere they will pay.`}
          aside={
            <div className="rounded-[var(--radius-lg)] border border-accent bg-surface-sunken p-6">
              <p className="tabular text-[2.6rem] font-medium leading-[1] text-accent">
                {CAPACITY.ultrasoundRooms} rooms
              </p>
              <p className="mt-3 text-pretty leading-[1.6] text-fg">
                {CAPACITY.ultrasoundRooms} ultrasound rooms running with{" "}
                {team.sonographerCount} sonographers. We invested in capacity
                specifically so the wait is not the reason you send a patient
                elsewhere.
              </p>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { h: "Urgent scans, any modality", v: CAPACITY.urgentScan, s: CAPACITY.urgentScanNote },
              { h: "Routine ultrasound", v: CAPACITY.routineUltrasound, s: "Rather than the two to four weeks that is common elsewhere." },
              { h: "Urgent reports", v: CAPACITY.urgentReport, s: "Reported and back with you the same day." },
              { h: "Routine reports", v: CAPACITY.routineReport, s: "Ultrasound reports to the referring doctor." },
            ].map((x, i) => (
              <div
                key={x.h}
                style={{ "--i": i, "--hl-to": "var(--fg)" } as React.CSSProperties}
                className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6"
              >
                <p className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">{x.h}</p>
                <p className="rr-hl__title tabular mt-2 text-[1.2rem] font-semibold leading-[1.2]">
                  {x.v}
                </p>
                <span aria-hidden className="rr-hl__rule mt-3 block h-px w-full" />
                <p className="mt-3 text-[0.9rem] leading-[1.55] text-fg-muted">{x.s}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-[62ch] text-pretty leading-[1.7] text-fg-muted">
            X-ray also takes walk-ins during business hours, usually same day, so
            a patient you would rather not send away can simply be sent.
          </p>

          {/* Capability is what makes the availability claim hold. Five
              interchangeable sonographers means no single-operator bottleneck
              on the complex studies, which is where waits usually form. */}
          <div className="mt-10 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:p-8">
            <h3 className="text-[1.1rem] font-semibold tracking-[-0.01em]">
              Every sonographer, every study
            </h3>
            <p className="mt-3 max-w-[58ch] text-pretty leading-[1.65] text-fg-muted">
              {SCAN_CAPABILITY.claim} There is no single operator bottleneck on
              the complex work, which is usually where a wait forms.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {SCAN_CAPABILITY.complex.map((c) => (
                <li
                  key={c}
                  className="rounded-[var(--radius-pill)] border border-[var(--border-strong)] px-3 py-1.5 text-[0.85rem] text-fg"
                >
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-[var(--card-border)] pt-5 text-pretty leading-[1.65] text-fg-muted">
              Our Chief Sonographer, Matt Le, is also Head Sonographer at the
              Royal Adelaide Hospital and hand picked this team.
            </p>
          </div>

          <div className="mt-8">
            <CallButton />
          </div>
        </StickySection>

        {/* 3. How referring works. The operational difference a GP feels
            immediately: the practice chases the patient rather than the other
            way round, which reverses who carries the follow-up. */}
        <StickySection
          label="03"
          title="How referring works"
          lede="A referral handed over at the end of a consult usually sits in a bag for a week. We would rather it became a phone call the same day."
          tone="sunken"
          aside={
            <p className="max-w-[40ch] text-pretty leading-[1.65] text-fg">
              {REFERRING.outcome}
            </p>
          }
        >
          <ol className="space-y-4">
            {REFERRING.steps.map((s, i) => (
              <li
                key={s.h}
                style={{ "--i": i, "--hl-to": "var(--fg)" } as React.CSSProperties}
                className="flex gap-5 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6"
              >
                <span
                  aria-hidden
                  className="tabular shrink-0 text-[1.3rem] font-medium leading-[1.2] text-accent"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="rr-hl__title text-[1.08rem] font-semibold tracking-[-0.01em]">
                    {s.h}
                  </h3>
                  <span aria-hidden className="rr-hl__rule mt-3 block h-px w-full" />
                  <p className="mt-3 max-w-[54ch] text-pretty leading-[1.6] text-fg-muted">
                    {s.p}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CallButton />
            <ButtonLink href={clinic.referrerPortal} size="lg" variant="ghost">
              Image portal
            </ButtonLink>
          </div>
          <div className="mt-8 rounded-[var(--radius-md)] border-l-4 border-accent bg-surface-sunken p-6">
            <p className="text-pretty leading-[1.65] text-fg">
              <span className="font-semibold">Images, if you want them.</span> We
              run IntelePACS, and can set up access so you can view your
              patients&rsquo; images yourself through the portal rather than
              waiting on the report alone.
            </p>
          </div>
          <p className="mt-5 text-[0.95rem] text-fg-subtle">
            Call and ask for the practice manager to set your practice up for
            electronic ordering or portal access.
          </p>
        </StickySection>

        {/* 4. Why refer */}
        <StickySection
          label="04"
          title="Why refer to us"
          lede="The rest of what decides whether a referral is easy for you and for your patient."
        >
          <ul className="grid gap-4 sm:grid-cols-2">
            {reasons.map((r, i) => (
              <li key={r.h} style={{ "--i": i, "--hl-to": "var(--fg)" } as React.CSSProperties}>
                <Card className="h-full">
                  <h3 className="rr-hl__title text-[1.05rem] font-semibold tracking-[-0.01em]">
                    {r.h}
                  </h3>
                  <span aria-hidden className="rr-hl__rule mt-3 block h-px w-full" />
                  <p className="mt-3 text-pretty text-[0.94rem] leading-[1.6] text-fg-muted">
                    {r.p}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </StickySection>

        {/* 3. Modalities, with billing status against each */}
        <StickySection
          label="05"
          title="What we can do"
          lede="Four modalities on site. Billing status against each, because it is the first thing your patient will ask you."
          tone="sunken"
          aside={
            <p className="max-w-[40ch] text-[0.92rem] leading-[1.6] text-fg-subtle">
              {billing.whatBulkBilledMeans}
            </p>
          }
        >
          <ul className="space-y-4">
            {modalities.map((m, i) => (
              <li key={m.slug} style={{ "--i": i, "--hl-to": "var(--fg)" } as React.CSSProperties}>
                <Link href={`/${m.slug}`} className="group block">
                  <Card className="transition-colors group-hover:border-accent">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h3 className="rr-hl__title text-[1.2rem] font-semibold tracking-[-0.01em]">
                        {m.name}
                        <span
                          aria-hidden
                          className="ml-2 inline-block text-accent transition-transform group-hover:translate-x-1"
                        >
                          &rarr;
                        </span>
                      </h3>
                      <span
                        className={
                          "shrink-0 rounded-[var(--radius-pill)] border px-3 py-1 text-[0.8rem] font-semibold " +
                          (m.bulkBilled === "yes"
                            ? "border-accent text-accent"
                            : "border-[var(--border-strong)] text-fg-muted")
                        }
                      >
                        {billingLabel(m.bulkBilled)}
                      </span>
                    </div>
                    <span aria-hidden className="rr-hl__rule mt-3 block h-px w-full" />
                    <p className="mt-3 max-w-[56ch] text-pretty leading-[1.6] text-fg-muted">
                      {m.summary}
                    </p>
                    <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[0.9rem]">
                      <div className="flex gap-2">
                        <dt className="text-fg-subtle">Time</dt>
                        <dd className="tabular text-fg">{m.duration}</dd>
                      </div>
                      {m.bulkBilledNote ? (
                        <div className="flex gap-2">
                          <dt className="text-fg-subtle">Note</dt>
                          <dd className="text-fg">{m.bulkBilledNote}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8">
            <Link
              href="/insights/osteoarthritis-injections-evidence"
              className="font-semibold text-accent hover:underline"
            >
              The evidence on CT guided hyaluronic acid for osteoarthritis &rarr;
            </Link>
          </p>

          <div className="mt-8 rounded-[var(--radius-md)] border-l-4 border-accent bg-surface-sunken p-6">
            <p className="text-pretty leading-[1.6] text-fg">
              <span className="font-semibold">On the referral.</span> Including{" "}
              {referrerGuidance.join(", ").toLowerCase()} lets the radiologist
              select the protocol that answers your question rather than running
              a default study.
            </p>
          </div>
        </StickySection>

        {/* 4. Hours and access */}
        <StickySection
          label="06"
          title="When we are open"
          lede="And how quickly your patient can be seen."
          aside={
            <div className="flex flex-col gap-3 sm:flex-row">
              <CallButton />
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { h: "Opening hours", p: clinic.hours.display, sub: "Closed weekends and public holidays." },
              { h: "Same day", p: "Often available", sub: "Booked by phone. Call and we will find the earliest time." },
              { h: "X-ray walk-ins", p: "During business hours", sub: "Usually same day. No appointment needed." },
              { h: "Procedures", p: "Dedicated days each fortnight", sub: "Image guided injections and blocks. Booking ahead is necessary." },
            ].map((x, i) => (
              <div
                key={x.h}
                style={{ "--i": i, "--hl-to": "var(--fg)" } as React.CSSProperties}
                className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6"
              >
                <p className="text-[0.78rem] tracking-[0.01em] text-fg-subtle">{x.h}</p>
                <p className="rr-hl__title tabular mt-2 text-[1.15rem] font-semibold">
                  {x.p}
                </p>
                <span aria-hidden className="rr-hl__rule mt-3 block h-px w-full" />
                <p className="mt-3 text-[0.9rem] leading-[1.55] text-fg-muted">{x.sub}</p>
              </div>
            ))}
          </div>
        </StickySection>

        {/* 5. Where to send them */}
        <StickySection
          label="07"
          title="Where your patients find us"
          lede={`${clinic.address.line1}, ${clinic.address.suburb}. Parking at the door, next to the pharmacy.`}
          tone="raised"
          aside={
            <a
              href={clinic.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent hover:underline"
            >
              Open in Maps <span aria-hidden>&rarr;</span>
            </a>
          }
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)]">
                <Image
                  src="/img/clinic/signage-1600.avif"
                  alt="Recover Radiology signage on frosted glass at the clinic entrance"
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </figure>
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)]">
                <Image
                  src="/img/clinic/reception-1600.avif"
                  alt="The reception desk and waiting area at Recover Radiology"
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>

          <Card className="mt-6">
            <dl className="space-y-4">
              {[
                ["Address", clinic.address.full],
                ["Hours", clinic.hours.display],
                ["Phone", clinic.phone.display],
                ["Fax", clinic.fax.display],
                ["Catchment", clinic.serviceArea],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-wrap justify-between gap-x-6 gap-y-1">
                  <dt className="text-[0.95rem] text-fg-subtle">{k}</dt>
                  <dd className="tabular max-w-[30ch] text-right text-[0.95rem] text-fg">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-[var(--card-border)] pt-5 text-[0.9rem] leading-[1.6] text-fg-subtle">
              Patients come to us from {clinic.nearbySuburbs.slice(0, 6).join(", ")} and
              across {clinic.serviceArea}.
            </p>
          </Card>
        </StickySection>

        <Section tone="sunken" className="border-t border-[var(--card-border)]">
          <h2 className="max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            Start referring, or come and look around
          </h2>
          <p className="mt-5 max-w-[54ch] text-pretty leading-[1.65] text-fg-muted">
            We are happy to show any referring practice through the rooms, and to
            talk through what we can take. Call {clinic.phone.display} and ask
            for the practice manager.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CallButton />
            <ButtonLink href={clinic.referrerPortal} size="lg" variant="ghost">
              Image portal
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="ghost">
              Send an enquiry
            </ButtonLink>
          </div>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
