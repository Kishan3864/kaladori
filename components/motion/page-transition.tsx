"use client";

import { motion } from "framer-motion";

/**
 * A maroon thread that sweeps across the top of the viewport each time a
 * route mounts (rendered from app/template.tsx, which remounts per navigation).
 */
export function PageThread() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-maroon"
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: [1, 1, 0] }}
      transition={{
        scaleX: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
        opacity: { duration: 1.2, times: [0, 0.7, 1], ease: "linear" },
      }}
    />
  );
}
