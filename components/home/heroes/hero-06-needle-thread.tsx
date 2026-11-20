"use client";

/**
 * HERO 06: "Needle & Thread" (built for the kaladori needle-and-thread logo).
 *
 * A deep maroon room. On the right (on top on phones) an arch-shaped frame,
 * like a palace window, plays the season's catalog photographs, each with a
 * slow push-in. Once, as the page opens, the logo's needle travels round the
 * arch pulling a blush thread behind it, stitching the frame; a loose thread
 * sweeps across the room behind. The copy, the actions and three collection
 * cards sit beside it (below it on phones, where the cards swipe sideways).
 *
 * Below: the catalog poster wall (shared with Hero 05).
 */
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { formatPrice } from "@/lib/utils";
import { LABEL, PosterWall } from "./hero-05-poster-deck";
import { HeroActions, heroHidden, heroShown, syncHeader } from "./story-kit";
import type { HeroData } from "./types";

const EASE = [0.22, 1, 0.36, 1] as const;
const SLIDE_MS = 4500;

/** The arch outline in the frame's own 300 × 400 box: up the left, over the top, down, along the foot. */
const ARCH = "M10 392 L10 152 A140 140 0 0 1 290 152 L290 392 Z";
/** Approximate length of ARCH (for the stroke draw). */
const ARCH_LENGTH = 1250;

export function HeroNeedleThread({ data }: { data: HeroData }) {
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
      <Opening data={data} />
      <PosterWall rows={data.catalog.wall} />
    </div>
  );
}

function Opening({ data }: { data: HeroData }) {
  const slides = data.catalog.deck;
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = !held && onScreen && !reduced;
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [playing, index, slides.length]);

  const current = slides[index];
  const from = data.catalog.fromPrice[current.category];
  const currentHref = current.category === "festive" ? "/shop" : `/shop?category=${current.category}`;

  return (
    <section
      ref={sectionRef}
      aria-label="kaladori, the Festive Edit"
      className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_75%_40%,#6b1f37_0%,#3a1220_45%,#1a1a1a_100%)] text-ivory"
    >
      <LooseThread />
      <div aria-hidden="true" className="cinema-grain absolute inset-0" />

      <div className="shell relative grid min-h-svh grid-cols-[minmax(0,1fr)] gap-y-8 pb-12 pt-[calc(4rem+1.5rem)] md:grid-cols-12 md:items-center md:gap-x-8 md:pb-14 md:pt-[calc(4.5rem+2rem)]">
        {/* The arch (first on phones) */}
        <div
          className="relative mx-auto w-[min(78vw,22rem)] md:order-2 md:col-span-5 md:col-start-8 md:w-full md:max-w-[26rem]"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
        >
          <div className="relative aspect-[3/4]">
            {/* Photographs, clipped to the arch */}
            <div className="needle-arch absolute inset-[3.33%] overflow-hidden bg-ink">
              {slides.map((slide, i) => (
                <div key={slide.src} className={i === index ? "arch-slide is-active" : "arch-slide"} aria-hidden={i !== index}>
                  <Image
                    src={slide.src}
                    alt={i === index ? slide.alt : ""}
                    fill
                    loading="eager"
                    fetchPriority={i === 0 ? "high" : "low"}
                    sizes="(min-width: 768px) 26rem, 78vw"
                    className="object-cover"
                    style={{ objectPosition: slide.position ?? "50% 30%" }}
                  />
                </div>
              ))}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(26_26_26/0.55)_0%,transparent_40%)]" />
            </div>

            {/* The needle stitching the arch (drawn once) */}
            <svg viewBox="0 0 300 400" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              <path d={ARCH} fill="none" stroke="rgb(242 184 198 / 0.18)" strokeWidth="1" />
              <path
                d={ARCH}
                fill="none"
                stroke="#f2b8c6"
                strokeWidth="2"
                strokeLinecap="round"
                className="arch-thread"
                style={{ strokeDasharray: ARCH_LENGTH, strokeDashoffset: ARCH_LENGTH }}
              />
              {reduced ? null : (
                <g className="arch-needle">
                  {/* Centred on the path, tip pointing the way it travels. */}
                  <g transform="rotate(-90) translate(-7 -11)">
                    <image href="/brand/kaladori-icon-reverse.svg" width="14" height="22" />
                  </g>
                  <animateMotion dur="3.4s" begin="0.5s" fill="freeze" rotate="auto" path={ARCH} calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.25 1" keyPoints="0;1" />
                  <animate attributeName="opacity" begin="3.9s" dur="0.6s" from="1" to="0" fill="freeze" />
                </g>
              )}
            </svg>

            {/* What is showing, and where to buy it */}
            <div className="absolute inset-x-0 -bottom-5 flex justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <Link
                    href={currentHref}
                    className="flex items-center gap-3 rounded-full bg-ivory px-4 py-2.5 text-[12px] text-ink shadow-[0_12px_30px_-12px_rgb(0_0_0/0.6)] transition-colors hover:bg-blush"
                  >
                    <span className="font-display text-[15px] italic">{LABEL[current.category]}</span>
                    {from ? <span className="text-ink/70">from {formatPrice(from)}</span> : <span className="text-ink/70">New season</span>}
                    <span aria-hidden="true">→</span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Slide progress */}
          <div className="mx-auto mt-10 flex w-2/3 gap-1.5" aria-hidden="true">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                tabIndex={-1}
                onClick={() => setIndex(i)}
                className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-ivory/20"
              >
                {i < index ? <span className="absolute inset-0 bg-blush" /> : null}
                {i === index ? (
                  <span
                    key={`run-${index}`}
                    className="poster-progress absolute inset-0 origin-left bg-blush"
                    style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: playing ? "running" : "paused" }}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Copy */}
        <div className="relative min-w-0 md:order-1 md:col-span-6">
          <p className="eyebrow text-blush">The Festive Edit 2026</p>
          <h1 className="mt-4 text-[clamp(2.5rem,1.4rem+4.6vw,5.75rem)] leading-[0.98] tracking-[-0.035em] md:mt-5">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-rise block" style={{ animationDelay: "0.1s" }}>
                The art of
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.14em]">
              <span className="hero-rise block" style={{ animationDelay: "0.22s" }}>
                the <em className="italic text-blush">thread</em>.
              </span>
            </span>
          </h1>
          <div className="hero-fade" style={{ animationDelay: "0.55s" }}>
            <p className="mt-4 max-w-[28rem] text-[15px] font-light leading-relaxed text-ivory/80 md:mt-6 md:text-[17px]">
              Handwoven sarees, kurtis and scarves, made in small runs by India&rsquo;s master weavers.
            </p>
            <HeroActions className="mt-7" />
          </div>

          <CollectionCards data={data} />
        </div>
      </div>
    </section>
  );
}

