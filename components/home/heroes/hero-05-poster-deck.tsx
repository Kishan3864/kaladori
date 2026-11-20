"use client";

/**
 * HERO 05: "Poster Deck".
 *
 * Part 1: a deck of printed catalog posters stacked in 3D. Every few seconds
 * the top poster turns away like a page and the next comes forward; story
 * style progress bars count the time. The whole room takes on the colour of
 * the poster on top (red studio, navy, festive gold), and the category name
 * runs behind the deck in giant outline letters. Swipe, arrow keys or the
 * buttons move through it; on desktop the deck leans toward the pointer.
 *
 * Part 2: "The Festive Edit", a poster wall of catalog shots in two rows
 * drifting in opposite directions on a gently tilted 3D plane.
 */
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { CatalogPhoto } from "@/lib/images";
import { formatPrice } from "@/lib/utils";
import { HeroActions, heroHidden, heroShown, syncHeader } from "./story-kit";
import type { HeroData } from "./types";

const EASE = [0.22, 1, 0.36, 1] as const;
const DWELL_MS = 4800;
/** Posters drawn behind the top one. */
const DEPTH = 3;

export const LABEL: Record<CatalogPhoto["category"], string> = {
  sarees: "Sarees",
  kurtis: "Kurtis",
  pants: "Pants",
  festive: "Festive",
};

export function HeroPosterDeck({ data }: { data: HeroData }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => syncHeader(wrapRef.current));
  useEffect(() => {
    heroShown();
    syncHeader(wrapRef.current);
    return heroHidden;
  }, []);

  return (
    <div id="home-story" ref={wrapRef} className="relative -mt-16 md:-mt-[4.5rem]">
      <Deck data={data} />
      <PosterWall rows={data.catalog.wall} />
    </div>
  );
}

/* ===================================================================== deck */

