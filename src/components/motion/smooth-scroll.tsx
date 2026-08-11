"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scroll, deliberately constrained.
 *
 * Three constraints, all of which matter for this audience:
 *
 * 1. Wheel only. Touch scrolling is left completely native (`syncTouch: false`,
 *    which is the Lenis default and is kept explicitly so nobody "fixes" it).
 *    Hijacking touch momentum on a phone is the single most common way smooth
 *    scroll makes a site feel broken, and most of these visitors are on a phone.
 *
 * 2. Off entirely under `prefers-reduced-motion`. Smoothed scrolling is
 *    continuous vestibular motion the user did not ask for. This listens for
 *    changes rather than reading the value once, so toggling the OS setting
 *    takes effect without a reload.
 *
 * 3. Loaded after paint and code split, so it never delays LCP.
 *
 * If Lenis fails to load for any reason the page keeps native scrolling. There
 * is no functional dependency on it.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let frame = 0;
    let cancelled = false;

    async function start() {
      if (query.matches || lenis) return;
      try {
        const { default: Lenis } = await import("lenis");
        if (cancelled || query.matches) return;
        lenis = new Lenis({
          // ~0.9s to settle. Long enough to read as eased, short enough that
          // the page never feels like it is still moving after you stopped.
          duration: 0.9,
          // Strong ease-out. Motion is fastest at the start, where the user is
          // looking, and never eases in.
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          smoothWheel: true,
          syncTouch: false,
        });
        const raf = (time: number) => {
          lenis?.raf(time);
          frame = requestAnimationFrame(raf);
        };
        frame = requestAnimationFrame(raf);
      } catch {
        // Native scrolling is the fallback and needs no handling.
      }
    }

    function stop() {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = null;
    }

    function onPreferenceChange() {
      if (query.matches) stop();
      else void start();
    }

    void start();
    query.addEventListener("change", onPreferenceChange);

    return () => {
      cancelled = true;
      query.removeEventListener("change", onPreferenceChange);
      stop();
    };
  }, []);

  return null;
}
