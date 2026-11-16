"use client";

import { AnimatePresence, motion } from "framer-motion";
import { categories, getCategory, type Category } from "@/data/products";
import { pad } from "./shop-params";

const EASE = [0.22, 1, 0.36, 1] as const;

/** "Six yards of heritage" → "Six yards of <em>heritage</em>" */
function emphasiseLastWord(text: string) {
  const split = text.lastIndexOf(" ");
  if (split === -1) return <em className="italic">{text}</em>;
  return (
    <>
      {text.slice(0, split + 1)}
      <em className="italic">{text.slice(split + 1)}</em>
    </>
  );
}

/**
 * Editorial intro for the selected category. Opens from nothing when a
 * category is chosen in place, cross-fades between categories, and folds
 * away for "All". On page entry it renders already open (initial={false}),
 * so it never pushes the visible grid down after load.
 */
export function CategoryIntro({ category }: { category: Category | null }) {
  const info = category ? getCategory(category) : undefined;
  const number = info ? categories.findIndex((c) => c.slug === info.slug) + 1 : 0;

  return (
    <AnimatePresence initial={false}>
      {info ? (
        <motion.div
          key="category-intro"
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={info.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.65, ease: EASE }}
              className="grid grid-cols-12 gap-x-4 pt-14 md:gap-x-8 md:pt-24"
            >
              <div className="col-span-12 md:col-span-7 lg:col-span-6">
                <p className="eyebrow flex items-center gap-4 text-maroon">
                  <span className="tabular-nums">
                    {pad(number)} / {pad(categories.length)}
                  </span>
                  <span aria-hidden="true" className="h-px w-10 bg-maroon/50" />
                  <span>{info.name}</span>
                </p>
                <p className="mt-6 font-display text-title">{emphasiseLastWord(info.tagline)}</p>
              </div>
              <div className="col-span-12 mt-6 md:col-span-4 md:col-start-9 md:mt-0 md:self-end">
                <p className="text-lede text-ink/75">{info.description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
