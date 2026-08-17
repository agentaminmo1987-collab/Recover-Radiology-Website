import Link from "next/link";
import { REPORT_TURNAROUND, SAME_DAY, clinic } from "@/lib/clinic";

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
 * EACH ITEM IS NOW A DESTINATION. Every claim here is answered in full
 * somewhere else on the site, and a visitor who reads "Bulk billed" and wants
 * the detail should not have to go and find it. The claim is the link.
 *
 * The highlight is scroll-linked, not time-based. See `.trust-item` in
 * globals.css for why that distinction matters here.
 */
const facts = [
  {
    value: "Bulk billed",
    href: "/billing",
    label:
      "Most services, billed directly to Medicare with no gap fee. Obstetric and some interventional are the exceptions.",
    more: "What is covered",
  },
  {
    value: REPORT_TURNAROUND,
    href: "/ultrasound",
    label: "Ultrasound reports to your referring doctor.",
    more: "About ultrasound",
  },
  {
    // Was "Same day X-ray", which undersold it: same day applies across the
    // services, not just X-ray. The walk-in stays in the label because it is
    // the one case where you do not need to ring first.
    value: SAME_DAY.claim,
    href: "/contact",
    label:
      "Often available. Call to book one. X-ray also takes walk-ins during business hours.",
    more: "Call or enquire",
  },
  {
    value: clinic.serviceArea,
    href: "/contact",
    label: `${clinic.address.line1}, ${clinic.address.suburb}.`,
    more: "Find us",
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

      <div className="relative mx-auto w-full max-w-[1180px] px-6 py-[var(--rr-space-lg)] md:px-10">
        <h2 id="trust-heading" className="sr-only">
          Why patients are referred here
        </h2>

        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <div
              key={f.value}
              // --i drives the stagger. Each item's scroll range starts a
              // little later than the one before it, so the highlight travels
              // across the row as the band comes up the screen.
              style={{ "--i": i } as React.CSSProperties}
              className={[
                "trust-item group relative",
                // Column rules, not boxes. Suppressed on the first item of each
                // row so the grid never opens with a stray edge.
                "lg:border-l lg:border-[var(--card-border)]",
                i === 0 ? "lg:border-l-0" : "",
                "sm:[&:nth-child(odd)]:border-l-0",
                "sm:border-l sm:border-[var(--card-border)]",
                "border-b border-[var(--card-border)] last:border-b-0 sm:border-b-0",
              ].join(" ")}
            >
              <Link
                href={f.href}
                className={[
                  "block h-full py-6 transition-colors sm:px-6 sm:py-4 lg:px-8",
                  i === 0 ? "lg:pl-0" : "",
                  "sm:[&:nth-child(odd)]:pl-0",
                ].join(" ")}
              >
                <dt className="tabular trust-item__value text-[1.35rem] font-medium leading-[1.15] md:text-[1.5rem]">
                  {f.value}
                </dt>

                {/* The rule is the highlight. It wipes in from the left as the
                    item enters, then stays. */}
                <span aria-hidden className="trust-item__rule mt-2.5 block h-px w-full" />

                <dd className="mt-2.5 max-w-[34ch] text-[0.92rem] leading-[1.5] text-fg-muted">
                  {f.label}
                </dd>

                {/* Visible always on touch, hidden until hover on a mouse.
                    Gated on (hover: hover) because a touch device fires no
                    hover, so opacity-0-until-hover would simply never appear on
                    a phone and the links would read as plain text. Decorative
                    either way, so the accessible name carries it below. */}
                <span
                  aria-hidden
                  className="trust-item__more mt-3 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-accent"
                >
                  {f.more}
                  <span>&rarr;</span>
                </span>
                <span className="sr-only">. {f.more}</span>
              </Link>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
