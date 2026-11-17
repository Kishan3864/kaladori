"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { announcements } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;
const EVERY_MS = 4200;

/**
 * Thin bar above the header. Messages slide up one after another; hovering
 * or focusing holds the current one. All messages are also in the DOM for
 * screen readers (visually hidden list), so nothing depends on timing.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (held || reduced || announcements.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % announcements.length), EVERY_MS);
    return () => window.clearInterval(id);
  }, [held, reduced]);

  return (
    <div
      className="relative z-[51] bg-ink text-ivory"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <ul className="sr-only">
        {announcements.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="shell relative flex h-9 items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={index}
            className="truncate text-center text-[11px] tracking-[0.12em] text-ivory/90 sm:text-[12px]"
            initial={{ y: "120%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-120%", opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {announcements[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
