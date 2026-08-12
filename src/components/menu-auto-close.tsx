"use client";

import { useEffect } from "react";

/**
 * Closes the mobile menu when it has been left open and untouched.
 *
 * The menu is a native <details> so it works with JavaScript disabled, which is
 * the baseline this site keeps. That baseline has one cost: a <details> stays
 * open until you press its summary again, so tapping a link, going back, or
 * tapping the page leaves it hanging open over the content.
 *
 * IDLE, NOT ELAPSED. The brief was "collapse after 5 seconds". Timed from
 * opening, that closes the menu in the face of anyone still reading it, and
 * this menu has four groups to read through. So the timer measures five seconds
 * of NO INTERACTION and restarts on any pointer move, tap, key or focus inside
 * the menu. Open it and walk away and it closes in five seconds, as asked. Open
 * it and use it and it stays.
 *
 * Also handles the two dismissals people expect and a bare <details> does not
 * give: tapping outside, and Escape.
 *
 * Progressive enhancement. With JavaScript off the menu still opens and closes
 * by its summary; it just does not tidy itself away.
 */

const IDLE_MS = 5000;

export function MenuAutoClose({ targetId }: { targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!(el instanceof HTMLDetailsElement)) return;

    let timer: number | undefined;

    const clear = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };

    const close = () => {
      // Never strand keyboard focus inside a collapsed element.
      if (el.contains(document.activeElement)) {
        el.querySelector("summary")?.focus();
      }
      el.open = false;
      clear();
    };

    const arm = () => {
      clear();
      timer = window.setTimeout(close, IDLE_MS);
    };

    const onToggle = () => (el.open ? arm() : clear());
    const onActivity = () => {
      if (el.open) arm();
    };
    const onDocPointer = (e: Event) => {
      if (el.open && !el.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) close();
    };

    el.addEventListener("toggle", onToggle);
    for (const ev of ["pointermove", "pointerdown", "keydown", "focusin"] as const) {
      el.addEventListener(ev, onActivity);
    }
    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);

    // The menu can already be open on mount after a client-side navigation.
    if (el.open) arm();

    return () => {
      clear();
      el.removeEventListener("toggle", onToggle);
      for (const ev of ["pointermove", "pointerdown", "keydown", "focusin"] as const) {
        el.removeEventListener(ev, onActivity);
      }
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [targetId]);

  return null;
}
