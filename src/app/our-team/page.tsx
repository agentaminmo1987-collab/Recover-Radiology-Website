import type { Metadata } from "next";
import Link from "next/link";
import { clinic, team, REPORT_TURNAROUND } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel, Card, ButtonLink, CallButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our team",
  description: `The sonographers, radiographers and clerical team at ${clinic.name} in ${clinic.address.suburb}. ${team.combinedExperience} in ultrasound.`,
  alternates: { canonical: "/our-team" },
  openGraph: {
    title: `Our team | ${clinic.name}`,
    description: `Who you will meet at ${clinic.name} in ${clinic.address.suburb}.`,
    url: "/our-team",
  },
};

/**
 * The team page.
 *
 * TWO CONSTRAINTS SHAPE EVERY LINE HERE.
 *
 * 1. AHPRA section 133 bans superlatives about a regulated health service. So
 *    no "highly talented", "expert", "leading" or "best". What replaces them is
 *    measurable fact: how many sonographers, how many years between them, what
 *    they scan, how fast the report comes back. That is a stronger claim than
 *    an adjective anyway, because it is checkable.
 *
 * 2. Named individuals go stale. The Chief Sonographer and the CT technologist
 *    both left this month and had to be scrubbed from every page. So the page
 *    is built to survive turnover: the headline numbers come from `team`, the
 *    named cards are first names only with no invented credentials, and nothing
 *    structural breaks if a name is removed from `clinic.ts`.
 *
 * Anything not in `clinic.ts` is not here. In particular there are no
 * qualifications, no ASAR registration numbers, no photographs of staff and no
 * radiologist names, because none of those have been supplied. See QUESTIONS.md.
 */

const measures = [
  {
    value: String(team.sonographerCount),
    label:
      "Sonographers on staff, so ultrasound runs every day the practice is open.",
  },
  {
    value: "25 years",
    label: "Of combined ultrasound experience between them.",
  },
  {
    value: REPORT_TURNAROUND,
    label: "From your ultrasound to the report reaching your referring doctor.",
  },
];