function Deck({ data }: { data: HeroData }) {
  const posters = data.catalog.deck;
  const n = posters.length;
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => {
        if (dir === 1) setLeaving(i);
        return (i + dir + n) % n;
      });
    },
    [n],
  );

  // Clear the "leaving" pose once its turn has played.
  useEffect(() => {
    if (leaving === null) return;
    const t = window.setTimeout(() => setLeaving(null), 950);
    return () => window.clearTimeout(t);
  }, [leaving]);

  // Auto-advance while visible, not held, and motion is welcome.
  const playing = !held && onScreen && !reduced;
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(1), DWELL_MS);
    return () => window.clearTimeout(t);
  }, [playing, index, go]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The deck leans toward a fine pointer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltY = useSpring(useTransform(px, (v) => v * 10), { stiffness: 80, damping: 18 });
  const tiltX = useSpring(useTransform(py, (v) => v * -6), { stiffness: 80, damping: 18 });

  const current = posters[index];
  const from = data.catalog.fromPrice[current.category];

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="The Festive Edit"
      className="relative overflow-hidden text-ivory"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      {/* The room takes the poster's colour. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={false}
        animate={{ backgroundColor: current.tone }}
        transition={{ duration: 1.1, ease: EASE }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(80%_70%_at_70%_50%,transparent_0%,rgb(0_0_0/0.35)_100%)]"
      />
      <div aria-hidden="true" className="cinema-grain absolute inset-0" />

      {/* Giant outline category word behind everything. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[9%] select-none overflow-hidden md:inset-x-auto md:right-0 md:top-auto md:bottom-[7%] md:w-[64%]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={current.category}
            className="poster-outline whitespace-nowrap text-center font-display text-[26vw] leading-none tracking-[-0.04em] md:text-right md:text-[13vw]"
            initial={{ y: "40%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-30%", opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {LABEL[current.category].toUpperCase()}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="shell relative grid min-h-svh grid-rows-[auto_auto_1fr] gap-y-6 pb-8 pt-[calc(4rem+1.25rem)] md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-x-8 md:pb-10 md:pt-[calc(4.5rem+1.5rem)]">
        {/* Copy */}
        <div className="relative z-10 md:col-span-5 md:row-start-1">
          <p className="eyebrow text-ivory/80">The Festive Edit 2026</p>
          <h1 className="mt-4 text-[clamp(2.5rem,1.4rem+4.4vw,5.5rem)] leading-[0.95] tracking-[-0.035em] md:mt-5">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-rise block" style={{ animationDelay: "0.1s" }}>
                Stitched
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.14em]">
              <span className="hero-rise block" style={{ animationDelay: "0.22s" }}>
                like <em className="italic text-rose">art</em>.
              </span>
            </span>
          </h1>

          <div className="hero-fade" style={{ animationDelay: "0.5s" }}>
            <div className="mt-4 h-14 md:mt-6" aria-live={playing ? "off" : "polite"}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={index}
                  className="text-[15px] leading-relaxed text-ivory/85 md:text-base"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <span className="font-display text-xl italic text-ivory md:text-2xl">{LABEL[current.category]}</span>
                  {from ? <span className="ml-3 text-ivory/75">from {formatPrice(from)}</span> : null}
                </motion.p>
              </AnimatePresence>
            </div>
            <HeroActions className="mt-3 md:mt-5" />
          </div>
        </div>

        {/* The deck */}
        <div
          className="relative z-10 md:col-span-7 md:row-start-1"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => {
            setHeld(false);
            px.set(0);
            py.set(0);
          }}
          onMouseMove={(e) => {
            if (reduced) return;
            const r = e.currentTarget.getBoundingClientRect();
            px.set(((e.clientX - r.left) / r.width) * 2 - 1);
            py.set(((e.clientY - r.top) / r.height) * 2 - 1);
          }}
          onFocusCapture={() => setHeld(true)}
          onBlurCapture={() => setHeld(false)}
        >
          {/* Story-style progress */}
          <div className="mx-auto mb-4 flex w-[min(72vw,26rem)] gap-1.5 md:mb-5" aria-hidden="true">
            {posters.map((p, i) => (
              <span key={p.src} className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-ivory/25">
                {i < index ? <span className="absolute inset-0 bg-ivory" /> : null}
                {i === index ? (
                  <span
                    key={`run-${index}`}
                    className="poster-progress absolute inset-0 origin-left bg-ivory"
                    style={{ animationDuration: `${DWELL_MS}ms`, animationPlayState: playing ? "running" : "paused" }}
                  />
                ) : null}
              </span>
            ))}
          </div>

          <div className="relative mx-auto aspect-[3/4] w-[min(72vw,26rem)] [perspective:1400px] md:w-[min(34vw,30rem)]">
            <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateY: tiltY, rotateX: tiltX }}>
              {posters.map((poster, i) => (
                <PosterCard
                  key={poster.src}
                  poster={poster}
                  slot={(i - index + n) % n}
                  leaving={leaving === i}
                  total={n}
                  eager={i < 2}
                  onSwipe={go}
                  fromPrice={data.catalog.fromPrice[poster.category]}
                />
              ))}
            </motion.div>
          </div>

          <div className="mx-auto mt-5 flex w-[min(72vw,26rem)] items-center justify-between md:mt-7">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/40 transition-colors hover:bg-ivory hover:text-ink"
              aria-label="Previous poster"
            >
              ←
            </button>
            <span className="eyebrow text-ivory/70">Swipe or tap the arrows</span>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/40 transition-colors hover:bg-ivory hover:text-ink"
              aria-label="Next poster"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Pose for a card `slot` places behind the top (0 = top). */
function pose(slot: number) {
  const k = Math.min(slot, DEPTH);
  return {
    x: k * 26,
    y: k * -14,
    z: k * -70,
    rotateY: k * -6,
    rotateZ: k * 2.2,
    opacity: slot > DEPTH ? 0 : 1,
  };
}

