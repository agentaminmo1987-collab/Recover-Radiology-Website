import { REPORT_TURNAROUND, clinic } from "@/lib/clinic";
import { Section, Fact } from "@/components/ui";

/**
 * Trust band. Every item here is substantiable from the verified fact set.
 *
 * This is where a normal service site would put testimonials or a review
 * carousel. AHPRA section 133 prohibits that for a regulated health service,
 * so the band carries measured fact instead. See DESIGN-DECISIONS.md.
 */
const facts = [
  {
    value: "Bulk billed",
    label:
      "Most services, billed directly to Medicare with no gap fee. Obstetric and some interventional are the exceptions.",
  },
  {
    value: REPORT_TURNAROUND,
    label: "Ultrasound reports to your referring doctor.",
  },
  {
    value: "Walk in",
    label: `X-ray during business hours, usually same day. No appointment needed.`,
  },
  {
    value: clinic.serviceArea,
    label: `${clinic.address.line1}, ${clinic.address.suburb}.`,
  },
];

export function TrustBand() {
  return (
    <Section tone="raised" className="border-y border-[var(--card-border)]">
      <h2 className="sr-only">Why patients are referred here</h2>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f) => (
          <Fact key={f.value} value={f.value} label={f.label} />
        ))}
      </div>
    </Section>
  );
}