export default function OurTeamPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[--rr-space-xl]">
          <SectionLabel>Our team</SectionLabel>
          <h1 className="mt-4 max-w-[20ch] text-balance text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            The people who will scan you
          </h1>
          <p className="mt-6 max-w-[58ch] text-pretty text-[1.15rem] leading-[1.5] text-fg-muted">
            A scan is a close, quiet thing. It matters who is in the room. This
            is the team at {clinic.address.suburb}, and what they do.
          </p>

          <dl className="mt-14 grid gap-8 border-t border-[var(--card-border)] pt-10 sm:grid-cols-3">
            {measures.map((mm) => (
              <div key={mm.label}>
                <dt className="tabular text-[1.9rem] font-medium leading-[1.1] text-accent">
                  {mm.value}
                </dt>
                <dd className="mt-3 max-w-[30ch] text-[0.97rem] leading-[1.55] text-fg-muted">
                  {mm.label}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Sonographers. The team the practice most wants seen, so they get the
            page's own section rather than a row in a combined staff grid. */}
        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                Sonography
              </h2>
              <p className="mt-6 max-w-[46ch] text-pretty leading-[1.65] text-fg-muted">
                Ultrasound is the one examination where the person holding the
                probe is also the person finding the answer. The image is made
                live, and what gets captured depends on the sonographer knowing
                what to look for while they look.
              </p>
              <p className="mt-4 max-w-[46ch] text-pretty leading-[1.65] text-fg-muted">
                Our {team.sonographerCount} sonographers cover musculoskeletal,
                vascular, obstetric and general scanning between them, with{" "}
                {team.combinedExperience.toLowerCase()}.
              </p>
              <div className="mt-8">
                <ButtonLink href="/ultrasound" variant="ghost">
                  What we scan
                </ButtonLink>
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-3 lg:content-start">
              {team.sonographers.map((s) => (
                <li key={s.name}>
                  <Card className="h-full">
                    <p className="text-[1.25rem] font-semibold tracking-[-0.01em]">
                      {s.name}
                    </p>
                    <p className="mt-2 text-[0.92rem] text-fg-subtle">
                      Sonographer
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Radiographers. They run X-ray and CT, which between them are most of
            the examinations performed here, so leaving them off the page would
            have misrepresented who a patient actually meets. */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                Radiography
              </h2>
              <p className="mt-6 max-w-[46ch] text-pretty leading-[1.65] text-fg-muted">
                Radiographers perform your X-ray and CT. Positioning is most of
                the skill: the same examination can answer the question clearly
                or not at all depending on how you are placed, and doing it well
                means using the lowest dose that still produces a diagnostic
                image.
              </p>
              <p className="mt-4 max-w-[46ch] text-pretty leading-[1.65] text-fg-muted">
                They are also the people who will talk you through what is about
                to happen, and who notice when someone is finding it hard.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/x-ray" variant="ghost">
                  X-ray
                </ButtonLink>
                <ButtonLink href="/ct" variant="ghost">
                  CT
                </ButtonLink>
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:content-start">
              {team.radiographers.map((r) => (
                <li key={r.name}>
                  <Card className="h-full">
                    <p className="text-[1.25rem] font-semibold tracking-[-0.01em]">
                      {r.name}
                    </p>
                    <p className="mt-2 text-[0.92rem] text-fg-subtle">
                      Radiographer
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Reception and clerical. Named because these are the people a patient
            speaks to first, and often the only ones they speak to at all. */}
        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                Reception and bookings
              </h2>
              <p className="mt-6 max-w-[46ch] text-pretty leading-[1.65] text-fg-muted">
                The first voice you hear and the desk you check in at. They book
                the appointment, check your referral, confirm what Medicare
                covers, and tell you the fee before you commit to anything.
              </p>
              <div className="mt-8">
                <CallButton variant="ghost" />
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                { name: team.practiceManager.name, role: team.practiceManager.role },
                { name: team.clericalLead.name, role: team.clericalLead.role },
                ...team.clerical.map((c) => ({ name: c.name, role: "Clerical" })),
              ].map((p) => (
                <li key={p.name}>
                  <Card className="h-full">
                    <p className="text-[1.25rem] font-semibold tracking-[-0.01em]">
                      {p.name}
                    </p>
                    <p className="mt-2 text-[0.92rem] text-fg-subtle">{p.role}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Radiologists. No names and no photograph.
            No names, because none have been supplied, and inventing one for a
            doctor who signs reports is not a small error. No photograph, because
            the only staffed frames we hold show people who have since left the
            practice. */}
        <Section tone="sunken" className="border-y border-[var(--card-border)]">
          <div className="max-w-[62ch]">
            <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
              Radiologists
            </h2>
            <p className="mt-6 text-pretty leading-[1.65] text-fg-muted">
              Your images are reported by radiologists, the specialist doctors
              trained to read them. They also perform the image guided injections
              and blocks on our procedure days.
            </p>
            <p className="mt-4 text-pretty leading-[1.65] text-fg-muted">
              Your report goes to the doctor who referred you, so the
              conversation about what it means happens with someone who already
              knows your history. Ultrasound reports reach them within{" "}
              {REPORT_TURNAROUND}.
            </p>
            <p className="mt-8">
              <Link href="/interventional" className="text-accent hover:underline">
                Procedures they perform
              </Link>
            </p>
          </div>
        </Section>

        <Section>
          <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            Come and meet them
          </h2>
          <p className="mt-5 max-w-[52ch] text-pretty leading-[1.65] text-fg-muted">
            {clinic.address.full}. {clinic.hours.display}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg" echo>
              Book a scan
            </ButtonLink>
            <CallButton variant="ghost" />
          </div>
          <p className="mt-8 text-[0.97rem] text-fg-subtle">
            <Link href="/our-clinic" className="text-accent hover:underline">
              See the rooms before you come in
            </Link>
          </p>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
