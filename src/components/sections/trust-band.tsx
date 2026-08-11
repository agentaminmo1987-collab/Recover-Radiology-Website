import { REPORT_TURNAROUND, clinic } from "@/lib/clinic";

/**
 * Trust band. Every item here is substantiable from the verified fact set.
 *
 * This is where a normal service site would put testimonials or a review
 * carousel. AHPRA section 133 prohibits that for a regulated health service,
 * so the band carries measured fact instead. See DESIGN-DECISIONS.md.
 *
 * SEPARATION WITHOUT FILL. The section has no opaque background, so the
 * reconstruction stays visible through it. It reads as its own band through
 * structure instead: hairline rules top and bottom, vertical dividers between
 * the columns, a tighter vertical rhythm than its neighbours, and the mono face
 * on the values. The result is a readout strip across the page, which is the
 * same instrument language the rest of the site speaks.
 *
 * Legibility over the canvas is handled by a light scrim plus a backdrop blur
 * rather than a solid fill, so the cloud still moves behind the text.
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
    label: "X-ray during business hours, usually same day. No appointment needed.",
  },
  {
    value: clinic.serviceArea,
    label: `${clinic.address.line1}, ${clinic.address.suburb}.`,
  },
];

export function TrustBand() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="relative border-y border-[var(--card-border)]"
    >
      {/* Scrim only, no fill. Enough to hold contrast, light enough that the
          reconstruction reads through it. */}
      <div
        aria-hidden
        className="absolute inset-0 backdrop-blur-[3px]"
        style={{
          background:
            "color-mix(in srgb, var(--surface) 46%, transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1180px] px-6 py-[--rr-space-lg] md:px-10">
        <h2 id="trust-heading" className="sr-only">
          Why patients are referred here
        </h2>

        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <div
              key={f.value}
              className={[
                "py-6 sm:py-4",
                // Column rules, not boxes. Suppressed on the first item of each
                // row so the grid never opens with a stray edge.
                "lg:border-l lg:border-[var(--card-border)] lg:px-8",
                i === 0 ? "lg:border-l-0 lg:pl-0" : "",
                "sm:[&:nth-child(odd)]:border-l-0 sm:[&:nth-child(odd)]:pl-0",
                "sm:border-l sm:border-[var(--card-border)] sm:px-6",
                "border-b border-[var(--card-border)] last:border-b-0 sm:border-b-0",
              ].join(" ")}
            >
              <dt className="tabular text-[1.35rem] font-medium leading-[1.15] text-accent md:text-[1.5rem]">
                {f.value}
              </dt>
              <dd className="mt-2.5 max-w-[34ch] text-[0.92rem] leading-[1.5] text-fg-muted">
                {f.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
