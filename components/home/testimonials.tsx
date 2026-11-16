"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { SectionEyebrow } from "@/components/home/section-eyebrow";
import { MaskedLines } from "@/components/motion/reveal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "I wore the Kesar Banarasi to my sister’s wedding and three aunts asked who had woven it. It feels like something my grandmother would have kept — and yet it is entirely mine.",
    name: "Ananya Rao",
    city: "Mumbai",
    piece: "Kesar Banarasi Silk Saree",
  },
  {
    quote:
      "The chikankari is so fine you only notice it up close, which is exactly the point. I have worn the Ada kurti every week since it arrived.",
    name: "Meera Srinivasan",
    city: "Bengaluru",
    piece: "Ada Chikankari Kurti",
  },
  {
    quote:
      "Linen trousers that hold their line through a long summer. Beautifully cut, honest cloth — and they arrived wrapped in muslin, not plastic.",
    name: "Naina Varma",
    city: "London",
    piece: "Wide-Leg Linen Trouser",
  },
];

const INTERVAL_MS = 8000;
const EASE = [0.22, 1, 0.36, 1] as const;

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 12"
      aria-hidden="true"
      className={cn("h-3 w-6", direction === "left" && "rotate-180")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M0 6h23M17.5 0.5L23 6l-5.5 5.5" />
    </svg>
  );
}

export function Testimonials() {
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  // No auto-advance under reduced motion; otherwise pause on hover, focus or request.
  const autoplay = !reduceMotion && !userPaused;
  const running = autoplay && !hovering && !focusWithin;

  const go = useCallback(
    (step: 1 | -1) => {
      setDirection(step);
      setIndex((current) => (current + step + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => go(1), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [running, index, go]);

  const active = testimonials[index] ?? testimonials[0];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      className="py-24 md:py-36"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
      }}
    >
      <div className="shell">
        <div className="grid gap-y-12 border-t border-line pt-10 md:grid-cols-12 md:gap-x-6 md:pt-14 lg:gap-x-8">
          {/* Heading + controls */}
          <div className="flex flex-col md:col-span-3">
            <SectionEyebrow index="05" label="In their words" />
            <MaskedLines
              className="mt-7 text-title"
              lines={[
                "Worn, ",
                <>
                  and <em className="italic">kept</em>.
                </>,
              ]}
            />

            <div className="mt-10 hidden md:mt-auto md:block">
              <Controls
                index={index}
                count={count}
                running={running}
                autoplay={autoplay}
                showPause={!reduceMotion}
                userPaused={userPaused}
                onPrev={() => go(-1)}
                onNext={() => go(1)}
                onTogglePause={() => setUserPaused((v) => !v)}
              />
            </div>
          </div>

          {/* Quote stage */}
          <div className="md:col-span-8 md:col-start-5">
            <div className="grid" aria-live={running ? "off" : "polite"} aria-atomic="true">
              {/* Invisible sizer: reserves the height of the longest quote so nothing jumps. */}
              {testimonials.map((t) => (
                <figure key={t.name} aria-hidden="true" className="invisible [grid-area:1/1]">
                  <QuoteBody testimonial={t} />
                </figure>
              ))}

              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.figure
                  key={index}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  className="[grid-area:1/1]"
                  custom={direction}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={{
                    enter: (dir: number) => ({ opacity: 0, y: 28 * dir }),
                    center: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
                    exit: (dir: number) => ({ opacity: 0, y: -20 * dir, transition: { duration: 0.45, ease: EASE } }),
                  }}
                >
                  <QuoteBody testimonial={active} />
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-12 md:hidden">
              <Controls
                index={index}
                count={count}
                running={running}
                autoplay={autoplay}
                showPause={!reduceMotion}
                userPaused={userPaused}
                onPrev={() => go(-1)}
                onNext={() => go(1)}
                onTogglePause={() => setUserPaused((v) => !v)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteBody({ testimonial }: { testimonial: (typeof testimonials)[number] }) {
  return (
    <>
      <blockquote className="relative">
        <span
          aria-hidden="true"
          className="absolute -top-2 left-0 font-display text-[4.5rem] leading-none text-maroon md:-left-14 md:-top-4 md:text-[6rem]"
        >
          “
        </span>
        <p className="pt-12 font-display text-[1.75rem] leading-[1.18] tracking-[-0.015em] md:pt-0 md:text-[2.5rem] md:leading-[1.12] xl:text-[3.1rem]">
          {testimonial.quote}
        </p>
      </blockquote>
      <figcaption className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-6">
        <span className="eyebrow">
          {testimonial.name} <span className="px-1 text-maroon">·</span> {testimonial.city}
        </span>
        <span className="font-display text-[15px] italic text-stone">Wearing the {testimonial.piece}</span>
      </figcaption>
    </>
  );
}

type ControlsProps = {
  index: number;
  count: number;
  running: boolean;
  autoplay: boolean;
  showPause: boolean;
  userPaused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
};

function Controls({
  index,
  count,
  running,
  autoplay,
  showPause,
  userPaused,
  onPrev,
  onNext,
  onTogglePause,
}: ControlsProps) {
  return (
    <div>
      {/* Counter + progress hairline */}
      <div className="flex items-center gap-4">
        <span className="eyebrow tabular-nums">
          {String(index + 1).padStart(2, "0")} <span className="text-stone">/ {String(count).padStart(2, "0")}</span>
        </span>
        <span aria-hidden="true" className="relative block h-px flex-1 overflow-hidden bg-line">
          {autoplay ? (
            <motion.span
              key={`${index}-${running ? "run" : "hold"}`}
              className="absolute inset-0 block origin-left bg-maroon"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: running ? 1 : 0 }}
              transition={{ duration: running ? INTERVAL_MS / 1000 : 0.3, ease: "linear" }}
            />
          ) : (
            <span
              className="absolute inset-y-0 left-0 block bg-maroon"
              style={{ width: `${((index + 1) / count) * 100}%` }}
            />
          )}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous testimonial"
          className="flex h-12 w-12 items-center justify-center border border-line transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-ivory"
        >
          <Arrow direction="left" />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next testimonial"
          className="flex h-12 w-12 items-center justify-center border border-line transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-ivory"
        >
          <Arrow direction="right" />
        </button>
        {showPause ? (
          <button
            type="button"
            onClick={onTogglePause}
            className="eyebrow ml-3 min-h-11 px-2 text-[10px] text-stone transition-colors hover:text-ink"
          >
            {userPaused ? "Play" : "Pause"}
            <span className="sr-only"> automatic rotation</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
