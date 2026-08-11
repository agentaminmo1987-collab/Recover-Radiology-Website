import type { Metadata } from "next";
import { clinic } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${clinic.name} handles personal information collected through this website.`,
  alternates: { canonical: "/legal/privacy" },
};

/**
 * Website privacy notice.
 *
 * Scoped deliberately to THIS WEBSITE, not to the practice's handling of health
 * records. The enquiry form collects personal information, so a notice is
 * required. But clinical privacy sits under the Privacy Act and the Australian
 * Privacy Principles, and that policy has to come from the practice rather than
 * be drafted here. Writing one would be inventing a legal position on their
 * behalf. See QUESTIONS.md.
 */
export default function PrivacyPage() {
  const sections = [
    {
      h: "What we collect here",
      p: "If you send an enquiry through this website we collect your name, phone number, and your email address and message if you provide them. That is all the form asks for and all it stores.",
    },
    {
      h: "What we do with it",
      p: "We use these details only to respond to your enquiry. We do not sell them, and we do not share them with anyone outside the practice except where the law requires it.",
    },
    {
      h: "Analytics",
      p: "We measure page performance and aggregate visit counts. We do not use advertising trackers, we do not build profiles of visitors, and enquiry form contents are never sent to analytics.",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[--rr-space-xl]">
          <SectionLabel>Legal</SectionLabel>
          <h1 className="mt-4 max-w-[20ch] text-balance text-[clamp(2.2rem,5.4vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
            Privacy on this website
          </h1>

          <div className="mt-10 max-w-[68ch] space-y-8">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-[1.2rem] font-semibold">{s.h}</h2>
                <p className="mt-3 leading-[1.7] text-fg-muted">{s.p}</p>
              </div>
            ))}

            <div>
              <h2 className="text-[1.2rem] font-semibold">
                Please do not send clinical information
              </h2>
              <p className="mt-3 leading-[1.7] text-fg-muted">
                The enquiry form is not a secure channel for medical history or
                results, and it says so at the point of entry. For anything
                clinical, call us on{" "}
                <a
                  href={clinic.phone.href}
                  className="tabular font-medium text-accent hover:underline"
                >
                  {clinic.phone.display}
                </a>{" "}
                or speak to your referring doctor.
              </p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-semibold">Your health records</h2>
              <p className="mt-3 leading-[1.7] text-fg-muted">
                Your images, reports and health information are handled under the
                practice&rsquo;s clinical privacy obligations, which are separate
                from this website and governed by the Privacy Act 1988 and the
                Australian Privacy Principles. Ask at reception or call the
                practice for that policy.
              </p>
              {/* TODO(amin): link the practice's clinical privacy policy here
                  once supplied. QUESTIONS.md. */}
            </div>

            <div>
              <h2 className="text-[1.2rem] font-semibold">Contact us</h2>
              <address className="mt-3 not-italic leading-[1.7] text-fg-muted">
                {clinic.name}
                <br />
                {clinic.address.full}
                <br />
                <a
                  href={clinic.phone.href}
                  className="tabular font-medium text-accent hover:underline"
                >
                  {clinic.phone.display}
                </a>
              </address>
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
      <BookingBar />
    </>
  );
}
