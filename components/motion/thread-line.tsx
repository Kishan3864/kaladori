"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type UseScrollOptions,
} from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Preset thread paths. Each has its own viewBox; the SVG is stretched to the
 * wrapper with preserveAspectRatio="none" and a non-scaling stroke, so the
 * line stays crisp at any size.
 */
export const threads = {
  /** Gentle horizontal wave across a section. */
  wave: {
    viewBox: "0 0 1200 200",
    d: "M-10 130 C 140 30, 290 30, 420 112 S 690 205, 820 104 S 1080 12, 1210 92",
  },
  /** Horizontal thread that ties a single stitch-loop in the middle. */
  loop: {
    viewBox: "0 0 1200 300",
    d: "M-10 210 C 190 210, 300 70, 450 92 C 572 110, 566 236, 472 236 C 382 236, 398 112, 530 92 C 712 64, 900 262, 1210 140",
  },
  /** Tall S-curve that runs down the side of a section. */
  vertical: {
    viewBox: "0 0 200 1000",
    d: "M110 -10 C 190 120, 20 230, 100 350 S 190 570, 92 690 S 18 880, 118 1010",
  },
  /** Long meandering thread for full-height page sections. */
  meander: {
    viewBox: "0 0 400 1600",
    d: "M200 -10 C 360 120, 360 260, 210 330 S 30 470, 80 620 S 330 760, 300 920 C 280 1030, 120 1040, 110 1150 C 100 1270, 300 1300, 290 1430 S 190 1560, 210 1610",
  },
  /** Short hand-drawn underline for headings. */
  underline: {
    viewBox: "0 0 400 40",
    d: "M2 28 C 80 10, 160 36, 240 20 S 360 12, 398 22",
  },
} as const;

export type ThreadPreset = keyof typeof threads;

type ThreadLineProps = {
  /** Preset path, or pass `d` + `viewBox` for a custom one. */
  preset?: ThreadPreset;
  d?: string;
  viewBox?: string;
  /** Wrapper classes — usually `absolute inset-x-0 top-10 h-40` or similar. */
  className?: string;
  /** Stroke width in screen pixels. */
  strokeWidth?: number;
  /** Any CSS colour; defaults to brand maroon. */
  color?: string;
  /**
   * Scroll range (relative to the wrapper) over which the thread draws.
   * Defaults to: begins when the wrapper's top hits 85% of the viewport,
   * completes when its bottom reaches 35%.
   */
  offset?: UseScrollOptions["offset"];
  /** Draw a small needle-eye dot at the leading tip. */
  showTip?: boolean;
};

/**
 * A maroon thread that draws itself as you scroll — the KalaDori signature.
 * Decorative only (aria-hidden, pointer-events-none). Place inside a
 * `relative` parent.
 */
export function ThreadLine({
  preset = "wave",
  d,
  viewBox,
  className,
  strokeWidth = 1.5,
  color = "var(--color-maroon)",
  offset = ["start 85%", "end 35%"],
  showTip = false,
}: ThreadLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Hydration-safe: false on the server and on the first client render, so
  // the markup always matches. Reduced-motion users then get the thread
  // drawn in full, with no moving tip.
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 });
  const pathLength = useTransform(smooth, [0, 1], [0.001, 1]);
  // The tip is a near-zero-length dash riding the head of the drawn thread.
  const tipOffset = useTransform(pathLength, (v) => Math.max(0, v - 0.002));
  const tipOpacity = useTransform(smooth, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);

  const path = d ?? threads[preset].d;
  const box = viewBox ?? threads[preset].viewBox;

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none", className)}>
      <svg
        viewBox={box}
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        fill="none"
      >
        <motion.path
          d={path}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduceMotion ? 1 : pathLength }}
        />
        {showTip && !reduceMotion ? (
          <motion.path
            d={path}
            stroke={color}
            strokeWidth={strokeWidth * 3.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: 0.002, pathOffset: tipOffset, opacity: tipOpacity }}
          />
        ) : null}
      </svg>
    </div>
  );
}

/**
 * Same thread, but drawn once when it scrolls into view (not scroll-linked).
 * Good for heading underlines and small flourishes.
 */
export function ThreadDraw({
  preset = "underline",
  d,
  viewBox,
  className,
  strokeWidth = 1.5,
  color = "var(--color-maroon)",
  delay = 0.2,
  duration = 1.6,
}: Omit<ThreadLineProps, "offset" | "showTip"> & { delay?: number; duration?: number }) {
  const path = d ?? threads[preset].d;
  const box = viewBox ?? threads[preset].viewBox;
  return (
    <div aria-hidden="true" className={cn("pointer-events-none", className)}>
      <svg viewBox={box} preserveAspectRatio="none" className="h-full w-full overflow-visible" fill="none">
        <motion.path
          d={path}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
    </div>
  );
}
