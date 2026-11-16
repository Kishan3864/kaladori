"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Pause / play for every <Marquee> inside the nearest `[data-marquee-group]`
 * ancestor (WCAG 2.2.2: moving content needs a way to stop it). Sets
 * `data-marquee-paused` on that ancestor; globals.css pauses the animation.
 * Hidden under reduced motion, where marquees are already still.
 */
export function MarqueeToggle({ className }: { className?: string }) {
  const [paused, setPaused] = useState(false);

  return (
    <button
      type="button"
      onClick={(event) => {
        const next = !paused;
        const group = event.currentTarget.closest<HTMLElement>("[data-marquee-group]");
        if (group) {
          if (next) group.dataset.marqueePaused = "";
          else delete group.dataset.marqueePaused;
        }
        setPaused(next);
      }}
      aria-label={paused ? "Play the scrolling banner" : "Pause the scrolling banner"}
      className={cn(
        "eyebrow inline-flex min-h-11 items-center gap-2.5 px-2 text-[10px] text-ivory/70 transition-colors duration-300 hover:text-ivory motion-reduce:hidden",
        className,
      )}
    >
      <svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true" fill="currentColor">
        {paused ? <path d="M0 0l8 5-8 5z" /> : <path d="M0 0h2.5v10H0zM5.5 0H8v10H5.5z" />}
      </svg>
      <span aria-hidden="true">{paused ? "Play" : "Pause"}</span>
    </button>
  );
}
