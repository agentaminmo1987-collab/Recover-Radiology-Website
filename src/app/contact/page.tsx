import type { Metadata } from "next";
import { clinic } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel, Card } from "@/components/ui";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "Contact and location",
  description: `Book a scan at ${clinic.name}, ${clinic.address.full}. Call ${clinic.phone.display}, ${clinic.hours.display}. X-ray walk-ins accepted during business hours.`,
  alternates: { canonical: "/contact" },
};

// The practice's own Google Business Profile, not a pin at coordinates.
// Single source in clinic.ts so the two call sites cannot drift apart.
const mapHref = clinic.mapsUrl;

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[--rr-space-xl]">
          <SectionLabel>Contact</SectionLabel>
          <h1 className="mt-4 max-w-[16ch] text-balance text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Book a scan
          </h1>
          <p className="mt-6 max-w-[54ch] text-pretty text-[1.15rem] leading-[1.5] text-fg-muted">
            Calling is the fastest way to book. Use the form if it suits you
            better and our clerical team will come back to you.
          </p>

          <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
            <div>
              <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                Send an enquiry
              </h2>
              <div className="mt-8">
                <EnquiryForm />
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                  Call us
                </h2>
                <p className="mt-4">
                  <a
                    href={clinic.phone.href}
                    className="tabular text-[1.6rem] font-semibold text-accent hover:underline"
                  >
                    {clinic.phone.display}
                  </a>
                </p>
                <p className="tabular mt-3 text-[0.97rem] text-fg-muted">
                  {clinic.hours.display}
                </p>
                <p className="tabular mt-1 text-[0.92rem] text-fg-subtle">
                  Fax {clinic.fax.display}
                </p>
              </Card>

              <Card>
                <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                  Find us
                </h2>
                <address className="mt-4 not-italic">
                  <p className="text-[1.1rem] font-medium leading-[1.45] text-fg">
                    {clinic.address.line1}
                    <br />
                    {clinic.address.suburb} {clinic.address.state}{" "}
                    {clinic.address.postcode}
                  </p>
                </address>
                <p className="mt-4 text-[0.97rem] leading-[1.55] text-fg-muted">
                  Serving {clinic.serviceArea}.
                </p>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent hover:underline"
                >
                  Open in Maps <span aria-hidden>&rarr;</span>
                </a>
              </Card>

              <Card>
                <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                  X-ray without an appointment
                </h2>
                <p className="mt-4 text-pretty leading-[1.55] text-fg-muted">
                  Booking gives you the shortest wait, but we do accept X-ray
                  walk-ins during business hours, usually same day. Bring your
                  referral.
                </p>
              </Card>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
