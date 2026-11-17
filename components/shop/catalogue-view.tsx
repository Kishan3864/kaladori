"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef } from "react";
import { getCategory, type Catalog } from "@/lib/catalog";
import { CategoryIntro } from "./category-intro";
import { FilterBar } from "./filter-bar";
import { ProductGrid } from "./product-grid";
import { categoryOptions, DEFAULT_SORT, getShopProducts, type ShopState } from "./shop-params";

type CatalogueViewProps = ShopState & {
  catalog: Catalog;
  /**
   * Rendered as the Suspense fallback: server HTML only, never hydrated.
   * Everything renders visible and in place so the markup is complete.
   */
  isFallback?: boolean;
};

/** Header height while it is showing (h-16 / md:h-[4.5rem]). */
const HEADER_OFFSET = { base: 64, md: 72 };

/**
 * The catalogue: filter + sort bar, category intro and product grid.
 * State comes in as props (parsed from the URL by <ShopCatalogue>); changes
 * are written back to the URL with history.replaceState, which Next.js syncs
 * into useSearchParams, so the URL is the only source of truth.
 */
export function CatalogueView({ catalog, category, sort, isFallback = false }: CatalogueViewProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const items = useMemo(() => getShopProducts(catalog.products, category, sort), [catalog, category, sort]);
  const options = useMemo(() => categoryOptions(catalog), [catalog]);
  const info = getCategory(catalog, category);

  const update = useCallback(
    (next: ShopState) => {
      if (next.category === category && next.sort === sort) return;

      // Keep unrelated params (e.g. campaign tags); drop ones equal to the default.
      const params = new URLSearchParams(window.location.search);
      if (next.category) params.set("category", next.category);
      else params.delete("category");
      if (next.sort !== DEFAULT_SORT) params.set("sort", next.sort);
      else params.delete("sort");
      const query = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);

      // If the reader is deep in the grid, bring the start of the results back into view.
      const section = sectionRef.current;
      if (!section) return;
      const { top } = section.getBoundingClientRect();
      if (top >= 0) return;
      const offset = window.matchMedia("(min-width: 48rem)").matches ? HEADER_OFFSET.md : HEADER_OFFSET.base;
      window.scrollTo({ top: window.scrollY + top - offset, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [category, sort, reduceMotion],
  );

  return (
    <section ref={sectionRef} aria-labelledby="catalogue-heading" className="relative pb-16 md:pb-24">
      <h2 id="catalogue-heading" className="sr-only">
        {info ? info.name : "All pieces"}
      </h2>

      <FilterBar options={options} category={category} sort={sort} resultCount={items.length} onChange={update} />

      <div className="shell">
        <CategoryIntro info={info} />

        {items.length > 0 ? (
          <ProductGrid products={items} animated={!isFallback} className="pt-8 md:pt-10" />
        ) : (
          <EmptyState onReset={() => update({ category: null, sort: DEFAULT_SORT })} />
        )}
      </div>
    </section>
  );
}

/** Defensive: shown only if a filter ever returns nothing. */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-12 flex flex-col items-start border-t border-line py-24 md:mt-20 md:items-center md:py-36 md:text-center">
      <p className="eyebrow text-maroon">Nothing on the rail</p>
      <p className="mt-6 font-display text-title">
        This edit is <em className="italic">resting</em>.
      </p>
      <p className="mt-5 max-w-md text-stone">
        New pieces come off the loom in small runs. In the meantime, the full collection is a step away.
      </p>
      <Link
        href="/shop"
        scroll={false}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
          event.preventDefault();
          onReset();
        }}
        className="btn btn-outline mt-10"
      >
        View all pieces
      </Link>
    </div>
  );
}
