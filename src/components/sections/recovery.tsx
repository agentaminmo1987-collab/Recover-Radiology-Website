import Link from "next/link";
import { RECOVERY, MSK, team } from "@/lib/clinic";
import { Section, SectionLabel, ButtonLink } from "@/components/ui";

/**
 * The recovery section, on the home page.
 *
 * WHY IT IS HERE. The practice is called Recover and the tagline is about
 * recovery, but a visitor could read the entire home page and never learn that
 * injury and pain is most of what the clinic does. The name was decorative.
 *
 * It sits directly after the four services, which is the right moment: the
 * reader has just seen what equipment exists, and this answers "so which of
 * those is for me". It does not repeat the service cards; it reframes them
 * around a problem.
 *
 * Deliberately quiet in register. The audience is someone whose back has hurt
 * for six months, not someone shopping for a premium experience, and the
 * competitor already owns the "excellence" adjectives. Facts and plain language
 * do more work here, and AHPRA section 133 rules out the alternative anyway.
 */
export function Recovery() {
  return (
    <Section id="recovery" tone="sunken" className="border-y border-[var(--card-border)]">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <SectionLabel>Injury and pain</SectionLabel>
          <h2 className="mt-4 max-w-[16ch] text-balance text-[clamp(1.8rem,3.8vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
            We are called Recover for a reason
          </h2>
          <p className="mt-6 max-w-[46ch] text-pretty leading-[1.65] text-fg-muted">
            Most of what we do is finding out why something hurts, and then
            helping to settle it. Work injuries, sporting injuries, and pain that
            has been there long enough that you have stopped mentioning it.
          </p>
          <p className="mt-4 max-w-[46ch] text-pretty leading-[1.65] text-fg-muted">
            {MSK.short} We also perform image guided injections on site, so
            finding the problem and treating it do not need two referrals.
            Between our {team.sonographerCount} sonographers there is{" "}
            {team.combinedExperience.toLowerCase()}.
          </p>
          <div className="mt-8">
            <ButtonLink href="/injury-and-pain" size="lg">
              Injury and pain imaging
            </ButtonLink>
          </div>
        </div>

        {/* The four reasons, as a plain list rather than cards. The section
            beside it is already card-heavy, and a list reads faster when every
            item is a sentence about the reader. */}
        {/* rr-clip-lg, never overflow-hidden. overflow-hidden makes this a
            scroll container, which freezes the view() timelines on the
            highlight rules inside it. Caught by the guard test, having been
            copied straight from the services grid before that grid was fixed. */}
        <ul className="rr-clip-lg grid gap-px rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-border)] sm:grid-cols-2">
          {RECOVERY.reasons.map((r, i) => (
            <li
              key={r.title}
              style={{ "--i": i, "--hl-to": "var(--fg)" } as React.CSSProperties}
              className="bg-[var(--card-bg)] p-6"
            >
              <h3 className="rr-hl__title text-[1.05rem] font-semibold tracking-[-0.01em]">
                {r.title}
              </h3>
              <span aria-hidden className="rr-hl__rule mt-3 block h-px w-full" />
              <p className="mt-3 text-pretty text-[0.92rem] leading-[1.55] text-fg-muted">
                {r.body}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 text-[0.97rem] text-fg-subtle">
        Hurt at work or in a car accident?{" "}
        <Link href="/injury-and-pain" className="text-accent hover:underline">
          We bill ReturnToWorkSA and motor vehicle claims directly
        </Link>
        .
      </p>
    </Section>
  );
}
