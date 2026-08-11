import { team, REPORT_TURNAROUND } from "@/lib/clinic";
import { Section, SectionLabel, H2, Card } from "@/components/ui";

/**
 * Credibility, built entirely from substantiable fact.
 *
 * AHPRA section 133 removes testimonials, ratings and reviews, which is the
 * usual content of a section like this. What is left has to be verifiable:
 * named sub-specialty, counted experience, stated turnaround, stated dose
 * principle.
 *
 * ACCREDITATION: the Diagnostic Imaging Accreditation Scheme almost certainly
 * applies here since the practice bills Medicare, and RANZCR membership is
 * likely for the reporting radiologists. Neither is verified, so neither is
 * rendered. The slot below stays commented until confirmed. Do not enable it
 * on assumption. See QUESTIONS.md items 1 and 2.
 */
const pillars = [
  {
    title: "Named sub-specialties",
    body: `${team.chiefSonographer.name} is our ${team.chiefSonographer.role}, specialising in ${team.chiefSonographer.speciality.toLowerCase()} imaging. Our ${team.sonographerCount} sonographers bring ${team.combinedExperience}.`,
  },
  {
    title: "Reports that arrive",
    body: `Ultrasound reports reach your referring doctor within ${REPORT_TURNAROUND}, so your next appointment is not spent waiting on us.`,
  },
  {
    title: "Dose kept low",
    body: "X-ray follows the ALARA principle, As Low As Reasonably Achievable. CT uses the lowest dose consistent with a diagnostic image.",
  },
  {
    title: "Detail improves the scan",
    body: "Referrals with symptoms, a provisional diagnosis and a clear clinical question let the radiologist choose the most appropriate protocol.",
  },
];

export function Credibility() {
  return (
    <Section id="credibility" tone="raised" className="border-y border-[var(--card-border)]">
      <SectionLabel>Why here</SectionLabel>
      <H2 className="mt-4 max-w-[18ch]">Specialist imaging, close to home</H2>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {pillars.map((p) => (
          <Card key={p.title}>
            <h3 className="text-[1.15rem] font-semibold tracking-[-0.01em]">
              {p.title}
            </h3>
            <p className="mt-3 text-pretty leading-[1.6] text-fg-muted">
              {p.body}
            </p>
          </Card>
        ))}
      </div>

      {/* TODO(amin): accreditation marks.
          Renders only once DIAS accreditation and RANZCR membership are
          confirmed in writing. Blocked in QUESTIONS.md item 1. Deliberately
          not rendered as an empty placeholder: an unfilled trust slot is worse
          than no slot, and an unverified accreditation claim on a regulated
          health service is a compliance risk, not a design gap. */}
    </Section>
  );
}
