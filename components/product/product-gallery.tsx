"use client";

import Image from "next/image";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { ImageReveal } from "@/components/motion/image-reveal";
import { cn } from "@/lib/utils";
import { ProductLightbox } from "./product-lightbox";

const pad = (n: number) => String(n).padStart(2, "0");
const VIEW_NAMES = ["front view", "alternate view", "fabric detail"];

/** Horizontal scroll position that snaps slide `index` of a scroller into place. */
function slideLeft(el: HTMLElement, index: number) {
  const slide = el.children[index] as HTMLElement | undefined;
  if (!slide) return 0;
  const start = parseFloat(getComputedStyle(el).paddingLeft) || 0;
  return slide.offsetLeft - start;
}

type ProductGalleryProps = {
  images: string[];
  name: string;
  colour: string;
};

/**
 * One list, two layouts:
 * - below lg: a swipeable, scroll-snapping carousel with counter and thread-dash indicators
 * - lg and up: an editorial stack (first image full width, then pairs) with scroll reveals
 * Any image opens the full-screen lightbox.
 */
export function ProductGallery({ images, name, colour }: ProductGalleryProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const count = images.length;

  const alts = images.map((_, i) =>
    i === 0 ? `${name} in ${colour}` : `${name} — ${VIEW_NAMES[i] ?? `view ${i + 1}`}`,
  );

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 1) return;
      if (el.scrollLeft >= max - 4) {
        setActive(count - 1);
        return;
      }
      let best = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (let i = 0; i < el.children.length; i++) {
        const distance = Math.abs(slideLeft(el, i) - el.scrollLeft);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      }
      setActive(best);
    });
  };

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: slideLeft(el, index), behavior: reduceMotion ? "auto" : "smooth" });
  };

  const closeLightbox = useCallback(() => {
    // Leave the mobile carousel on the image the visitor was last looking at.
    const el = scrollerRef.current;
    if (el && lightboxIndex !== null && el.scrollWidth > el.clientWidth + 1) {
      el.scrollTo({ left: slideLeft(el, lightboxIndex), behavior: "auto" });
    }
    setLightboxIndex(null);
  }, [lightboxIndex]);

  return (
    <div className="relative">
      <ul
        ref={scrollerRef}
        onScroll={onScroll}
        aria-label={`${name} — images`}
        className={cn(
          "no-scrollbar relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
          "sm:gap-3 sm:scroll-px-5 sm:px-5 md:scroll-px-10 md:px-10",
          "lg:grid lg:snap-none lg:grid-cols-2 lg:gap-3 lg:overflow-visible lg:px-0 xl:gap-4",
        )}
      >
        {images.map((src, i) => {
          // First image (and a trailing odd one) spans the full width on desktop.
          const feature = i === 0 || (i === count - 1 && count % 2 === 0);
          return (
            <li
              key={`${src}-${i}`}
              className={cn(
                "group relative aspect-[4/5] w-full shrink-0 snap-start sm:w-[64%] md:w-[58%] lg:w-auto",
                feature ? "lg:col-span-2" : "lg:aspect-[3/4]",
              )}
            >
              <ImageReveal className="h-full w-full" animateOnMount={i === 0} delay={i === 0 ? 0.15 : 0.05 * i}>
                <Image
                  src={src}
                  alt={alts[i]}
                  fill
                  quality={85}
                  sizes={
                    feature
                      ? "(min-width: 1024px) 56vw, (min-width: 768px) 58vw, (min-width: 640px) 64vw, 100vw"
                      : "(min-width: 1024px) 28vw, (min-width: 768px) 58vw, (min-width: 640px) 64vw, 100vw"
                  }
                  loading={i === 0 ? "eager" : undefined}
                  fetchPriority={i === 0 ? "high" : undefined}
                  className="object-cover transition-transform duration-[1600ms] ease-editorial group-hover:scale-[1.05]"
                />
              </ImageReveal>
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-label={`Open image ${i + 1} of ${count} in full screen`}
                className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-offset-[-6px]"
              >
                <span
                  aria-hidden="true"
                  className="eyebrow absolute bottom-4 right-4 hidden items-center gap-2 bg-ivory/90 px-3 py-2 text-[10px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:inline-flex"
                >
                  Enlarge
                  <svg width="9" height="9" viewBox="0 0 9 9">
                    <path d="M4.5 0v9M0 4.5h9" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Mobile / tablet: counter + indicators */}
      {count > 1 ? (
        <div className="mt-3 flex items-center justify-between px-5 md:px-10 lg:hidden">
          <p className="eyebrow tabular-nums text-stone">
            <span aria-hidden="true">
              <span className="text-ink">{pad(active + 1)}</span> / {pad(count)}
            </span>
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              Image {active + 1} of {count}
            </span>
          </p>
          <div className="-mr-2 flex items-center">
            {images.map((src, i) => (
              <button
                key={`dot-${src}-${i}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show image ${i + 1} of ${count}`}
                aria-current={i === active ? "true" : undefined}
                className="group flex h-11 w-11 items-center justify-center"
              >
                <span
                  className={cn(
                    "block h-[1.5px] transition-[width,background-color] duration-500 ease-editorial",
                    i === active ? "w-7 bg-maroon" : "w-3.5 bg-ink/25 group-hover:bg-ink/50",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {lightboxIndex !== null ? (
          <ProductLightbox
            key="lightbox"
            images={images}
            alts={alts}
            name={name}
            index={lightboxIndex}
            onIndexChange={setLightboxIndex}
            onClose={closeLightbox}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
