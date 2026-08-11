"use client";

import { useEffect, useRef } from "react";
import { clinic } from "@/lib/clinic";

/**
 * The mark, animated on scroll.
 *
 * The logo is two letter "r" forms that interlock, and the guide describes the
 * white space between them as the path: "The connection of the circles as well
 * as the white space between the two shapes represents the path/journey."
 *
 * So the two forms draw apart as the page scrolls and close back together at
 * the top. Scrolling literally opens the journey. It is the mark's own idea
 * rather than motion applied to it, which is also why it is allowed: the guide
 * sanctions breaking the shape into parts for brand extensions.
 *
 * Transform and opacity only, written straight to the nodes from one rAF loop,
 * so scrolling never triggers a React render. Under prefers-reduced-motion the
 * halves simply stay closed and nothing moves.
 */
export function ScrollLogo() {
  const wrap = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last = -1;

    const tick = () => {
      // Opens across the first viewport of scroll, so the whole move is visible
      // before the hero has left the screen.
      const t = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)));

      if (Math.abs(t - last) > 0.001) {
        last = t;
        // Ease out: most of the separation happens early, where the eye is.
        const e = 1 - Math.pow(1 - t, 2.4);
        const gap = e * 16; // percent of the mark's own width, each way

        if (left.current) {
          left.current.style.transform = `translate3d(${-gap}%, ${e * -3}%, 0) rotate(${-e * 3}deg)`;
        }
        if (right.current) {
          right.current.style.transform = `translate3d(${gap}%, ${e * 3}%, 0) rotate(${e * 3}deg)`;
        }
        if (wrap.current) {
          // A whisper of scale so the pair settles rather than only sliding.
          wrap.current.style.transform = `scale(${1 - e * 0.06})`;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      role="img"
      aria-label={`${clinic.name} logo`}
      className="relative"
    >
      <div className="flex items-center gap-5 md:gap-7">
        <div
          ref={wrap}
          aria-hidden
          className="relative h-[128px] w-[114px] shrink-0 origin-center will-change-transform md:h-[168px] md:w-[150px]"
        >
          <div
            ref={left}
            className="brand-r brand-r-left absolute inset-0 will-change-transform"
          />
          <div
            ref={right}
            className="brand-r brand-r-right absolute inset-0 will-change-transform"
          />
        </div>
        {/* The wordmark completes the lockup. Static, because the animation
            belongs to the mark; letters pulling apart would just look broken. */}
        <div aria-hidden className="brand-word h-[52px] w-[200px] md:h-[68px] md:w-[262px]" />
      </div>
    </div>
  );
}
