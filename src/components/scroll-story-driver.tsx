"use client";

import { useEffect, useRef, useState } from "react";
import manifest from "@/lib/story-frames.json";

/**
 * Drives the pinned scroll story. See sections/scroll-story.tsx for the markup
 * and the reasoning; this file is only the motion.
 *
 * ONE NUMBER. Everything is a function of `u`, the scroll position measured in
 * stages: 0 is the first stage, 1 the second, and so on. Around each whole
 * number the picture holds still (HOLD either side) so the copy can be read;
 * between holds the morph clip for that pair of stages is scrubbed.
 *
 * FRAMES, NOT VIDEO. Seeking a <video> on scroll stutters on every phone that
 * matters, because a seek has to decode from the previous keyframe. The clips
 * are cut into WebP frames at build time (scripts/build-story-frames.mjs) and
 * drawn to a canvas, which scrubs in both directions at any speed.
 *
 * NEVER IN THE WAY. The stills in the markup carry first paint. Frames only
 * start loading after the page is idle, never under Save-Data or on 2G, and
 * until the frame for the current position has arrived the stills crossfade
 * instead, so there is no moment with nothing on screen.
 */

const LIVE = "(scripting: enabled) and (prefers-reduced-motion: no-preference)";
const HOLD = 0.22;
const HANDOVER = 0.06;

interface StageMeta {
  id: string;
  dot: string;
  bg: string;
  tone: "light" | "dark";
}

type Rgb = [number, number, number];

