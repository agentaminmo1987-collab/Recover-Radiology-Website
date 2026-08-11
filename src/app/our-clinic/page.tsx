import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { clinic } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel, ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our clinic",
  description: `Inside ${clinic.name} at ${clinic.address.full}. Reception, waiting area, CT, X-ray and ultrasound rooms.`,
  alternates: { canonical: "/our-clinic" },
  openGraph: {
    title: `Our clinic | ${clinic.name}`,
    description: `Inside ${clinic.name} in ${clinic.address.suburb}.`,
    url: "/our-clinic",
  },
};

/**
 * Real photography of the actual practice.
 *
 * This page exists because it is the strongest honest trust signal available.
 * AHPRA section 133 removes testimonials and ratings, so what is left is
 * showing people exactly where they are coming and what it looks like. For
 * someone anxious about a scan, recognising the room before they arrive does
 * more than any adjective.
 *
 * Only architectural frames are used. Two of the staffed photographs show
 * people who have since left the practice, and a clinic page that pictures
 * former staff is both misleading and quickly out of date.
 */
const rooms = [
  {
    src: "/img/clinic/reception",
    alt: "Reception desk at Recover Radiology, with the waiting area beyond",
    title: "Reception",
    body: "Where you check in. Bring your referral and your Medicare card, and our clerical team will take it from there.",
    wide: true,
  },
  {
    src: "/img/clinic/waiting-room",
    alt: "Waiting area with seating, natural timber flooring and plants",
    title: "Waiting area",
    body: "Most people are not waiting long. Ultrasound appointments are usually finished inside 30 minutes.",
  },
  {
    src: "/img/clinic/ct-room",
    alt: "CT scanner room with a skylight above the scanner",
    title: "CT",
    body: "The scanner sits under a skylight. A standard scan takes about 15 minutes, or 30 with contrast.",
  },
  {
    src: "/img/clinic/xray-room",
    alt: "Digital X-ray room with the table, detector and control area",
    title: "X-ray",
    body: "Walk in during business hours. No appointment needed, and usually completed the same day.",
  },
  {
    src: "/img/clinic/ultrasound-room",
    alt: "Ultrasound room with the examination bed and machine",
    title: "Ultrasound",
    body: "No ionising radiation. Musculoskeletal, vascular, obstetric and general scans are all performed here.",
  },
  {
    src: "/img/clinic/signage",
    alt: "Recover Radiology signage on frosted glass, with the brand motif",
    title: "Inside the door",
    body: "The mark on the glass, so you know you are in the right place.",
  },
  {
    src: "/img/clinic/exterior",
    alt: "Recover Radiology street frontage, with X-ray, CT scan, ultrasound and interventional signage above the entrance",
    title: "Finding us",
    body: `${clinic.address.full}. Look for the sign above the entrance, next to the pharmacy. Parking is at the door.`,
    wide: true,
  },
];

export default function OurClinicPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[--rr-space-xl]">
          <SectionLabel>Our clinic</SectionLabel>
          <h1 className="mt-4 max-w-[18ch] text-balance text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Have a look before you come in
          </h1>
          <p className="mt-6 max-w-[56ch] text-pretty text-[1.15rem] leading-[1.5] text-fg-muted">
            Knowing what a room looks like before you walk into it takes some of
            the edge off. This is the practice as it actually is, in{" "}
            {clinic.address.suburb}.
          </p>
        </Section>

        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            {rooms.map((r) => (
              <figure
                key={r.title}
                className={r.wide ? "md:col-span-2" : undefined}
              >
                <div
                  className={`relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] ${
                    r.wide ? "aspect-[21/9]" : "aspect-[3/2]"
                  }`}
                >
                  <Image
                    src={`${r.src}-1600.avif`}
                    alt={r.alt}
                    fill
                    sizes={r.wide ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-5">
                  <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em]">
                    {r.title}
                  </h2>
                  <p className="mt-2 max-w-[52ch] text-pretty leading-[1.6] text-fg-muted">
                    {r.body}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
                Getting here
              </h2>
              <address className="mt-6 not-italic">
                <p className="text-[1.15rem] font-medium leading-[1.45] text-fg">
                  {clinic.address.line1}
                  <br />
                  {clinic.address.suburb} {clinic.address.state}{" "}
                  {clinic.address.postcode}
                </p>
              </address>
              <p className="tabular mt-4 text-[1rem] text-fg-muted">
                {clinic.hours.display}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={clinic.phone.href} size="lg" className="tabular">
                  {clinic.phone.display}
                </ButtonLink>
                <ButtonLink href="/contact" size="lg" variant="ghost">
                  Contact and map
                </ButtonLink>
              </div>
            </div>

            <div>
              <h2 className="text-[0.95rem] font-semibold tracking-[0.01em] text-fg-subtle">
                Before your visit
              </h2>
              <ul className="mt-5 space-y-3">
                {[
                  ["Preparing for your scan", "/patient-information"],
                  ["What it will cost", "/billing"],
                  ["Our services", "/ultrasound"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex min-h-[52px] items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--card-border)] px-5 transition-colors hover:border-accent"
                    >
                      <span className="font-medium">{label}</span>
                      <span
                        aria-hidden
                        className="text-accent transition-transform group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
