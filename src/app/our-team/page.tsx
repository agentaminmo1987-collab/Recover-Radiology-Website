import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { clinic, team, REPORT_TURNAROUND } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel, ButtonLink, CallButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our team",
  description: `The sonographers, radiographers and reception team at ${clinic.name}, ${clinic.address.suburb}. ${team.sonographerCount} sonographers with ${team.combinedExperience.toLowerCase()}.`,
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
 * THREE CONSTRAINTS SHAPE EVERY LINE HERE.
 *
 * 1. AHPRA section 133 bans superlatives about a regulated health service. No
 *    "highly talented", "expert", "leading". What replaces them is measurable
 *    fact: how many sonographers, how many years between them, how fast the
 *    report comes back. Checkable beats adjectival.
 *
 * 2. Named individuals go stale. The Chief Sonographer and the CT technologist
 *    both left in one month and had to be scrubbed from every page. So the page
 *    survives turnover: headline numbers come from `team`, the named cards are
 *    first names only with no invented credentials, and nothing structural
 *    breaks if a name is removed from clinic.ts.
 *
 * 3. PHOTOGRAPHY IS OF THIS PRACTICE, AT FULL RESOLUTION. The old site's
 *    pictures are 650x433 web copies of the same shoot; the masters here are
 *    7400x4936, straight from the practice. Photographs are placed only where
 *    they are literally true: the reception photograph sits in the reception
 *    section, the reporting workstation sits with reporting. No stock, no
 *    generated faces.
 *
 * There are still NO INDIVIDUAL PORTRAITS anywhere, because none exist. The old
 * site never had them and the practice has not supplied any. See QUESTIONS.md;
 * `team` is shaped so a `photo` field drops in without touching this layout.
 */

const measures = [
  {
    value: String(team.sonographerCount),
    label: "Sonographers on staff, so ultrasound runs every day we are open.",
  },
  {
    // Reads from the fact set. It was hardcoded as "25 years" while the
    // sentence form on the same page came from clinic.ts, so the two could
    // disagree and did.
    value: team.combinedExperienceDisplay,
    label: "Of combined ultrasound experience between them.",
  },
  {
    value: REPORT_TURNAROUND,
    label: "From your ultrasound to the report reaching your referring doctor.",
  },
];

/**
 * One card per person, exactly as the practice supplied them.
 *
 * Credentials are set QUIETLY, on purpose. They are the strongest thing on this
 * page, and the instinct is to make them badges: a gold pill, a heavier weight,
 * a callout box. That would be a mistake twice over. It reads as boasting on a
 * medical practice, and AHPRA section 133 is unforgiving about anything that
 * shades from stating a fact into asserting superiority.
 *
 * So they sit as small lines under the role, in the same subtle grey as
 * everything else, and let the reader notice them. A person scanning the page
 * sees a name. A person reading it finds out their Chief Sonographer runs
 * ultrasound at the Royal Adelaide.
 */
