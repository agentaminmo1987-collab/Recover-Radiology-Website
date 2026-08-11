import type { Metadata } from "next";
import { clinic, team, REPORT_TURNAROUND } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel, Card, Fact } from "@/components/ui";

export const metadata: Metadata = {
  title: "About us",
  description: `${clinic.name} is a bulk billed diagnostic imaging practice in ${clinic.address.suburb}, serving ${clinic.serviceArea}.`,
  alternates: { canonical: "/about" },
};

/**
 * Team section.
 *
 * Only first names are published for most staff and no qualifications or
 * photographs exist for them. Nothing here is invented: the component is built
 * so first-names-only reads as a deliberate, complete design rather than a
 * gap, and so adding surnames, headshots and AHPRA numbers later is additive.
 *
 * No generated photography is used on this page. See QUESTIONS.md item 4.
 */
export default function AboutPage() {
  const roster = [
    ...team.sonographers.map((s) => ({
      name: s.name,
      role: "Sonographer",
      speciality: "",
      lead: false,
    })),
    { name: team.practiceManager.name, role: team.practiceManager.role, speciality: "", lead: false },
    { name: team.clericalLead.name, role: team.clericalLead.role, speciality: "", lead: false },
    ...team.clerical.map((c) => ({
      name: c.name,
      role: "Clerical",
      speciality: "",
      lead: false,
    })),
  ];

  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[--rr-space-xl]">
          <SectionLabel>About</SectionLabel>
          <h1 className="mt-4 max-w-[18ch] text-balance text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Imaging for {clinic.serviceArea}
          </h1>
          <p className="mt-6 max-w-[56ch] text-pretty text-[1.15rem] leading-[1.5] text-fg-muted">
            {clinic.name} is a diagnostic imaging practice in{" "}
            {clinic.address.suburb}. Most services are bulk billed, X-ray is walk
            in, and reports reach your doctor quickly so your care is not held up
            waiting on us.
          </p>

          <div className="mt-14 grid gap-10 border-t border-[var(--card-border)] pt-12 sm:grid-cols-3">
            <Fact
              value={team.combinedExperience}
              label={`Across our ${team.sonographerCount} sonographers.`}
            />
            <Fact value={REPORT_TURNAROUND} label="Ultrasound reports to your doctor." />
            <Fact value="Walk in" label="X-ray during business hours, usually same day." />
          </div>
        </Section>

        <Section tone="raised" className="border-y border-[var(--card-border)]">
          <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
            Our team
          </h2>
          <p className="mt-4 max-w-[54ch] text-pretty leading-[1.6] text-fg-muted">
            Imaging is performed by qualified sonographers and radiographers, and
            reported by experienced radiologists.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roster.map((p) => (
              <li key={`${p.name}-${p.role}`}>
                <Card className="h-full">
                  {/* TODO(amin): headshot slot. Real photography only, never
                      generated. Blocked in QUESTIONS.md item 4. */}
                  <h3 className="text-[1.15rem] font-semibold">{p.name}</h3>
                  <p className="mt-1 text-[0.95rem] text-fg-muted">{p.role}</p>
                  {p.speciality ? (
                    <p className="mt-3 inline-flex rounded-[var(--radius-pill)] border border-[var(--card-border)] px-3 py-1 text-[0.82rem] text-accent">
                      {p.speciality}
                    </p>
                  ) : null}
                  {/* TODO(amin): AHPRA registration number, once confirmed.
                      QUESTIONS.md item 2. */}
                </Card>
              </li>
            ))}
          </ul>
        </Section>

        <Section>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-[clamp(1.6rem,3.4vw,2.2rem)] font-semibold tracking-[-0.02em]">
                How we work
              </h2>
              <div className="mt-6 max-w-[54ch] space-y-5 text-pretty leading-[1.6] text-fg-muted">
                <p>
                  Every scan answers a specific question your doctor has asked.
                  Where a referral includes symptoms, a provisional diagnosis and
                  the clinical question, the radiologist can choose the most
                  appropriate protocol rather than a default study.
                </p>
                <p>
                  X-ray follows the ALARA principle, As Low As Reasonably
                  Achievable. CT uses the lowest dose consistent with a
                  diagnostic image. Ultrasound uses no ionising radiation at all.
                </p>
              </div>
            </div>

            <Card>
              <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                Practice details
              </h2>
              <dl className="mt-6 space-y-4">
                <div className="flex justify-between gap-6">
                  <dt className="text-[0.95rem] text-fg-subtle">Address</dt>
                  <dd className="tabular max-w-[24ch] text-right text-[0.95rem] text-fg">
                    {clinic.address.full}
                  </dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-[0.95rem] text-fg-subtle">Hours</dt>
                  <dd className="tabular text-right text-[0.95rem] text-fg">
                    {clinic.hours.display}
                  </dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-[0.95rem] text-fg-subtle">Phone</dt>
                  <dd className="tabular text-right text-[0.95rem]">
                    <a href={clinic.phone.href} className="inline-flex min-h-[44px] items-center text-accent hover:underline">
                      {clinic.phone.display}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-[0.95rem] text-fg-subtle">Fax</dt>
                  <dd className="tabular text-right text-[0.95rem] text-fg">
                    {clinic.fax.display}
                  </dd>
                </div>
              </dl>
              {/* TODO(amin): accreditation marks (DIAS, RANZCR) once confirmed.
                  Not rendered on assumption. QUESTIONS.md item 1. */}
            </Card>
          </div>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
