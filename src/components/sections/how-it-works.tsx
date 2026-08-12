import { REPORT_TURNAROUND } from "@/lib/clinic";
import { Section, SectionLabel, H2 } from "@/components/ui";

/**
 * Four steps, referral to report. Reduces uncertainty for a first-time patient,
 * which is the whole job of this section. Rendered as an ordered list so the
 * sequence survives screen readers and a JS-off render.
 */
const steps = [
  {
    n: "01",
    title: "Get a referral",
    body: "Your GP or specialist writes a referral for the scan they need. Bring it with you, or ask them to send it ahead.",
  },
  {
    n: "02",
    title: "Book your scan",
    body: "Call us to book. Booking is quickest for everyone, including X-ray, though we do accept X-ray walk-ins during business hours.",
  },
  {
    n: "03",
    title: "Come in for your scan",
    body: "Follow any preparation on your service page. Most ultrasound appointments are finished inside 30 minutes.",
  },
  {
    n: "04",
    title: "Your doctor gets the report",
    body: `A radiologist reports your images and sends the result to your referring doctor, within ${REPORT_TURNAROUND} for ultrasound. Discuss your results with them.`,
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" tone="sunken">
      <SectionLabel>How it works</SectionLabel>
      <H2 className="mt-4 max-w-[16ch]">From referral to result</H2>

      <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {steps.map((s) => (
          <li key={s.n} className="relative">
            <span
              aria-hidden
              className="tabular block text-[0.8rem] font-medium tracking-[0.14em] text-accent"
            >
              {s.n}
            </span>
            <span className="mt-4 block h-px w-full bg-[var(--card-border)]" aria-hidden />
            <h3 className="mt-5 text-[1.2rem] font-semibold tracking-[-0.01em]">
              {s.title}
            </h3>
            <p className="mt-3 text-pretty text-[0.99rem] leading-[1.6] text-fg-muted">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
