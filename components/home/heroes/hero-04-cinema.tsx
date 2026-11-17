"use client";

/**
 * HERO 04: "Cinema".
 *
 * Part 1, the opening: the background plays like a brand film. The three
 * collection photographs cross-fade on a loop, each with a slow cinematic
 * push-in and pan (pure CSS, so it runs before hydration and cannot fail).
 * The bold lotus logo arrives in the centre; a player bar at the foot shows
 * which collection is on screen, its line filling while that shot plays.
 * Scrolling away, the whole opening recedes like a card tipping back in 3D.
 *
 * Part 2, collections in 3D: three large photo panels in a row. Vertical
 * scroll pans them sideways (pinned), and each panel turns in 3D as it
 * passes the centre, its photo drifting inside the frame (coverflow).
 */
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CollectionCopy, HeroActions, heroHidden, heroShown, syncHeader } from "./story-kit";
import type { HeroData, StoryCollection } from "./types";

/** Seconds each collection is on screen in the opening reel. */
const SHOT = 6;

export function HeroCinema({ data }: { data: HeroData }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Header stays transparent over the dark opening and the 3D collections.
  useMotionValueEvent(scrollY, "change", () => syncHeader(wrapRef.current));
  useEffect(() => {
    heroShown();
    syncHeader(wrapRef.current);
    return heroHidden;
  }, []);

  return (
    <div id="home-story" ref={wrapRef} className="relative -mt-16 bg-[#100a0c] md:-mt-[4.5rem]">
      <Opening collections={data.collections} />
      <CollectionsPan collections={data.collections} />
    </div>
  );
}

/* ================================================================ opening */

