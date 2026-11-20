"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { CatalogPhoto } from "@/lib/images";
import { cn, formatPrice } from "@/lib/utils";
import { LABEL } from "./hero-05-poster-deck";

/**
 * Phone version of the Atelier looks. Native horizontal scroll with snap
 * points: the centred card is large and its neighbours peek in at the edges,
 * so swiping is obvious. Starts on the middle look. Tapping a side card
 * brings it to the centre; tapping the centred card opens its collection.
 * Stays on the middle look until the visitor swipes; nudges once as a hint.
 */
export function MobileCarousel({ looks, fromPrice }: { looks: CatalogPhoto[]; fromPrice: Record<string, number> }) {
  const start = Math.floor(looks.length / 2);
  const scroller = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(start);
  const [ready, setReady] = useState(false);
  const touched = useRef(false);
  const frame = useRef(0);
  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(reduced);
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  const centreOn = (i: number, smooth: boolean) => {
    const el = scroller.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2,
      behavior: smooth && !reducedRef.current ? "smooth" : "auto",
    });
  };
  const centreRef = useRef(centreOn);
  useEffect(() => {
    centreRef.current = centreOn;
  });

  // Open on the middle look before showing the row.
  useEffect(() => {
    centreRef.current(start, false);
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [start]);

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = scroller.current;
      if (!el) return;
      const centre = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const c = child as HTMLElement;
        const dist = Math.abs(c.offsetLeft + c.clientWidth / 2 - centre);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    });
  };

  // The middle look stays put (no auto-advance). Once, shortly after load,
  // the row nudges sideways and back: a hint that it can be swiped.
  useEffect(() => {
    if (reduced) return;
    const out = window.setTimeout(() => {
      if (!touched.current) scroller.current?.scrollBy({ left: 56, behavior: "smooth" });
    }, 1600);
    const back = window.setTimeout(() => {
      if (!touched.current) centreRef.current(start, true);
    }, 2200);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(back);
    };
  }, [reduced, start]);

  const stop = () => {
    touched.current = true;
  };

  return (
    <div className={cn("mt-9 transition-opacity duration-700 md:hidden", ready ? "opacity-100" : "opacity-0")}>
      <ul
        ref={scroller}
        onScroll={onScroll}
        onTouchStart={stop}
        onPointerDown={stop}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[12vw] pb-2"
        aria-label="Collections"
      >
        {looks.map((look, i) => {
          const isActive = i === active;
          const href = look.category === "festive" ? "/shop" : `/shop?category=${look.category}`;
          const from = fromPrice[look.category];
          const label = LABEL[look.category];
          return (
            <li
              key={look.src}
              className={cn(
                "w-[76vw] max-w-[22rem] shrink-0 snap-center transition-[transform,opacity] duration-500 ease-editorial",
                isActive ? "scale-100 opacity-100" : "scale-[0.92] opacity-70",
              )}
            >
              <Link
                href={href}
                onClick={(event) => {
                  if (!isActive) {
                    event.preventDefault();
                    stop();
                    centreOn(i, true);
                  }
                }}
                aria-label={`${label}, shop now`}
                className="relative block aspect-[4/5] overflow-hidden rounded-[8px] bg-sand shadow-[0_18px_40px_-24px_rgb(26_26_26/0.5)]"
              >
                <Image
                  src={look.src}
                  alt={look.alt}
                  fill
                  loading="eager"
                  fetchPriority={i === start ? "high" : "low"}
                  sizes="76vw"
                  className="object-cover"
                  style={{ objectPosition: look.position ?? "50% 30%" }}
                />
                <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(26_26_26/0.65)_0%,transparent_45%)]" />
                <span className="absolute inset-x-4 bottom-4 text-ivory">
                  <span className="block font-display text-[1.75rem] leading-none">{label}</span>
                  <span className="mt-1.5 block text-[13px] text-ivory/85">{from ? `from ${formatPrice(from)}` : "New season"}</span>
                  <span
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 rounded-full bg-ivory px-3.5 py-2 text-[12px] font-medium text-ink transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  >
                    Shop {label.toLowerCase()} <span aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Where you are, and a nudge to swipe */}
      <div className="mt-4 flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          {looks.map((look, i) => (
            <button
              key={look.src}
              type="button"
              onClick={() => {
                stop();
                centreOn(i, true);
              }}
              aria-label={`Show ${LABEL[look.category]}`}
              aria-current={i === active ? "true" : undefined}
              className="flex h-6 items-center px-0.5"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-500",
                  i === active ? "w-6 bg-maroon" : "w-1.5 bg-ink/25",
                )}
              />
            </button>
          ))}
        </div>
        <p className="text-[12px] tracking-[0.08em] text-stone">Swipe to explore · tap to shop</p>
      </div>
    </div>
  );
}
