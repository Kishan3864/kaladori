"use client";

import Lenis from "lenis";
import { useEffect } from "react";

let instance: Lenis | null = null;

/**
 * Glide to a page offset: through Lenis when it is running, natively
 * otherwise (touch devices keep native scrolling, and so does reduced motion).
 */
export function scrollToY(y: number) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance && !reduced) instance.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
}

/**
 * Weighted, eased wheel scrolling for desktop (touch keeps the native feel).
 * `autoToggle` pauses Lenis whenever <html> is set to overflow:hidden, so the
 * menu, bag drawer and lightbox scroll locks keep working, and
 * `allowNestedScroll` lets scrollable panels inside them scroll natively.
 * Lenis honours prefers-reduced-motion on its own (1:1 scrolling).
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      autoToggle: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      anchors: { offset: -88 },
    });
    instance = lenis;
    return () => {
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, []);

  return null;
}