function Opening({ collections }: { collections: StoryCollection[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Recede like a card tipping back as the page scrolls on.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const radius = useTransform(scrollYProgress, [0, 0.4], [0, 28]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.55]);
  const total = collections.length * SHOT;

  return (
    <section ref={ref} aria-label="KalaDori" className="relative h-svh [perspective:1400px]">
      <motion.div
        className="absolute inset-0 origin-top overflow-hidden"
        style={{ scale, rotateX, borderRadius: radius }}
      >
        {/* The reel: one shot per collection, looping. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[#100a0c]">
          {collections.map((c, i) => (
            <div
              key={c.slug}
              className="cinema-shot absolute inset-0"
              style={
                {
                  "--total": `${total}s`,
                  animationDelay: `${i * SHOT - 1}s`,
                } as React.CSSProperties
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- optimised props from getImageProps */}
              <img
                {...c.photoImg}
                alt=""
                loading="eager"
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
                className={`cinema-img cinema-pan-${i % 3} absolute inset-0 h-full w-full object-cover`}
                style={{ objectPosition: c.photo.position ?? "50% 30%", animationDelay: `${i * SHOT - 1}s`, "--total": `${total}s` } as React.CSSProperties}
              />
            </div>
          ))}
        </div>

        {/* Film finish: vignette, a darker foot for the player bar, fine grain. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_45%,rgb(16_10_12/0.15)_0%,rgb(16_10_12/0.55)_70%,rgb(16_10_12/0.85)_100%),linear-gradient(to_top,rgb(16_10_12/0.85)_0%,transparent_35%)]"
        />
        <div aria-hidden="true" className="cinema-grain absolute inset-0" />
        <motion.div aria-hidden="true" className="absolute inset-0 bg-[#100a0c]" style={{ opacity: shade }} />

        <motion.div
          className="shell relative flex h-full flex-col text-ivory"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <div className="h-16 shrink-0 md:h-[4.5rem]" />
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="cinema-logo w-[min(78vw,30rem)]">
              <span className="sr-only">KalaDori, stitched like art</span>
              <Image
                src="/brand/svg/logo-stacked-dark.svg"
                alt=""
                width={486}
                height={327}
                priority
                unoptimized
                className="h-auto w-full drop-shadow-[0_6px_40px_rgb(0_0_0/0.5)]"
              />
            </h1>
            <div className="hero-fade flex flex-col items-center" style={{ animationDelay: "0.9s" }}>
              <p className="mt-6 max-w-[26rem] text-[15px] font-light leading-relaxed text-ivory/85 md:text-base">
                Handwoven sarees, kurtis and tailored pants, made in small runs by India&rsquo;s master weavers.
              </p>
              <HeroActions className="mt-7 justify-center" />
            </div>
          </div>

          <PlayerBar collections={collections} total={total} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/** "Sarees · Kurtis · Pants" with a line that fills while that collection's shot plays. */
function PlayerBar({ collections, total }: { collections: StoryCollection[]; total: number }) {
  return (
    <nav aria-label="Collections" className="grid shrink-0 grid-cols-3 gap-4 pb-6 md:gap-8 md:pb-9">
      {collections.map((c, i) => (
        <Link key={c.slug} href={`/shop?category=${c.slug}`} className="group flex min-h-11 flex-col justify-end gap-2.5">
          <span className="flex items-baseline justify-between gap-2">
            <span className="eyebrow text-ivory">{c.name}</span>
            <span className="hidden text-[12px] text-ivory/60 transition-colors group-hover:text-ivory sm:inline">
              {c.count} pieces
            </span>
          </span>
          <span className="relative block h-px w-full bg-ivory/25">
            <span
              className="cinema-progress absolute inset-0 origin-left bg-ivory"
              style={{ animationDelay: `${i * SHOT - 1}s`, "--total": `${total}s` } as React.CSSProperties}
            />
          </span>
        </Link>
      ))}
    </nav>
  );
}

/* ====================================================== collections in 3D */

function CollectionsPan({ collections }: { collections: StoryCollection[] }) {
  const trackRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const [dims, setDims] = useState({ vw: 1440, panel: 900, gap: 56, pad: 56 });

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const measure = () => {
      const first = row.firstElementChild as HTMLElement | null;
      const second = first?.nextElementSibling as HTMLElement | null;
      if (!first) return;
      const panel = first.offsetWidth;
      const gap = second ? second.offsetLeft - first.offsetLeft - panel : 0;
      setDims({ vw: window.innerWidth, panel, gap, pad: first.offsetLeft });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const n = collections.length;
  // Pan from the first panel centred to the last panel centred.
  const firstCentre = dims.pad + dims.panel / 2;
  const travel = (n - 1) * (dims.panel + dims.gap);
  const x = useTransform(scrollYProgress, (p) => dims.vw / 2 - firstCentre - p * travel);

  return (
    <section ref={trackRef} aria-labelledby="pan-title" className="relative h-[300svh]">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden text-ivory">
        <div className="h-16 shrink-0 md:h-[4.5rem]" />
        <div className="shell flex items-end justify-between gap-6 pb-5 md:pb-8">
          <h2 id="pan-title" className="text-[clamp(1.625rem,1.2rem+1.5vw,2.5rem)] leading-[1.1]">
            Shop by collection
          </h2>
          <PanCounter progress={scrollYProgress} n={n} />
        </div>
        <div className="relative min-h-0 flex-1 [perspective:1600px]">
          <motion.div ref={rowRef} className="absolute inset-y-0 left-0 flex items-stretch gap-[4vw] pb-8 pl-[6vw] md:pb-12" style={{ x }}>
            {collections.map((c, i) => (
              <Panel key={c.slug} collection={c} index={i} x={x} dims={dims} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PanCounter({ progress, n }: { progress: MotionValue<number>; n: number }) {
  const [i, setI] = useState(1);
  useMotionValueEvent(progress, "change", (p) => setI(Math.min(n, Math.round(p * (n - 1)) + 1)));
  return (
    <p className="eyebrow tabular-nums text-ivory/70" aria-hidden="true">
      {i} / {n}
    </p>
  );
}

function Panel({
  collection,
  index,
  x,
  dims,
}: {
  collection: StoryCollection;
  index: number;
  x: MotionValue<number>;
  dims: { vw: number; panel: number; gap: number; pad: number };
}) {
  // d: this panel's distance from the screen centre, in screen widths (0 = centred).
  const d = useTransform(x, (v) => {
    const centre = v + dims.pad + index * (dims.panel + dims.gap) + dims.panel / 2;
    return (centre - dims.vw / 2) / dims.vw;
  });
  const rotateY = useTransform(d, (v) => Math.max(-35, Math.min(35, v * -38)));
  const scale = useTransform(d, (v) => 1 - Math.min(0.14, Math.abs(v) * 0.16));
  const photoX = useTransform(d, (v) => `${Math.max(-12, Math.min(12, v * -14))}%`);
  const shade = useTransform(d, (v) => Math.min(0.6, Math.abs(v) * 0.7));
  const copyOpacity = useTransform(d, (v) => Math.max(0, 1 - Math.abs(v) * 2.2));

  return (
    <motion.article
      className="relative h-full w-[86vw] shrink-0 overflow-hidden rounded-[3px] md:w-[64vw]"
      style={{ rotateY, scale }}
      aria-label={collection.name}
    >
      <motion.div className="absolute inset-y-0 -left-[14%] -right-[14%]" style={{ x: photoX }}>
        <Image
          src={collection.photo.src}
          alt={collection.photo.alt}
          fill
          // Eager (no lazy-load LCP warning) but low priority: React then skips its automatic
          // preload, which would warn that the photo was not used within a few seconds.
          loading="eager"
          fetchPriority="low"
          sizes="(min-width: 768px) 80vw, 100vw"
          className="object-cover"
          style={{ objectPosition: collection.photo.position ?? "50% 30%" }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(16_10_12/0.88)_0%,rgb(16_10_12/0.3)_45%,transparent_70%)]" />
      <motion.div className="absolute inset-0 bg-[#100a0c]" style={{ opacity: shade }} />
      <motion.div className="absolute inset-x-0 bottom-0 p-5 md:p-10" style={{ opacity: copyOpacity }}>
        <CollectionCopy collection={collection} />
      </motion.div>
    </motion.article>
  );
}
