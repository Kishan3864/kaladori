"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { GridInterlude } from "./grid-interlude";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Two layouts, both 2 columns under md (the shell caps content at 1600px):
 * - 3: three columns from md (the full catalogue, with the interlude).
 * - 4: a single category's four pieces as one asymmetric row on lg (2 × 2
 *   on md), alternate cards dropped lower, so no card is left alone on a
 *   final row.
 */
const LAYOUTS = {
  3: {
    grid: "md:grid-cols-3",
    sizes: "(min-width: 1600px) 480px, (min-width: 768px) 31vw, 47vw",
    offset: "",
  },
  4: {
    grid: "lg:grid-cols-4",
    sizes: "(min-width: 1600px) 360px, (min-width: 1024px) 23vw, 47vw",
    offset: "md:mt-20 lg:mt-28",
  },
} as const;
/** The interlude follows two full rows on desktop and three on mobile. */
const INTERLUDE_AFTER = 6;

type GridEntry = { kind: "product"; product: Product; index: number } | { kind: "interlude" };

type ProductGridProps = {
  products: Product[];
  /** Columns from md / lg (see LAYOUTS). */
  columns?: 3 | 4;
  /** Insert the editorial interlude (used for the "All" view). */
  showInterlude?: boolean;
  /**
   * false = fully static markup with nothing starting hidden. Used by the
   * Suspense fallback, which is server HTML only and never hydrated.
   */
  animated?: boolean;
  className?: string;
};

/**
 * Presentational product grid shared by the server-rendered fallback and the
 * interactive catalogue. Items reflow with layout animations when the
 * filter or sort changes; cards below the first row rise in on scroll.
 */
export function ProductGrid({
  products,
  columns = 3,
  showInterlude = false,
  animated = true,
  className,
}: ProductGridProps) {
  const layout = LAYOUTS[columns];
  /** First row: loaded eagerly and never hidden for a scroll reveal. */
  const firstRow = columns;
  const entries: GridEntry[] = products.map((product, index) => ({ kind: "product", product, index }));
  if (showInterlude && products.length > INTERLUDE_AFTER) {
    entries.splice(INTERLUDE_AFTER, 0, { kind: "interlude" });
  }

  return (
    <ul
      role="list"
      className={cn(
        "relative grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-20",
        layout.grid,
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {entries.map((entry) =>
          entry.kind === "interlude" ? (
            <motion.li
              key="interlude"
              layout="position"
              className="col-span-2 md:col-span-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE } }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            >
              <GridInterlude animated={animated} />
            </motion.li>
          ) : (
            <motion.li
              key={entry.product.slug}
              layout="position"
              className={entry.index % 2 === 1 ? layout.offset : undefined}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.35, ease: EASE } }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.12, layout: { duration: 0.8, ease: EASE } }}
            >
              <RiseIn eager={!animated || entry.index < firstRow} delay={(entry.index % columns) * 0.09}>
                <ProductCard product={entry.product} sizes={layout.sizes} priority={entry.index < firstRow} />
              </RiseIn>
            </motion.li>
          ),
        )}
      </AnimatePresence>
    </ul>
  );
}

/**
 * Fades and lifts a card the first time it scrolls into view. `eager` is read
 * on mount only: those cards render in place (no hidden first frame).
 */
function RiseIn({ children, eager, delay }: { children: React.ReactNode; eager: boolean; delay: number }) {
  return (
    <motion.div
      initial={eager ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