/** Three collection cards: a row on desktop, a sideways swipe on phones. */
function CollectionCards({ data }: { data: HeroData }) {
  return (
    <ul
      className="hero-fade no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 md:mx-0 md:mt-12 md:grid md:grid-cols-3 md:overflow-visible md:px-0"
      style={{ animationDelay: "0.75s" }}
    >
      {data.collections.map((c) => {
        const from = data.catalog.fromPrice[c.slug];
        const thumb = c.products[0]?.image ?? c.photo.src;
        return (
          <li key={c.slug} className="w-[62vw] max-w-[15rem] shrink-0 snap-start md:w-auto md:max-w-none">
            <Link
              href={`/shop?category=${c.slug}`}
              className="group flex items-center gap-3 rounded-[4px] border border-ivory/15 bg-ivory/[0.06] p-2.5 backdrop-blur-sm transition-colors hover:border-blush/60 hover:bg-ivory/10"
            >
              <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-[2px] bg-ink">
                <Image src={thumb} alt="" fill sizes="48px" className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-110" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-lg leading-tight">{c.name}</span>
                <span className="mt-0.5 block text-[12px] text-ivory/65">
                  {from ? `from ${formatPrice(from)}` : `${c.count} pieces`}
                </span>
              </span>
              <span aria-hidden="true" className="ml-auto pr-1 text-blush transition-transform duration-500 ease-editorial group-hover:translate-x-1">
                →
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** A loose blush thread sweeping across the room, drawn once as the page opens. */
function LooseThread() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      fill="none"
    >
      <path
        d="M-20 760 C 220 700, 360 840, 560 780 S 860 560, 1000 640 S 1260 860, 1460 720"
        stroke="rgb(242 184 198 / 0.35)"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
        className="loose-thread"
        pathLength={1}
      />
    </svg>
  );
}
