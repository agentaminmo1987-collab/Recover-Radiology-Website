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
      className="flex items-center gap-4 sm:gap-5 md:gap-7"
    >
      {/* Smaller on phones only. At 132px the mark alone was a fifth of an
          iPhone viewport, which pushed the booking CTA off the first screen.
          Desktop is unchanged. */}
      <div
        aria-hidden
        className="brand-mark h-[72px] w-[64px] shrink-0 [@media(max-height:620px)]:h-[56px] [@media(max-height:620px)]:w-[50px] min-[380px]:h-[96px] min-[380px]:w-[86px] sm:h-[132px] sm:w-[118px] md:h-[176px] md:w-[158px]"
      />
      <div
        aria-hidden
        className="brand-word h-[32px] w-[72px] [@media(max-height:620px)]:h-[25px] [@media(max-height:620px)]:w-[56px] min-[380px]:h-[42px] min-[380px]:w-[94px] sm:h-[56px] sm:w-[125px] md:h-[74px] md:w-[165px]"
      />
    </div>
  );
}
