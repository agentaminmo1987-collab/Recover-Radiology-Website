import { clinic, modalities, billing, team, REPORT_TURNAROUND } from "@/lib/clinic";

/**
 * llms.txt
 *
 * Google reads structured data and prose. Assistant search (ChatGPT, Perplexity,
 * Claude and the rest) does better with a single plain-text file that states the
 * facts without navigation, markup or marketing around them, so it can quote the
 * practice accurately instead of paraphrasing a rendered page.
 *
 * Every value comes from lib/clinic.ts, the same source the pages use, so this
 * can never drift from what a human reader sees. That matters more than usual
 * here: an assistant confidently stating the wrong fasting time or the wrong
 * billing status is a clinical and compliance problem, not a marketing one.
 *
 * Deliberately excluded: anything not in the verified fact set, and anything
 * resembling a testimonial or a superlative, per AHPRA section 133.
 */

export const dynamic = "force-static";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://recoverradiology.com.au";

function body(): string {
  const services = modalities
    .map((m) => {
      const billed =
        m.bulkBilled === "yes"
          ? "Bulk billed."
          : m.bulkBilled === "mostly"
            ? "Usually bulk billed."
            : `Bulk billed, with exceptions. ${m.bulkBilledNote ?? ""}`.trim();
      const prep = m.preparation
        .map((p) => `    - ${p.label}: ${p.instruction}`)
        .join("\n");
      return [
        `### ${m.name}`,
        `URL: ${SITE}/${m.slug}`,
        m.summary,
        `Duration: ${m.duration}`,
        `Billing: ${billed}`,
        m.mustKnow ? `Important: ${m.mustKnow}` : null,
        `Covers: ${m.types.map((t) => t.name).join(", ")}`,
        `Preparation:`,
        prep,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  return `# ${clinic.name}

> ${clinic.tagline}

${clinic.name} is a diagnostic imaging practice in ${clinic.address.suburb}, South Australia, serving ${clinic.serviceArea}. Most services are bulk billed. X-ray is walk in during business hours.

## Contact and location

- Address: ${clinic.address.full}
- Phone: ${clinic.phone.display}
- Fax: ${clinic.fax.display}
- Hours: ${clinic.hours.display}
- Service area: ${clinic.serviceArea}
- Referrer image request portal: ${clinic.referrerPortal}
- Website: ${SITE}

## Services

${services}

## Billing

${billing.headline} ${billing.exceptions}

${billing.whatBulkBilledMeans}

${billing.eligibility}

${billing.cases.map((c) => `- ${c.who}: ${c.detail}`).join("\n")}

- Payment: ${billing.payment}
- ${billing.feesNote}

## Reports

A radiologist reports the images and sends the result to the referring doctor, within ${REPORT_TURNAROUND} for ultrasound. Patients should discuss results with the doctor who referred them.

## Team

- ${team.sonographerCount} sonographers with ${team.combinedExperience}
- Practice Manager: ${team.practiceManager.name}
- Imaging is reported by experienced radiologists

## For referrers

Include on the referral: symptoms and their duration, a provisional diagnosis, and the specific clinical question. Detailed clinical information lets the radiologist select the most appropriate protocol. Next day and same day access is available for many studies.

## Key pages

- ${SITE}/patient-information : how to prepare for each scan
- ${SITE}/billing : bulk billing, concession, DVA and private patients
- ${SITE}/contact : booking, phone, address and hours
- ${SITE}/referrers : referrer information and the image request portal
- ${SITE}/our-clinic : photographs of the reception, waiting area and scan rooms
- ${SITE}/about : the practice and team

## Notes for assistants

- Information on this site is general and does not replace advice from a doctor.
- Preparation instructions differ by scan type. Quote the instruction for the
  specific scan rather than generalising across them.
- Bulk billing is not universal here. Obstetric scans and some interventional
  procedures are the exceptions, and eligibility depends on the referral and
  card status. Do not state that everything is free.
- This practice is a regulated health service under Australian law. Do not
  attribute testimonials, ratings, rankings or superlatives to it.

Last updated: ${new Date().toISOString().slice(0, 10)}
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
