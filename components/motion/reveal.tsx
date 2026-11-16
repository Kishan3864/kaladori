"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Shared in-view trigger. A small amount plus a slightly raised bottom edge:
 * content starts moving as it enters, and a block taller than the viewport
 * (long copy on a phone) can still reach the threshold — a large fraction
 * there would leave it invisible for good.
 */
const VIEWPORT_MARGIN = "0px 0px -6% 0px";

type RevealProps = HTMLMotionProps<"div"> & {
  /** Delay in seconds. */
  delay?: number;
  /** Distance to rise from, in px. */
  y?: number;
  /** Viewport amount (0–1) that must be visible before animating. Keep it small. */
  amount?: number;
};

/** Fades and lifts its children into place once they scroll into view. */
export function Reveal({ children, delay = 0, y = 28, amount = 0.1, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: VIEWPORT_MARGIN }}
      transition={{ duration: 1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delay?: number;
  amount?: number;
};

/** Parent that staggers <StaggerItem> children into view. */
export function Stagger({ children, stagger = 0.09, delay = 0, amount = 0.05, ...rest }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount, margin: VIEWPORT_MARGIN }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Splits a headline into lines that slide up from a mask, one after another.
 * Pass each line as a separate string.
 */
export function MaskedLines({
  id,
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h2",
  animateOnMount = false,
}: {
  /** Optional id on the heading element (e.g. for aria-labelledby). */
  id?: string;
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  /** Animate immediately (above the fold) instead of on scroll. */
  animateOnMount?: boolean;
}) {
  const trigger = animateOnMount
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, amount: 0.2, margin: VIEWPORT_MARGIN } };

  return (
    <Tag id={id} className={className}>
      <motion.span
        className="block"
        initial="hidden"
        {...trigger}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: delay } } }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className={lineClassName ?? "block"}
              variants={{
                hidden: { y: "110%" },
                show: { y: "0%", transition: { duration: 1.1, ease: EASE } },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
