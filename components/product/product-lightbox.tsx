"use client";

import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEscapeKey, useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

type ProductLightboxProps = {
  images: string[];
  alts: string[];
  name: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/**
 * Full-screen image viewer. Mount it inside <AnimatePresence> only while open.
 * Esc closes, ← / → navigate, swipe on touch, focus is trapped and restored.
 */
export function ProductLightbox({ images, alts, name, index, onIndexChange, onClose }: ProductLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [direction, setDirection] = useState(1);
  const count = images.length;

  useFocusTrap(dialogRef, closeRef);
  useLockBodyScroll(true);
  useEscapeKey(true, onClose);

  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setDirection(delta > 0 ? 1 : -1);
      onIndexChange((index + delta + count) % count);
    },
    [count, index, onIndexChange],
  );

  const jump = (target: number) => {
    if (target === index) return;
    setDirection(target > index ? 1 : -1);
    onIndexChange(target);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go]);

  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -500) go(1);
    else if (info.offset.x > 70 || info.velocity.x > 500) go(-1);
  };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} — image viewer`}
      tabIndex={-1}
      className="fixed inset-0 z-[80] flex flex-col bg-ivory outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Top bar */}
      <div className="shell flex h-16 shrink-0 items-center justify-between gap-6 md:h-20">
        <p className="eyebrow tabular-nums">
          <span aria-hidden="true">
            {pad(index + 1)} <span className="text-stone">/ {pad(count)}</span>
          </span>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            Image {index + 1} of {count}
          </span>
        </p>
        <p className="hidden truncate font-display text-xl md:block">{name}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="eyebrow -mr-2 flex h-11 items-center gap-2.5 px-2"
        >
          Close
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>

      {/* Stage */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <motion.div
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          drag={count > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.22}
          onDragEnd={onDragEnd}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              className="absolute inset-0 mx-auto max-w-[1100px] px-4 md:px-24"
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -60 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={images[index]}
                  alt={alts[index] ?? name}
                  fill
                  sizes="(min-width: 1100px) 1100px, 100vw"
                  quality={85}
                  draggable={false}
                  className="select-none object-contain"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {count > 1 ? (
          <>
            <ArrowButton direction="prev" onClick={() => go(-1)} className="left-2 md:left-8" />
            <ArrowButton direction="next" onClick={() => go(1)} className="right-2 md:right-8" />
          </>
        ) : null}
      </div>

      {/* Thumbnails */}
      {count > 1 ? (
        <div className="shell flex shrink-0 items-center justify-center gap-3 py-4 md:py-6">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => jump(i)}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative h-16 w-12 overflow-hidden bg-sand outline-offset-2 transition-opacity duration-500 md:h-20 md:w-16",
                i === index ? "opacity-100 outline outline-1 outline-ink" : "opacity-45 hover:opacity-80",
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

function ArrowButton({
  direction,
  onClick,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous image" : "Next image"}
      className={cn(
        "absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-line bg-ivory/85 text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-ivory",
        className,
      )}
    >
      <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true" className={direction === "prev" ? "rotate-180" : undefined}>
        <path d="M0 5h16.5M12.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    </button>
  );
}