function PosterCard({
  poster,
  slot,
  leaving,
  total,
  eager,
  onSwipe,
  fromPrice,
}: {
  poster: CatalogPhoto;
  slot: number;
  leaving: boolean;
  total: number;
  eager: boolean;
  onSwipe: (dir: 1 | -1) => void;
  fromPrice?: number;
}) {
  const base = pose(slot);
  // A swipe must not also open the poster's link.
  const dragged = useRef(false);
  const href = poster.category === "festive" ? "/shop" : `/shop?category=${poster.category}`;
  const isTop = slot === 0;

  // The card that just left turns away like a page, then settles at the back.
  const animate = leaving
    ? {
        x: [0, -260, base.x],
        y: [0, 30, base.y],
        z: [0, 140, base.z],
        rotateY: [0, 68, base.rotateY],
        rotateZ: [0, -10, base.rotateZ],
        opacity: [1, 0, base.opacity],
      }
    : base;

  return (
    <motion.div
      className="absolute inset-0 [backface-visibility:hidden]"
      style={{ zIndex: leaving ? total + 1 : total - slot }}
      initial={false}
      animate={animate}
      transition={leaving ? { duration: 0.9, ease: EASE, times: [0, 0.55, 1] } : { duration: 0.8, ease: EASE }}
      drag={isTop ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.6}
      onDragStart={() => {
        dragged.current = true;
      }}
      onDragEnd={(_e, info: PanInfo) => {
        if (info.offset.x < -60) onSwipe(1);
        else if (info.offset.x > 60) onSwipe(-1);
      }}
    >
      <Link
        href={href}
        tabIndex={isTop ? 0 : -1}
        aria-hidden={isTop ? undefined : true}
        draggable={false}
        onClickCapture={(e) => {
          if (dragged.current) {
            e.preventDefault();
            dragged.current = false;
          }
        }}
        className="group relative block h-full w-full overflow-hidden rounded-[4px] bg-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)]"
      >
        <Image
          src={poster.src}
          alt={poster.alt}
          fill
          // Every poster can reach the top (and become the LCP), so none is lazy; only the
          // first two are high priority, the rest low so React does not preload them.
          loading="eager"
          fetchPriority={eager ? "high" : "low"}
          sizes="(min-width: 768px) 30rem, 72vw"
          draggable={false}
          className="object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.04]"
          style={{ objectPosition: poster.position ?? "50% 30%" }}
        />
        {/* Poster print: a deep foot for the type, a thin inner frame. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.72)_0%,transparent_45%)]" />
        <span className="absolute inset-3 rounded-[2px] border border-ivory/35 md:inset-4" />
        <span className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-3 text-ivory md:inset-x-8 md:bottom-8">
          <span>
            <span className="block text-[10px] tracking-[0.3em] text-ivory/75">KALA DORI</span>
            <span className="mt-1 block font-display text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] leading-none">
              {LABEL[poster.category]}
            </span>
          </span>
          {fromPrice ? (
            <span className="shrink-0 rounded-full bg-ivory px-3 py-1.5 text-[11px] font-medium text-ink">
              from {formatPrice(fromPrice)}
            </span>
          ) : (
            <span className="shrink-0 rounded-full border border-ivory/60 px-3 py-1.5 text-[11px]">New season</span>
          )}
        </span>
      </Link>
    </motion.div>
  );
}

/* ============================================================== poster wall */

export function PosterWall({ rows }: { rows: CatalogPhoto[][] }) {
  return (
    <section aria-labelledby="wall-title" className="relative overflow-hidden bg-[#140d0f] py-16 text-ivory md:py-24">
      <div className="shell flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-rose">New season</p>
          <h2 id="wall-title" className="mt-3 text-[clamp(1.875rem,1.3rem+2vw,3.25rem)] leading-[1.05]">
            The Festive Edit
          </h2>
        </div>
        <Link href="/shop" className="eyebrow group inline-flex min-h-11 shrink-0 items-center gap-3 text-ivory">
          <span className="link-draw py-1">Shop all</span>
          <span aria-hidden="true" className="transition-transform duration-500 ease-editorial group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      <div className="poster-wall-stage mt-10 md:mt-14">
        <div className="poster-wall-plane flex flex-col gap-3 md:gap-5">
          {rows.map((row, r) => (
            <div key={r} className="poster-wall-row group/row flex w-max" data-reverse={r % 2 === 1 ? "" : undefined}>
              {[0, 1].map((copy) => (
                <ul key={copy} className="flex shrink-0 gap-3 pr-3 md:gap-5 md:pr-5" aria-hidden={copy === 1 ? true : undefined}>
                  {row.map((photo) => (
                    <li key={`${copy}-${photo.src}`}>
                      <Link
                        href={photo.category === "festive" ? "/shop" : `/shop?category=${photo.category}`}
                        tabIndex={copy === 1 ? -1 : undefined}
                        className="group relative block aspect-[3/4] w-[9.5rem] overflow-hidden rounded-[3px] bg-ink transition-transform duration-500 ease-editorial hover:-translate-y-2 md:w-[13.5rem]"
                      >
                        <Image
                          src={photo.src}
                          alt={copy === 1 ? "" : photo.alt}
                          fill
                          sizes="(min-width: 768px) 216px, 152px"
                          className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.06]"
                        />
                        <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.6)_0%,transparent_45%)] opacity-90" />
                        <span className="absolute bottom-3 left-3 text-[10px] tracking-[0.24em] text-ivory md:bottom-4 md:left-4 md:text-[11px]">
                          {LABEL[photo.category].toUpperCase()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
