import type { ReactNode } from "react";

/**
 * A sticky-pane section, for the referrer page.
 *
 * The left pane pins while the right column scrolls past it. This is the one
 * layout that suits a page being used as a talking document: the point stays on
 * screen while the evidence for it moves, so a GP glancing at a laptop across a
 * desk always has the heading in view.
 *
 * CSS `position: sticky` only. No scroll listener, no JavaScript, nothing to
 * jank. It degrades to a normal two-column layout wherever sticky is
 * unsupported, and collapses to stacked blocks on mobile where pinning a pane
 * on a 390px screen would just eat the viewport.
 *
 * `top` clears the sticky site header, which is 76px on mobile and 84px from
 * the md breakpoint.
 */
export function StickySection({
  label,
  title,
  lede,
  aside,
  children,
  tone,
}: {
  label: string;
  title: string;
  lede?: string;
  /** Optional extra under the lede, inside the pinned pane. */
  aside?: ReactNode;
  children: ReactNode;
  tone?: "raised" | "sunken";
}) {
  const bg =
    tone === "raised"
      ? "bg-[var(--band-raised)]"
      : tone === "sunken"
        ? "bg-[var(--band-sunken)]"
        : "";

  return (
    <section
      className={`relative border-t border-[var(--card-border)] ${bg}`}
      aria-label={title}
    >
      {/* Generous vertical rhythm, deliberately more than the rest of the site.
          Each of these is a section of a talk rather than a paragraph of a
          page, and the pause between them is what lets whoever is presenting
          land one point before the next arrives. The sticky pane also needs
          room to travel: too tight and it unpins almost as soon as it pins,
          which reads as a glitch rather than as a device. */}
      {/* py-[var(--x)], NOT py-[var(--x)]. The bare form generates no CSS at all in
          Tailwind v4 and fails silently, which is recorded in
          DESIGN-DECISIONS.md and which I reintroduced here by hand: these
          sections shipped with zero vertical padding and it took measuring the
          computed style to notice, because the content still had its own
          margins and the page looked plausible. */}
      <div className="mx-auto w-full max-w-[1180px] px-6 py-[var(--rr-space-2xl)] md:px-10 md:py-[var(--rr-space-3xl)]">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* The pinned pane. `self-start` is required: a grid item stretches
              to the row height by default, and a full-height item has nothing
              to stick within. */}
          <div className="lg:sticky lg:top-[104px] lg:self-start">
            <p className="text-[0.78rem] font-semibold tracking-[0.01em] text-accent">
              {label}
            </p>
            <h2 className="mt-4 max-w-[18ch] text-balance text-[clamp(1.8rem,3.8vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
              {title}
            </h2>
            {lede ? (
              <p className="mt-5 max-w-[42ch] text-pretty leading-[1.65] text-fg-muted">
                {lede}
              </p>
            ) : null}
            {aside ? <div className="mt-8">{aside}</div> : null}
          </div>

          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
