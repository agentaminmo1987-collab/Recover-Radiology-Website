"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero background video.
 *
 * Replaces the shader field. A rendered loop of the scan forming carries the
 * idea better than anything generated live, and it costs no GPU work beyond
 * decode.
 *
 * Loaded defensively, because a 6.5MB video must never be in the way of the
 * page:
 *   - the poster image renders immediately and is what LCP actually measures
 *   - the video only starts loading after first paint
 *   - it never loads under prefers-reduced-motion, on Data Saver, or on a slow
 *     connection; in those cases the poster simply stays, which is a designed
 *     frame rather than a gap
 *   - it pauses when scrolled out of view, so it is not decoding frames nobody
 *     is looking at
 */
export function HeroVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };

    const decide = () => {
      if (reduce.matches) return setAllowed(false);
      if (nav.connection?.saveData) return setAllowed(false);
      if (/2g/.test(nav.connection?.effectiveType ?? "")) return setAllowed(false);
      setAllowed(true);
    };

    // After first paint, so the poster wins LCP rather than the video.
    const ric = (
      window as Window & { requestIdleCallback?: (cb: () => void, o?: object) => number }
    ).requestIdleCallback;
    const id = ric ? ric(decide, { timeout: 2000 }) : window.setTimeout(decide, 900);

    reduce.addEventListener("change", decide);
    return () => {
      reduce.removeEventListener("change", decide);
      if (!ric) window.clearTimeout(id);
    };
  }, []);

  // Stop decoding once it is off screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [allowed]);

  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* The poster is a real image, so there is never an empty frame. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      />
      {allowed ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
          onCanPlay={(e) => void e.currentTarget.play().catch(() => {})}
        />
      ) : null}
    </div>
  );
}
