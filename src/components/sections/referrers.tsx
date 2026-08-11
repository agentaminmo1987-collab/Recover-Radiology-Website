import Link from "next/link";
import { clinic, referrerGuidance } from "@/lib/clinic";
import { Section, SectionLabel, ButtonLink } from "@/components/ui";

/**
 * For referrers. Given a distinct visual treatment (§6) so a GP scanning the
 * page recognises immediately that this part is addressed to them, not to a
 * patient. The inversion is done with tokens, not hard-coded colour, so it
 * still flips correctly between modes.
 *
 * Voice shifts here: peer to peer, clinical shorthand is fine.
 */
export function Referrers() {
  return (
    <Section id="referrers">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-strong)] p-8 md:p-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div>
            <SectionLabel>For referrers</SectionLabel>
            <h2 className="mt-4 text-balance text-[clamp(1.8rem,4vw,2.7rem)] font-semibold leading-[1.12] tracking-[-0.02em]">
              Detailed referrals get better images
            </h2>
            <p className="mt-6 max-w-[54ch] text-pretty leading-[1.6] text-fg-muted">
              Clinical information directs protocol selection. Symptoms, a
              provisional diagnosis and the specific question you need answered
              let the radiologist tailor the study rather than run a default.
            </p>
            <p className="mt-4 max-w-[54ch] text-pretty leading-[1.6] text-fg-muted">
              Next day and same day access is available for many studies, with
              rapid report turnaround.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={clinic.referrerPortal}
                target="_blank"
                rel="noopener noreferrer"
              >
                Request images online
              </ButtonLink>
              <ButtonLink href="/referrers" variant="ghost">
                Referrer information
              </ButtonLink>
            </div>
          </div>

          <div>
            <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
              Include on the referral
            </h3>
            <ul className="mt-6 space-y-4">
              {referrerGuidance.map((item, i) => (
                <li key={item} className="flex gap-4">
                  <span className="tabular pt-1 text-[0.8rem] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1.05rem] leading-[1.5] text-fg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 border-t border-[var(--card-border)] pt-6 text-[0.95rem] leading-[1.55] text-fg-subtle">
              Questions about protocol selection? Call the practice on{" "}
              <a
                href={clinic.phone.href}
                className="tabular font-medium text-accent hover:underline"
              >
                {clinic.phone.display}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
