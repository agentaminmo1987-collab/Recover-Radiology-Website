"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

/**
 * The single scroll value the whole 3D sequence runs on.
 *
 * §5 is explicit that there is one persistent canvas driven by one normalised
 * progress value, not a canvas per section. This is that value, plus which
 * modality slice the viewport is currently over, so the canvas knows which
 * treatment to run without any section owning its own animation.
 *
 * Deliberately NOT a general purpose scroll-animation system. There is exactly
 * one consumer: the reconstruction canvas. Anything else that wants to move on
 * scroll has to justify itself against the one-animation rule in
 * DESIGN-DECISIONS.md, and so far nothing has.
 */

export type Slice = "ultrasound" | "ct" | "x-ray" | "interventional" | null;

interface ScrollStage {
  /** 0 at the top of the document, 1 at the bottom. Damped. */
  progress: number;
  /** Which service section the viewport is centred on, if any. */
  slice: Slice;
  /** False when the user has asked for reduced motion, or before hydration. */
  active: boolean;
}

const Ctx = createContext<ScrollStage>({
  progress: 0,
  slice: null,
  active: false,
});

export const useScrollStage = () => useContext(Ctx);

export function ScrollStageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ScrollStage>({
    progress: 0,
    slice: null,
    active: false,
  });

  // Written by rAF, read by rAF. Kept out of state so scrolling never triggers
  // a React render; the canvas samples this directly.
  const target = useRef(0);
  const damped = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) {
      setState({ progress: 0, slice: null, active: false });
      return;
    }

    let frame = 0;
    let lastSlice: Slice = null;
    let lastPublished = -1;

    const sections = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-slice]"),
      );

    const read = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      target.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const tick = () => {
      // Critically damped follow. The canvas must never feel like it is
      // fighting the user's finger, so the value trails scroll rather than
      // tracking it exactly.
      damped.current += (target.current - damped.current) * 0.09;

      const mid = window.innerHeight / 2;
      let current: Slice = null;
      for (const el of sections()) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          current = (el.dataset.slice as Slice) ?? null;
          break;
        }
      }

      // Publish coarsely. The canvas reads the ref every frame; React only
      // needs to know when something meaningful changed.
      const rounded = Math.round(damped.current * 100) / 100;
      if (rounded !== lastPublished || current !== lastSlice) {
        lastPublished = rounded;
        lastSlice = current;
        setState({ progress: rounded, slice: current, active: true });
      }

      frame = requestAnimationFrame(tick);
    };

    read();
    damped.current = target.current;
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}
