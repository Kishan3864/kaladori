"use client";

import { motion } from "framer-motion";

/** Quiet "Scroll" cue: a short maroon stitch travelling along a hairline. */
export function ScrollCue() {
  return (
    <div aria-hidden="true" className="flex items-center gap-4 text-stone">
      <span className="eyebrow text-[10px]">Scroll</span>
      <span className="relative block h-px w-20 overflow-hidden bg-ink/15">
        <motion.span
          className="absolute inset-y-0 left-0 block w-1/3 bg-maroon"
          initial={{ x: "-100%" }}
          animate={{ x: "300%" }}
          transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], repeat: Infinity, repeatDelay: 0.6, delay: 1.6 }}
        />
      </span>
    </div>
  );
}
