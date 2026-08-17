import type { Metadata } from "next";
import { clinic } from "@/lib/clinic";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingBar } from "@/components/booking-bar";
import { Section, SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${clinic.name} handles your information, including referrals you upload and how we use My Health Record.`,
  alternates: { canonical: "/legal/privacy" },
};

/**
 * Website privacy notice.
 *
 * REWRITTEN 2026-08-12, when referral upload shipped. Until then the form took
 * a name and a number and told people not to send anything clinical, and this
 * notice was scoped to match. A referral is health information under the
 * Privacy Act, so the site now solicits exactly what it used to refuse, and
 * every sentence that relied on the old scope had to go.
 *
 * Still deliberately scoped to THIS WEBSITE. The practice's clinical privacy
 * policy, covering images and reports, has to come from the practice rather
 * than be drafted here. Writing one would be inventing a legal position on
 * their behalf. See QUESTIONS.md.
 */
export default function PrivacyPage() {
  const sections = [
    {
      h: "What we collect here",
      p: "If you send an enquiry through this website we collect your name and phone number, plus your email address, preferred appointment time and message if you provide them. If you attach a referral, we collect that too.",
    },
    {
      h: "What we do with it",
      p: "We use these details, and any referral you attach, to contact you and to book and carry out your scan. We do not sell them. We do not share them with anyone outside the practice and your referring doctor, except where the law requires it.",
    },
    {
      h: "Analytics",
      p: "We measure page performance and aggregate visit counts. We do not use advertising trackers, we do not build profiles of visitors, and nothing you type or attach in the enquiry form is ever sent to analytics.",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-[88px] sm:pb-0">
        <Section className="pt-[var(--rr-space-xl)]">
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
                Referrals you upload
              </h2>
              <p className="mt-3 leading-[1.7] text-fg-muted">
                A referral is health information, so it is handled accordingly.
                It is sent over an encrypted connection, stored in private
                storage that is not reachable from this website, and given a
                random filename so nothing about it can be guessed from a link.
                Only practice staff can open it. Attaching a referral is
                optional, and you are welcome to bring it with you instead.
              </p>
              <p className="mt-3 leading-[1.7] text-fg-muted">
                Please attach the referral itself rather than typing your medical
                history into the message box. The referral tells us what we need.
              </p>
            </div>

            <div>
              <h2 className="text-[1.2rem] font-semibold">
                How long we keep it
              </h2>
              <p className="mt-3 leading-[1.7] text-fg-muted">
                Once your referral has been added to your patient record it is
                held under the practice&rsquo;s clinical record obligations,
                described below, and the copy uploaded through this website is no
                longer needed. Enquiries that do not lead to an appointment are
                not kept indefinitely.
              </p>
              {/* TODO(amin): state the actual retention period in days once the
                  practice confirms it. Deliberately not numbered here: a
                  specific figure would be a commitment invented on their
                  behalf. QUESTIONS.md. */}
            </div>

            <div>
              <h2 className="text-[1.2rem] font-semibold">
                What not to send
              </h2>
              <p className="mt-3 leading-[1.7] text-fg-muted">
                The form is for booking. It is not monitored outside business
                hours and it is not a way to discuss results or get clinical
                advice. For anything urgent, or for anything about a result, call
                us on{" "}
                <a
                  href={clinic.phone.href}
                  className="tabular font-medium text-accent hover:underline"
                >
                  {clinic.phone.display}
                </a>{" "}
                or speak to your referring doctor.
              </p>
            </div>

            {/* MY HEALTH RECORD.
                The most important addition this page has had. Two-way: reports
                go up, and the practice reads what is already there.

                Written pre-emptively because of the notification point. A
                patient with alerts enabled will get a message saying this
                practice opened their record, possibly before they have even had
                the scan. Explaining that in advance turns an alarming
                notification into an expected one, and there is no way to explain
                it afterwards that lands as well. */}
            <div>
              <h2 className="text-[1.2rem] font-semibold">
                My Health Record
              </h2>
              <p className="mt-3 leading-[1.7] text-fg-muted">
                When we validate your Medicare details, we become connected to
                your My Health Record. That connection works in both directions,
                and it is worth knowing what it means before your scan rather
                than afterwards.
              </p>

              <h3 className="mt-6 text-[1rem] font-semibold text-fg">
                What we send
              </h3>
              <p className="mt-2 leading-[1.7] text-fg-muted">
                We upload information to your My Health Record, which includes
                your diagnostic imaging reports. This is the national default for
                imaging reports, and it means your report is available to any
                treating practitioner you see later, not only the doctor who
                referred you.
              </p>

              <h3 className="mt-6 text-[1rem] font-semibold text-fg">
                What we look at, and why
              </h3>
              <p className="mt-2 leading-[1.7] text-fg-muted">
                We may also read your My Health Record. Two things in particular:
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Previous imaging reports, so the radiologist can compare against an earlier scan. Comparison is often the difference between a finding that means something and one that has been stable for years.",
                  "Pathology results, where they affect the scan. Kidney function before a CT with contrast is the common example.",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[0.65em] h-[6px] w-[6px] shrink-0 rounded-full bg-accent"
                    />
                    <span className="leading-[1.65] text-fg-muted">{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 leading-[1.7] text-fg-muted">
                Access is governed by our internal My Health Record policy, and
                only for purposes connected to your care.
              </p>

              <p className="mt-6 rounded-[var(--radius-md)] border-l-4 border-accent bg-surface-sunken p-5 leading-[1.65] text-fg">
                <span className="font-semibold">
                  If you have notifications turned on
                </span>{" "}
                you may receive an alert saying we have accessed your record,
                sometimes before your appointment. That is expected, and it is
                us preparing for your scan rather than anything being wrong.
              </p>

              <h3 className="mt-6 text-[1rem] font-semibold text-fg">
                If you would rather we did not
              </h3>
              <p className="mt-2 leading-[1.7] text-fg-muted">
                You can ask us not to upload a particular report to your My
                Health Record, and we will honour that. Tell reception when you
                book or when you arrive, and it is easiest to raise before the
                scan rather than after the report is written. You can also
                control access to your record yourself through myGov.
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
