"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";


/**
 * Gate and mount for the reconstruction canvas.
 *
 * The 3D bundle is never in the critical path. It is dynamically imported, only
 * after the gate passes, and only after first paint. Everything below is a
 * reason NOT to load it, which is the point: a beautiful canvas that costs a
 * mid-tier Android its first two seconds is a failed brief (§4.5).
 *
 * When the gate fails, the static plate already rendered by the hero stays.
 * That is the designed fallback, not a blank space.
 */

const WaveField = dynamic(() => import("./wave-field"), {
  ssr: false,
  loading: () => null,
});

type Tier = 0 | 1 | 2 | 3;

/**
 * Device tier.
 *
 * Deliberately conservative. Every signal here is a proxy, so when they
 * disagree the lower tier wins. Tier 0 means the canvas never mounts.
 */
function detectTier(): Tier {
  if (typeof window === "undefined") return 0;

  // Hard blocks first.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  // Respect Data Saver. Someone on a metered connection did not ask for a
  // 350KB point cloud.
  if (nav.connection?.saveData) return 0;
  if (nav.connection?.effectiveType && /2g/.test(nav.connection.effectiveType)) {
    return 0;
  }

  // No WebGL, no canvas. Checked by actually asking for a context rather than
  // sniffing, because emulators and locked-down browsers lie.
  try {
    const c = document.createElement("canvas");
    const gl =
      c.getContext("webgl2") ??
      (c.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return 0;
  } catch {
    return 0;
  }

  const mem = nav.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;

  if (mem <= 2 || cores <= 2) return 0;
  if (coarse || narrow) return mem >= 8 && cores >= 8 ? 2 : 1;
  return mem >= 8 && cores >= 8 ? 3 : 2;
}

export function CanvasStage() {
  const [tier, setTier] = useState<Tier>(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // After first paint. requestIdleCallback where available so the canvas
    // waits for a genuinely quiet moment rather than merely a later tick.
    const start = () => {
      setTier(detectTier());
      setReady(true);
    };
    const ric = (
      window as Window & { requestIdleCallback?: (cb: () => void, o?: object) => number }
    ).requestIdleCallback;
    const id = ric
      ? ric(start, { timeout: 2500 })
      : window.setTimeout(start, 1200);

    // Drop the canvas if the user turns reduced motion on mid-visit.
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setTier(q.matches ? 0 : detectTier());
    q.addEventListener("change", onChange);

    return () => {
      q.removeEventListener("change", onChange);
      if (!ric) window.clearTimeout(id);
    };
  }, []);

  if (!ready || tier === 0) return null;

  return (
    <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        // No CSS mask. The shader does its own vignette and keeps the left
        // column clear, so the falloff is part of the image rather than a
        // rectangle cut out of it.
      >
        <WaveField />
      </div>
  );
}
