"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { threads } from "@/components/motion/thread-line";
import { getCategory, type Category } from "@/data/products";
import { cn } from "@/lib/utils";
import {
  SORT_OPTIONS,
  buildShopHref,
  categoryOptions,
  pad,
  parseSort,
  sortLabel,
  type ShopState,
} from "./shop-params";

const EASE = [0.22, 1, 0.36, 1] as const;

type FilterBarProps = ShopState & {
  resultCount: number;
  onChange: (next: ShopState) => void;
};

/**
 * Category filter + sort. Categories are real links (crawlable, work before
 * hydration and in a new tab); plain clicks are intercepted and handled
 * in place. Sticky on md+, static on small screens to save height. It sits
 * just below the header while the header is showing and slides up to the
 * top when the header hides (--header-offset, see globals.css).
 */
export function FilterBar({ category, sort, resultCount, onChange }: FilterBarProps) {
  const selectId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const reduceMotion = useReducedMotion();
  const activeName = category ? getCategory(category)?.name : undefined;

  // Keep the active filter visible in the scrollable row on small screens.
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const active = list.querySelector<HTMLElement>('[aria-current="page"]');
    if (!active) return;
    const left = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? "auto" : "smooth" });
  }, [category, reduceMotion]);

  function handleCategoryClick(event: React.MouseEvent<HTMLAnchorElement>, slug: Category | null) {
    // Let modified clicks (new tab / window) behave like normal links.
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onChange({ category: slug, sort });
  }

  return (
    <div className="border-y border-line bg-ivory md:sticky md:top-(--header-offset) md:z-30 md:transition-[top] md:duration-500 md:ease-editorial">
      <div className="shell flex flex-col md:min-h-16 md:flex-row md:items-center md:justify-between md:gap-10">
        <nav aria-label="Filter by category" className="min-w-0">
          <motion.ul
            ref={listRef}
            layoutScroll
            className="no-scrollbar relative -mx-5 flex gap-7 overflow-x-auto px-5 md:mx-0 md:gap-10 md:px-0"
          >
            {categoryOptions.map((option) => {
              const active = option.slug === category;
              return (
                <li key={option.slug ?? "all"} className="shrink-0">
                  <Link
                    href={buildShopHref(option.slug, sort)}
                    prefetch={false}
                    scroll={false}
                    replace
                    aria-current={active ? "page" : undefined}
                    onClick={(event) => handleCategoryClick(event, option.slug)}
                    className={cn(
                      "eyebrow relative flex min-h-12 items-center gap-1.5 whitespace-nowrap transition-colors duration-500 ease-editorial md:min-h-16",
                      active ? "text-ink" : "text-stone hover:text-ink",
                    )}
                  >
                    <span>{option.name}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "-translate-y-1.5 text-[9px] tracking-[0.12em] tabular-nums transition-colors duration-500",
                        active ? "text-maroon" : "text-stone/70",
                      )}
                    >
                      {pad(option.count)}
                    </span>
                    <span className="sr-only">
                      ({option.count} {option.count === 1 ? "piece" : "pieces"})
                    </span>
                    {active ? (
                      <motion.span
                        layoutId="shop-active-thread"
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-2 h-[7px] md:bottom-4"
                        transition={{ duration: 0.7, ease: EASE }}
                      >
                        <svg
                          viewBox={threads.underline.viewBox}
                          preserveAspectRatio="none"
                          className="h-full w-full overflow-visible"
                          fill="none"
                        >
                          <path
                            d={threads.underline.d}
                            stroke="var(--color-maroon)"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </motion.span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        </nav>

        <div className="flex min-h-12 items-center justify-between gap-6 border-t border-line md:min-h-0 md:justify-end md:gap-8 md:border-t-0">
          <p role="status" className="eyebrow tabular-nums text-stone">
            {resultCount} {resultCount === 1 ? "piece" : "pieces"}
            <span className="sr-only">
              {activeName ? ` in ${activeName}` : ""}, sorted by {sortLabel(sort).toLowerCase()}
            </span>
          </p>

          <span aria-hidden="true" className="hidden h-4 w-px bg-line md:block" />

          <div className="flex items-center gap-3">
            <label htmlFor={selectId} className="eyebrow text-stone">
              Sort
            </label>
            <div className="relative">
              <select
                id={selectId}
                value={sort}
                onChange={(event) => onChange({ category, sort: parseSort(event.target.value) })}
                // 16px on small screens stops iOS zooming into the field on focus.
                className="h-11 cursor-pointer appearance-none rounded-none border-0 bg-transparent py-0 pl-0 pr-7 text-base text-ink transition-colors duration-300 hover:text-maroon md:text-[13px]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 10 6"
                className="pointer-events-none absolute right-1 top-1/2 h-1.5 w-2.5 -translate-y-1/2 text-ink"
                fill="none"
              >
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
