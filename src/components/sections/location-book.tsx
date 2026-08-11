import { clinic } from "@/lib/clinic";
import { Section, SectionLabel, H2, ButtonLink, Card } from "@/components/ui";

/**
 * Location and booking, the last two sections of the scroll (§6 items 8 and 9).
 *
 * By this point in the 3D narrative the volume has fully resolved, so the
 * booking CTA sits in visual calm. Nothing here competes with it: no motion,
 * no secondary offers, one clear action plus the practical detail someone needs
 * to actually turn up.
 *
 * The map is a static link rather than an embedded iframe. An embed costs
 * roughly 900KB of third-party JS, sets cookies before consent, and would blow
 * the §4.5 budget for a feature most people use once.
 */
const mapHref = `https://www.google.com/maps/search/?api=1&query=${clinic.geo.lat},${clinic.geo.lng}`;

export function LocationBook() {
  return (
    <Section id="book" tone="sunken">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <SectionLabel>Book</SectionLabel>
          <H2 className="mt-4 max-w-[14ch]">Ready when you are</H2>
          <p className="mt-6 max-w-[48ch] text-pretty text-[1.1rem] leading-[1.55] text-fg-muted">
            Call to book ultrasound, CT or a procedure. For X-ray, walk in during
            business hours.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={clinic.phone.href} size="lg" className="tabular">
              {clinic.phone.display}
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="ghost">
              Send an enquiry
            </ButtonLink>
          </div>

          <p className="tabular mt-6 text-[0.95rem] text-fg-subtle">
            {clinic.hours.display}
          </p>
        </div>

        <Card>
          <h3 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
            Find us
          </h3>

          <address className="mt-6 not-italic">
            <p className="text-[1.15rem] font-medium leading-[1.45] text-fg">
              {clinic.address.line1}
              <br />
              {clinic.address.suburb} {clinic.address.state}{" "}
              {clinic.address.postcode}
            </p>
          </address>

          <dl className="mt-8 space-y-4 border-t border-[var(--card-border)] pt-6">
            <div className="flex justify-between gap-6">
              <dt className="text-[0.95rem] text-fg-subtle">Hours</dt>
              <dd className="tabular text-right text-[0.95rem] text-fg">
                {clinic.hours.display}
              </dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-[0.95rem] text-fg-subtle">Phone</dt>
              <dd className="tabular text-right text-[0.95rem]">
                <a href={clinic.phone.href} className="text-accent hover:underline">
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
            <div className="flex justify-between gap-6">
              <dt className="text-[0.95rem] text-fg-subtle">Serving</dt>
              <dd className="text-right text-[0.95rem] text-fg">
                {clinic.serviceArea}
              </dd>
            </div>
          </dl>

          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent hover:underline"
          >
            Open in Maps
            <span aria-hidden>&rarr;</span>
          </a>
        </Card>
      </div>
    </Section>
  );
}
