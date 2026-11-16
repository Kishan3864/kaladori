"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.76, 0, 0.24, 1] as const;

type ImageRevealProps = {
  children: React.ReactNode;
  /** Sizing / aspect classes for the frame, e.g. "aspect-[3/4]". Frame is `relative overflow-hidden`. */
  className?: string;
  delay?: number;
  /** Direction the curtain uncovers from. */
  from?: "bottom" | "top" | "left" | "right";
  /** Reveal immediately on mount instead of when scrolled into view. */
  animateOnMount?: boolean;
};

const CLIP: Record<NonNullable<ImageRevealProps["from"]>, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Editorial image reveal: a clip-path curtain opens while the image
 * settles from a slight zoom. Put a `next/image` with `fill` inside.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
  from = "bottom",
  animateOnMount = false,
}: ImageRevealProps) {
  const trigger = animateOnMount
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, amount: 0.2 } };

  return (
    <motion.div
      className={cn("relative overflow-hidden bg-sand", className)}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: { clipPath: CLIP[from] },
        show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.25, ease: EASE, delay } },
      }}
    >
      <motion.div
        className="absolute inset-0"
        variants={{
          hidden: { scale: 1.18 },
          show: { scale: 1, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
