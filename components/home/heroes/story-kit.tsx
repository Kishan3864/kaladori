"use client";

/**
 * Shared parts of the home hero variants (see ./registry.ts): the pinned
 * scroll timeline, the header hand-off, the collection copy blocks and the
 * Sarees / Kurtis / Pants step nav. Each variant brings its own visuals.
 */
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { scrollToY } from "@/components/motion/smooth-scroll";
import { cn, formatPrice } from "@/lib/utils";
import type { StoryCollection } from "./types";

export const STAGES = 3;

export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Scroll progress (0..1) to stage position: holds on each stage, eases between them. */
export function toStage(p: number) {
  const s = clamp01(p) * STAGES;
  const i = Math.min(STAGES - 1, Math.floor(s));
  return i + smooth(0.2, 0.8, s - i);
}

/**
 * The pinned timeline every variant runs on: a tall track whose scroll
 * progress becomes a stage value 0 (hero) .. 3 (pants). Also keeps the header
 * in its transparent "over the hero" mode until the track has scrolled away.
 */
export function useStoryTimeline() {
  const trackRef = useRef<HTMLElement>(null);
  const { scrollYProgress, scrollY } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const stage = useTransform(scrollYProgress, toStage);

  useMotionValueEvent(scrollY, "change", () => syncHeader(trackRef.current));
  useEffect(() => {
    heroShown();
    syncHeader(trackRef.current);
    return heroHidden;
  }, []);

  function goTo(k: number) {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + (k / STAGES) * (track.offsetHeight - window.innerHeight));
  }

  return { trackRef, stage, goTo };
}

/**
 * The header's "over the dark hero" look is keyed on #home-story being in the
 * page (CSS :has), which is right on first paint. But Next keeps a visited
 * page alive, hidden, for instant back navigation, so the hero can be in the
 * DOM while another page shows. Heroes therefore mark themselves off-screen
 * (data-hero-off on <html>) when they unmount or hide, and on again on mount.
 */
export function heroShown() {
  delete document.documentElement.dataset.heroOff;
}

export function heroHidden() {
  const root = document.documentElement;
  delete root.dataset.heroPast;
  root.dataset.heroOff = "";
}

export function syncHeader(track: HTMLElement | null) {
  if (!track) return;
  const past = track.getBoundingClientRect().bottom <= 72;
  const root = document.documentElement;
  if (past) root.dataset.heroPast = "";
  else delete root.dataset.heroPast;
}

/* --------------------------------------------------------------- copy blocks */

export function StageBlock({
  index,
  stage,
  onFocus,
  className,
  children,
}: {
  index: number;
  stage: MotionValue<number>;
  onFocus: (k: number) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const d = useTransform(stage, (s) => s - index);
  const opacity = useTransform(d, (v) => Math.max(0, 1 - Math.abs(v) * 2.6));
  const y = useTransform(d, (v) => v * -80);
  const rotateX = useTransform(d, (v) => v * 32);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  return (
    <motion.div
      className={cn("absolute z-10 origin-bottom", className)}
      style={{ opacity, y, rotateX, pointerEvents, transformPerspective: 1200 }}
      onFocusCapture={() => {
        if (Math.abs(stage.get() - index) > 0.3) onFocus(index);
      }}
    >
      {children}
    </motion.div>
  );
}

export function CollectionCopy({ collection }: { collection: StoryCollection }) {
  return (
    <div className="max-w-xl">
      <h2 className="text-[clamp(2.75rem,1.6rem+4.6vw,6rem)] leading-[0.95] tracking-[-0.035em]">{collection.name}</h2>
      <p className="mt-2 font-display text-lg italic text-ivory/85 md:mt-3 md:text-2xl">{collection.tagline}</p>
      <p className="mt-3 max-w-[26rem] text-[14px] leading-relaxed text-ivory/80 md:text-[15px]">{collection.copy}</p>

      <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-4 md:mt-7">
        <ul className="flex gap-2">
          {collection.products.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/product/${product.slug}`}
                className="group block"
                aria-label={`${product.name}, ${formatPrice(product.price)}`}
              >
                <span className="relative block h-16 w-12 overflow-hidden bg-ivory/10 ring-1 ring-ivory/25 md:h-20 md:w-[3.75rem]">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="60px"
                    className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-110"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={`/shop?category=${collection.slug}`}
          className="btn group border border-ivory bg-ivory text-ink hover:border-blush hover:bg-blush"
        >
          Shop {collection.name.toLowerCase()}
          <span className="tabular-nums opacity-60">({collection.count})</span>
          <span aria-hidden="true" className="transition-transform duration-500 ease-editorial group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- stage nav */

export function StageNav({
  names,
  stage,
  onSelect,
}: {
  names: string[];
  stage: MotionValue<number>;
  onSelect: (k: number) => void;
}) {
  const [active, setActive] = useState(0);
  useMotionValueEvent(stage, "change", (s) => setActive(Math.round(s)));

  return (
    <nav aria-label="Collections" className="relative z-10 flex h-16 shrink-0 items-center gap-6 md:h-20 md:gap-10">
      {names.map((name, i) => (
        <NavItem key={name} name={name} index={i + 1} stage={stage} active={active === i + 1} onSelect={onSelect} />
      ))}
    </nav>
  );
}

function NavItem({
  name,
  index,
  stage,
  active,
  onSelect,
}: {
  name: string;
  index: number;
  stage: MotionValue<number>;
  active: boolean;
  onSelect: (k: number) => void;
}) {
  const fill = useTransform(stage, (s) => clamp01(s - (index - 1)));
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-current={active ? "step" : undefined}
      className={cn(
        "flex min-h-11 flex-col justify-center gap-2 text-left transition-opacity duration-500",
        active ? "opacity-100" : "opacity-60 hover:opacity-100",
      )}
    >
      <span className="eyebrow">{name}</span>
      <span className="relative block h-px w-14 bg-ivory/30 md:w-20">
        <motion.span className="absolute inset-0 origin-left bg-ivory" style={{ scaleX: fill }} />
      </span>
    </button>
  );
}

/** Primary hero CTA pair, ivory on dark. */
export function HeroActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-7 gap-y-3", className)}>
      <Link href="/shop" className="btn group border border-ivory bg-ivory text-ink hover:border-blush hover:bg-blush">
        Shop the collection
        <span aria-hidden="true" className="transition-transform duration-500 ease-editorial group-hover:translate-x-1">
          →
        </span>
      </Link>
      <Link href="/about" className="eyebrow link-draw py-1 text-ivory">
        Our story
      </Link>
    </div>
  );
}
