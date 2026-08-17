import type { Metadata } from "next";
import Link from "next/link";
import { clinic, SAME_DAY } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel, Card } from "@/components/ui";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "Contact and location",
  description: `Book a scan at ${clinic.name}, ${clinic.address.line1}, ${clinic.address.suburb}. Call ${clinic.phone.display}. X-ray walk-ins during business hours.`,
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
        <Section className="pt-[var(--rr-space-xl)]">
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
              {/* Stated above the form rather than under it. Someone deciding
                  whether to attach a referral wants to know this before they
                  start, not after they have submitted. */}
              <p className="mt-3 max-w-[52ch] text-[0.95rem] leading-[1.6] text-fg-muted">
                You can attach your referral here. It is health information, so
                it is handled accordingly:{" "}
                <Link
                  href="/legal/privacy"
                  className="font-medium text-accent underline underline-offset-2"
                >
                  how we handle your information
                </Link>
                .
              </p>
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

                {/* The catchment, as real visible content rather than schema
                    only. Markup a crawler can see but a person cannot is a
                    liability: it drifts and nobody notices. This is also the
                    honest version of what the suburb names are for. */}
                <p className="mt-6 border-t border-[var(--card-border)] pt-5 text-pretty text-[0.92rem] leading-[1.6] text-fg-subtle">
                  Patients come to us from across {clinic.serviceArea}, including{" "}
                  {clinic.nearbySuburbs.slice(0, -1).join(", ")} and{" "}
                  {clinic.nearbySuburbs[clinic.nearbySuburbs.length - 1]}.
                </p>
              </Card>

              {/* Placed above the walk-in card deliberately. Someone who needs
                  to be seen today reads down until something says yes, and
                  before this the first "yes" was X-ray only, so anyone needing
                  an ultrasound or CT concluded they had to wait. */}
              <Card>
                <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                  Need to be seen today?
                </h2>
                <p className="mt-4 text-pretty leading-[1.55] text-fg-muted">
                  {SAME_DAY.long}
                </p>
                <p className="mt-5">
                  <a
                    href={clinic.phone.href}
                    className="tabular inline-flex min-h-[44px] items-center gap-2 text-[1.25rem] font-semibold text-accent hover:underline"
                  >
                    {clinic.phone.display}
                  </a>
                </p>
                <p className="tabular mt-1 text-[0.9rem] text-fg-subtle">
                  {clinic.hours.display}
                </p>
              </Card>

              {/* Asking for a review is permitted. Publishing reviews is not,
                  under AHPRA s133, which is why no rating appears anywhere on
                  this site. Volume and recency on the listing is also what
                  actually moves local rank; a widget here would move nothing. */}
              <Card>
                <h2 className="text-[0.8rem] font-semibold tracking-[0.01em] text-fg-subtle">
                  Been here before?
                </h2>
                <p className="mt-4 text-pretty leading-[1.55] text-fg-muted">
                  If we looked after you well, a review on Google helps other
                  people in {clinic.serviceArea} find us. It takes a minute.
                </p>
                <p className="mt-5">
                  <a
                    href={clinic.reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent hover:underline"
                  >
                    Leave a Google review <span aria-hidden>&rarr;</span>
                  </a>
                </p>
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
