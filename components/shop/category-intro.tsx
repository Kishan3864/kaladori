"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CategoryInfo } from "@/lib/catalog";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One short line about the selected category, above the grid. Cross-fades
 * between categories and folds away for "All". On page entry it renders
 * already open (initial={false}), so it never pushes the grid down after load.
 */
export function CategoryIntro({ info }: { info: CategoryInfo | undefined }) {

  return (
    <AnimatePresence initial={false}>
      {info ? (
        <motion.div
          key="category-intro"
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={info.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="pt-8 md:pt-10"
            >
              <p className="text-title">{info.name}</p>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-stone">{info.description}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
