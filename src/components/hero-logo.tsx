import { clinic } from "@/lib/clinic";

/**
 * The hero lockup: the mark and the wordmark, static.
 *
 * This previously drew the two "r" forms apart on scroll. The idea came from
 * the style guide, where the white space between the shapes represents the
 * journey, and it worked when the hero carried the mark on its own. Adding the
 * wordmark changed the composition: a mark pulling itself apart beside a
 * perfectly still wordmark read as the logo breaking rather than as motion.
 *
 * Removed rather than tuned. The scroll already has the video behind it doing
 * the work, and the logo is the one thing on the page that should never look
 * like it is coming apart.
 *
 * Server component now, with no client JavaScript at all.
 */
export function HeroLogo() {
  return (
    <div
      role="img"
      aria-label={`${clinic.name} logo`}
      className="flex items-center gap-5 md:gap-7"
    >
      <div
        aria-hidden
        className="brand-mark h-[132px] w-[118px] shrink-0 md:h-[176px] md:w-[158px]"
      />
      <div aria-hidden className="brand-word h-[56px] w-[125px] md:h-[74px] md:w-[165px]" />
    </div>
  );
}
