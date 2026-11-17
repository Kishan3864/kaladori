"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One even grid for the whole shop (all pieces and every category), so every
 * card has the same size and every row lines up:
 * 2 columns on phones, 3 from 640px, 4 from 1024px, 6 from 1280px.
 */
const GRID = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";
const SIZES = "(min-width: 1600px) 250px, (min-width: 1280px) 16vw, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 47vw";
/** Cards in the first screenful load eagerly and never start hidden. */
const EAGER = 6;

type ProductGridProps = {
  products: Product[];
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
 * filter or sort changes; cards further down rise in on scroll.
 */
export function ProductGrid({ products, animated = true, className }: ProductGridProps) {
  return (
    <ul role="list" className={cn("grid gap-x-3 gap-y-8 sm:gap-x-4 md:gap-y-10 xl:gap-x-5", GRID, className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {products.map((product, index) => (
          <motion.li
            key={product.slug}
            layout="position"
            className="min-w-0"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.3, ease: EASE } }}
            transition={{ duration: 0.6, ease: EASE, layout: { duration: 0.6, ease: EASE } }}
          >
            <RiseIn eager={!animated || index < EAGER} delay={(index % 6) * 0.05}>
              <ProductCard product={product} sizes={SIZES} priority={index < EAGER} />
            </RiseIn>
          </motion.li>
        ))}
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
      initial={eager ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