function PersonCard({
  name,
  role,
  credentials,
}: {
  name: string;
  role: string;
  credentials?: readonly string[];
}) {
  return (
    <li className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
      <p className="text-[1.15rem] font-semibold tracking-[-0.01em]">{name}</p>
      <p className="mt-1.5 text-[0.88rem] text-fg-subtle">{role}</p>
      {credentials?.length ? (
        <ul className="mt-3 space-y-1 border-t border-[var(--card-border)] pt-3">
          {credentials.map((c) => (
            <li key={c} className="text-[0.82rem] leading-[1.4] text-fg-subtle">
              {c}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function OurTeamPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: clinic.name,
    url: "https://recoverradiology.com.au/our-team",
    telephone: clinic.phone.display,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.line1,
      addressLocality: clinic.address.suburb,
      addressRegion: clinic.address.state,
      postalCode: clinic.address.postcode,
      addressCountry: clinic.address.country,
    },
    // Mirrors the page exactly: same names, same roles, and the same
    // credentials where the practice has supplied them. Schema that claims more
    // than the page does is the kind of thing that gets a site penalised, so
    // this is derived from the same source rather than written separately.
    employee: [
      ...team.sonographers.map((s) => ({
        "@type": "Person",
        name: s.name,
        jobTitle: s.role,
        ...("credentials" in s && s.credentials
          ? { award: [...s.credentials] }
          : {}),
      })),
      ...team.radiographers.map((r) => ({
        "@type": "Person",
        name: r.name,
        jobTitle: r.role,
      })),
      {
        "@type": "Person",
        name: team.practiceManager.name,
        jobTitle: team.practiceManager.role,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        {/* Editorial opening: the practice's own photograph carrying the page,
            with the copy beside it rather than floating over it. Text over
            imagery has to hold at its worst pixel, and there is no reason to
            take that risk when the layout can simply put them side by side. */}
        <Section className="pt-[--rr-space-xl]">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div>
              <SectionLabel>Our team</SectionLabel>
              <h1 className="mt-4 max-w-[16ch] text-balance text-[clamp(2.2rem,5.6vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                The people who will scan you
              </h1>
              <p className="mt-6 max-w-[48ch] text-pretty text-[1.12rem] leading-[1.5] text-fg-muted">
                A scan is a close, quiet thing. It matters who is in the room.
                This is the team at {clinic.address.suburb}, and what each of
                them does.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact" size="lg" echo>
                  Book a scan
                </ButtonLink>
                <CallButton variant="ghost" />
              </div>
            </div>

            <figure className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)]">
                <Image
                  src="/img/clinic/reception-team-1600.avif"
                  alt="Reception staff at Recover Radiology taking a booking at the front desk"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-[0.85rem] text-fg-subtle">
                Reception, {clinic.address.suburb}.
              </figcaption>
            </figure>
          </div>

          <dl className="mt-16 grid gap-8 border-t border-[var(--card-border)] pt-10 sm:grid-cols-3">
            {measures.map((m, i) => (
              <div
                key={m.label}
                style={{ "--i": i } as React.CSSProperties}
              >
                <dt className="tabular rr-hl__title text-[1.9rem] font-medium leading-[1.1]">
                  {m.value}
                </dt>
                <span aria-hidden className="rr-hl__rule mt-3 block h-px w-full" />
                <dd className="mt-3 max-w-[30ch] text-[0.97rem] leading-[1.55] text-fg-muted">
                  {m.label}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Sonography. The group the practice most wants seen. */}
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
                {team.combinedExperience.toLowerCase()}. Several are specialist
                musculoskeletal sonographers, which is why injury and pain
                referrals make up so much of what we do.
              </p>
              <div className="mt-8">
                <ButtonLink href="/ultrasound" variant="ghost">
                  What we scan
                </ButtonLink>
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-3 lg:content-start">
              {/* Uses each person's own role, so the Chief Sonographer reads as
                  Chief Sonographer. It previously hardcoded "Sonographer" for
                  everyone, which flattened the one piece of seniority the
                  practice has published.

                  `alsoHolds` (the Royal Adelaide Hospital position) is
                  deliberately NOT rendered yet. It is the strongest credential
                  on the site and it needs his consent first. QUESTIONS.md. */}
              {team.sonographers.map((s) => (
                <PersonCard
                  key={s.name}
                  name={s.name}
                  role={s.role}
                  credentials={"credentials" in s ? s.credentials : undefined}
                />
              ))}
            </ul>
          </div>
        </Section>

        {/* Radiography. They run X-ray and CT, which between them are most of
            the examinations performed here. */}
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
                They are also the people who talk you through what is about to
                happen, and who notice when someone is finding it hard.
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
                <PersonCard key={r.name} name={r.name} role={r.role} />
              ))}
            </ul>
          </div>
        </Section>

        {/* Reception. The first voice you hear and the desk you check in at. */}
        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                Reception and bookings
              </h2>
              <p className="mt-6 max-w-[48ch] text-pretty leading-[1.65] text-fg-muted">
                They book the appointment, check your referral, confirm what
                Medicare covers, and tell you the fee before you commit to
                anything. If you are unsure whether your scan is bulk billed,
                they are the people who will know.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CallButton variant="ghost" />
                <ButtonLink href="/billing" variant="ghost">
                  Billing
                </ButtonLink>
              </div>

              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                <PersonCard
                  name={team.practiceManager.name}
                  role={team.practiceManager.role}
                />
                <PersonCard
                  name={team.clericalLead.name}
                  role={team.clericalLead.role}
                />
                {team.clerical.map((c) => (
                  <PersonCard key={c.name} name={c.name} role="Clerical" />
                ))}
              </ul>
            </div>

            <figure>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)]">
                <Image
                  src="/img/clinic/reception-1600.avif"
                  alt="The reception desk and waiting area at Recover Radiology"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>
        </Section>

        {/* Radiologists. No names, because none have been supplied, and
            inventing one for a doctor who signs reports is not a small error.
            The photograph is of reporting, which is what this section is about,
            so it is placed truthfully rather than decoratively. */}
        <Section tone="sunken" className="border-b border-[var(--card-border)]">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <div className="max-w-[54ch]">
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                Radiologists
              </h2>
              <p className="mt-6 text-pretty leading-[1.65] text-fg-muted">
                Your images are reported by radiologists, the specialist doctors
                trained to read them. They also perform the image guided
                injections and blocks on our procedure days.
              </p>
              <p className="mt-4 text-pretty leading-[1.65] text-fg-muted">
                Your report goes to the doctor who referred you, so the
                conversation about what it means happens with someone who
                already knows your history. Ultrasound reports reach them within{" "}
                {REPORT_TURNAROUND}.
              </p>
              <p className="mt-8">
                <Link
                  href="/interventional"
                  className="font-semibold text-accent hover:underline"
                >
                  Procedures they perform &rarr;
                </Link>
              </p>
            </div>

            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)]">
                <Image
                  src="/img/clinic/ct-operator-1600.avif"
                  alt="Reading CT images on the diagnostic workstation at Recover Radiology"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-[0.85rem] text-fg-subtle">
                Reporting, on the diagnostic workstation.
              </figcaption>
            </figure>
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