const hex = (h: string): Rgb => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: Rgb, b: Rgb, t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)} ${Math.round(a[1] + (b[1] - a[1]) * t)} ${Math.round(a[2] + (b[2] - a[2]) * t)})`;
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

export function ScrollStoryDriver({ stages }: { stages: StageMeta[] }) {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);
  const jump = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const stage = root.current?.closest<HTMLElement>("[data-story-stage]");
    const section = stage?.closest<HTMLElement>("[data-story]");
    const canvas = canvasRef.current;
    if (!stage || !section || !canvas) return;

    const live = window.matchMedia(LIVE);
    const panels = [...section.querySelectorAll<HTMLElement>("[data-story-panel]")];
    const parts = panels.map((p) => ({
      panel: p,
      copy: p.querySelector<HTMLElement>("[data-story-copy]"),
      still: p.querySelector<HTMLElement>("[data-story-still]"),
      callouts: p.querySelector<HTMLElement>("[data-story-callouts]"),
    }));
    const n = panels.length;
    const span = n - 1 + HOLD;
    const stageBg = stages.map((s) => hex(s.bg));

    /* ------------------------------------------------------------ frames -- */
    const size = window.innerWidth < 768 ? manifest.sizes.sm : manifest.sizes.lg;
    const clips = manifest.clips;
    const clipBg = clips.map((c) => c.bg.map(hex));
    const images: (HTMLImageElement | undefined)[][] = clips.map(() => []);
    const ctx = canvas.getContext("2d", { alpha: false });
    canvas.width = size.w;
    canvas.height = size.h;

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const frugal =
      nav.connection?.saveData === true ||
      /2g/.test(nav.connection?.effectiveType ?? "");

    let cancelled = false;
    let dirty = true;

    function loadFrames() {
      if (frugal || clips.length !== n - 1) return;
      // Clip ends first, because the holds need them and a visitor who scrolls
      // fast lands on a hold. Then the clips in reading order.
      const queue: [number, number][] = [];
      clips.forEach((c, ci) => queue.push([ci, 0], [ci, c.count - 1]));
      clips.forEach((c, ci) => {
        for (let f = 1; f < c.count - 1; f++) queue.push([ci, f]);
      });
      let next = 0;
      const pump = () => {
        if (cancelled || next >= queue.length) return;
        const [ci, f] = queue[next++];
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          images[ci][f] = img;
          dirty = true;
          pump();
        };
        img.onerror = pump;
        img.src = `${size.dir}/c${ci + 1}-${String(f).padStart(3, "0")}.webp`;
      };
      for (let k = 0; k < 6; k++) pump();
    }

    /* ------------------------------------------------------------ render -- */
    let lastActive = -1;

    function render(u: number) {
      const base = Math.min(n - 1, Math.floor(u));
      const frac = u - base;

      // Copy and callouts. Read at full strength through the hold, gone before
      // the ground colour has travelled far enough to cost contrast.
      for (let k = 0; k < n; k++) {
        const d = u - k;
        const a = clamp((0.42 - Math.abs(d)) / 0.2);
        const { panel, copy, callouts } = parts[k];
        if (copy) {
          copy.style.opacity = a.toFixed(3);
          copy.style.transform = `translate3d(0, ${(-d * 56).toFixed(1)}px, 0)`;
        }
        if (callouts) {
          callouts.style.opacity = clamp((0.3 - Math.abs(d)) / 0.1).toFixed(3);
        }
        panel.toggleAttribute("data-active", a > 0.5);
      }

      // Which picture. A hold rests on the last frame of the clip that led
      // into it, then hands over to the first frame of the next clip in the
      // last HANDOVER of the hold. The two frames come from the same still but
      // are not identical to the pixel, and a blend across the whole hold left
      // a faint double edge on screen exactly where the visitor stops to read.
      let a: [number, number] | null = null;
      let b: [number, number] | null = null;
      let m = 0;
      if (clips.length === n - 1) {
        if (frac <= HOLD || base === n - 1) {
          const s = base;
          if (s > 0) a = [s - 1, clips[s - 1].count - 1];
          if (s < n - 1) b = [s, 0];
          m = (frac - (HOLD - HANDOVER)) / HANDOVER;
        } else if (frac >= 1 - HOLD) {
          const s = base + 1;
          a = [s - 1, clips[s - 1].count - 1];
          if (s < n - 1) b = [s, 0];
          m = 0;
        } else {
          const t = (frac - HOLD) / (1 - 2 * HOLD);
          a = [base, Math.round(t * (clips[base].count - 1))];
        }
        if (!a) {
          a = b;
          b = null;
          m = 0;
        }
      }

      const imgA = a ? images[a[0]][a[1]] : undefined;
      const imgB = b ? images[b[0]][b[1]] : undefined;
      const ready = !!ctx && !!a && !!imgA && (!b || !!imgB);

      let ground: string;
      if (ready && a && imgA) {
        ctx.globalAlpha = 1;
        ctx.drawImage(imgA, 0, 0, canvas!.width, canvas!.height);
        const bgA = clipBg[a[0]][a[1]];
        if (b && imgB && m > 0) {
          ctx.globalAlpha = clamp(m);
          ctx.drawImage(imgB, 0, 0, canvas!.width, canvas!.height);
          ground = mix(bgA, clipBg[b[0]][b[1]], clamp(m));
        } else {
          ground = mix(bgA, bgA, 0);
        }
        canvas!.style.opacity = "1";
        for (const p of parts) if (p.still) p.still.style.opacity = "0";
      } else {
        // No frame yet: crossfade the stills in the markup instead.
        canvas!.style.opacity = "0";
        const t = clamp((frac - HOLD) / (1 - 2 * HOLD));
        const eased = t * t * (3 - 2 * t);
        for (let k = 0; k < n; k++) {
          const still = parts[k].still;
          if (!still) continue;
          const o = k === base ? 1 - eased : k === base + 1 ? eased : 0;
          still.style.opacity = o.toFixed(3);
        }
        ground = mix(stageBg[base], stageBg[Math.min(n - 1, base + 1)], eased);
      }
      stage!.style.setProperty("--story-ground", ground);

      if (hintRef.current) {
        hintRef.current.style.opacity = clamp(1 - u / 0.12).toFixed(3);
      }

      const now = clamp(Math.round(u), 0, n - 1);
      if (now !== lastActive) {
        lastActive = now;
        stage!.dataset.tone = stages[now].tone;
        setActive(now);
      }
    }

    /* ------------------------------------------------------------ scroll -- */
    const travel = () => section!.offsetHeight - stage!.offsetHeight;
    const pinTop = () => parseFloat(getComputedStyle(stage!).top) || 0;

    const target = () => {
      const t = travel();
      if (t <= 0) return 0;
      return clamp((pinTop() - section!.getBoundingClientRect().top) / t) * span;
    };

    let current = target();
    let raf = 0;

    const tick = () => {
      raf = 0;
      if (!live.matches) return;
      const to = target();
      const delta = to - current;
      // A little damping, so a wheel notch or a touch fling reads as one move.
      current = Math.abs(delta) < 0.0015 ? to : current + delta * 0.22;
      if (delta !== 0 || dirty) {
        dirty = false;
        render(current);
      }
      if (current !== to) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const reset = () => {
      for (const p of parts) {
        p.copy?.removeAttribute("style");
        p.still?.removeAttribute("style");
        p.callouts?.removeAttribute("style");
        p.panel.removeAttribute("data-active");
      }
      stage!.style.removeProperty("--story-ground");
      delete stage!.dataset.tone;
      lastActive = -1;
    };

    const onMode = () => {
      if (live.matches) {
        dirty = true;
        kick();
      } else reset();
    };

    jump.current = (i: number) => {
      const top =
        section!.getBoundingClientRect().top + window.scrollY - pinTop();
      window.scrollTo({ top: top + (i / span) * travel(), behavior: "smooth" });
    };

    // A link inside a faded stage can still take keyboard focus. Bring its
    // stage into view rather than leave focus on something invisible.
    const onFocus = (e: FocusEvent) => {
      if (!live.matches) return;
      const i = panels.findIndex((p) => p.contains(e.target as Node));
      if (i >= 0 && Math.abs(current - i) > 0.3) {
        const top =
          section!.getBoundingClientRect().top + window.scrollY - pinTop();
        window.scrollTo({ top: top + (i / span) * travel() });
      }
    };

    // Frames wait for the page to settle. A timer that keeps polling `dirty`
    // is cheaper than wiring every image load to a repaint.
    const loaded = () => {
      if (dirty) kick();
    };
    const poll = window.setInterval(loaded, 120);

    const idle = (
      window as Window & {
        requestIdleCallback?: (cb: () => void, o?: object) => number;
      }
    ).requestIdleCallback;
    const start = () => {
      if (!cancelled && live.matches) loadFrames();
    };
    if (idle) idle(start, { timeout: 2500 });
    else window.setTimeout(start, 1200);

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    section.addEventListener("focusin", onFocus);
    live.addEventListener("change", onMode);
    onMode();

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      section.removeEventListener("focusin", onFocus);
      live.removeEventListener("change", onMode);
      reset();
    };
  }, [stages]);

  return (
    <div ref={root} className="story-driver">
      <div aria-hidden className="story-layer">
        <div className="story-figure">
          <canvas ref={canvasRef} className="story-canvas" />
        </div>
      </div>

      <nav aria-label="Story stages" className="story-dots">
        <ul>
          {stages.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                aria-label={s.dot}
                aria-current={active === i ? "step" : undefined}
                onClick={() => jump.current(i)}
              >
                <span aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <p ref={hintRef} aria-hidden className="story-hint">
        Scroll to look inside
      </p>
    </div>
  );
}
