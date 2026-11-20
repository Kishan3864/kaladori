"use client";

/**
 * HERO 07: "Atelier" (white, minimal).
 *
 * A white page. One centred line, "The art of the thread.", with a maroon
 * thread drawing itself underneath (like the thread under the logo), one
 * action, then five tall photographs side by side across the full width
 * like an accordion: one opens wide while the others narrow to slim strips.
 * It moves on by itself every few seconds; pointing at a photo opens it.
 * The header keeps its normal light look (no dark-hero mode).
 *
 * Below: an editorial grid, one large photograph and two smaller ones.
 */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { CatalogPhoto } from "@/lib/images";
import { cn, formatPrice } from "@/lib/utils";
import { LABEL } from "./hero-05-poster-deck";
import type { HeroData } from "./types";

const CYCLE_MS = 4000;

export function HeroAtelier({ data }: { data: HeroData }) {
  return (
    <>
      <Opening data={data} />
      <EditorialGrid data={data} />
    </>
  );
}

/* ================================================================ opening */

function Opening({ data }: { data: HeroData }) {
  // Five looks across the collections (sarees, kurtis, festive, scarves, co-ords).
  const looks = [0, 1, 2, 3, 5].map((i) => data.catalog.deck[i]).filter(Boolean);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (held || !onScreen || reduced) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % looks.length), CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [held, onScreen, reduced, active, looks.length]);

  return (
    <section ref={ref} aria-label="kaladori" className="bg-ivory pb-10 pt-10 md:pb-16 md:pt-14">
      <div className="shell text-center">
        <p className="hero-fade eyebrow text-maroon" style={{ animationDelay: "0.05s" }}>
          The Festive Edit 2026
        </p>
        <h1 className="mx-auto mt-4 max-w-4xl text-[clamp(2.5rem,1.3rem+4.8vw,6rem)] leading-[1] tracking-[-0.035em] text-ink md:mt-5">
          <span className="block overflow-hidden pb-[0.12em]">
            <span className="hero-rise block" style={{ animationDelay: "0.12s" }}>
              The art of the <em className="italic text-maroon">thread</em>.
            </span>
          </span>
        </h1>
        {/* The thread from the logo, drawn under the line */}
        <svg viewBox="0 0 600 40" aria-hidden="true" className="mx-auto -mt-1 h-6 w-[min(80vw,34rem)] md:h-8" fill="none">
          <path
            d="M6 14 C 40 4, 60 34, 96 28 S 300 30, 420 30 S 580 34, 590 10 C 594 2, 586 0, 582 8"
            stroke="var(--color-maroon)"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            className="loose-thread"
          />
        </svg>
        <div className="hero-fade mt-6 flex justify-center md:mt-8" style={{ animationDelay: "0.5s" }}>
          <Link href="/shop" className="btn btn-ink group">
            Shop the collection
            <span aria-hidden="true" className="transition-transform duration-500 ease-editorial group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

      {/* The accordion of looks */}
      <div className="mt-10 px-3 md:mt-14 md:px-6 xl:px-10">
        <ul
          className="hero-fade mx-auto flex h-[min(52svh,34rem)] max-w-[1600px] gap-1.5 md:h-[min(62svh,40rem)] md:gap-2.5"
          style={{ animationDelay: "0.7s" }}
          onMouseLeave={() => setHeld(false)}
        >
          {looks.map((look, i) => (
            <Panel
              key={look.src}
              look={look}
              open={i === active}
              eager={i < 2}
              from={data.catalog.fromPrice[look.category]}
              onActivate={() => {
                setActive(i);
                setHeld(true);
              }}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Panel({
  look,
  open,
  eager,
  from,
  onActivate,
}: {
  look: CatalogPhoto;
  open: boolean;
  eager: boolean;
  from?: number;
  onActivate: () => void;
}) {
  const href = look.category === "festive" ? "/shop" : `/shop?category=${look.category}`;
  return (
    <li
      className={cn("atelier-panel relative min-w-0 overflow-hidden rounded-[6px] bg-sand", open && "is-open")}
      onMouseEnter={onActivate}
    >
      <Link href={href} onFocus={onActivate} className="group absolute inset-0 block" aria-label={`${LABEL[look.category]}, shop now`}>
        <Image
          src={look.src}
          alt={look.alt}
          fill
          loading="eager"
          fetchPriority={eager ? "high" : "low"}
          sizes="(min-width: 768px) 60vw, 70vw"
          className="object-cover transition-transform duration-[1600ms] ease-editorial group-hover:scale-[1.03]"
          style={{ objectPosition: look.position ?? "50% 30%" }}
        />
        <span className="atelier-shade absolute inset-0 bg-[linear-gradient(to_top,rgb(26_26_26/0.6)_0%,transparent_45%)]" />
        <span className="atelier-label absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-ivory md:inset-x-6 md:bottom-6">
          <span>
            <span className="block font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-none">{LABEL[look.category]}</span>
            <span className="mt-1.5 block text-[13px] text-ivory/85">{from ? `from ${formatPrice(from)}` : "New season"}</span>
          </span>
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory text-ink transition-transform duration-500 ease-editorial group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </li>
  );
}

/* ========================================================= editorial grid */

/** One large photograph and two smaller ones: the season at a glance. */
function EditorialGrid({ data }: { data: HeroData }) {
  const flat = data.catalog.wall.flat();
  const pick = (src: string) => flat.find((p) => p.src.includes(src));
  const big = pick("photo-1654764746225");
  const a = pick("photo-1679006831648");
  const b = pick("photo-1764928947261");
  if (!big || !a || !b) return null;

  const tiles = [
    { photo: big, title: "Festive & bridal", line: "Lehengas, silk and gold for the big days.", href: "/shop", className: "md:row-span-2" },
    { photo: a, title: "Silk sarees", line: "Banarasi and Chanderi, woven by hand.", href: "/shop?category=sarees", className: "" },
    { photo: b, title: "Co-ord sets", line: "Printed kurta sets, ready to wear.", href: "/shop?category=kurtis", className: "" },
  ];

  return (
    <section aria-labelledby="edit-title" className="bg-ivory pb-16 md:pb-24">
      <div className="shell">
        <Reveal y={16} className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-10 md:pt-14">
          <h2 id="edit-title" className="text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-[1.05]">
            Shop the season
          </h2>
          <Link href="/shop" className="eyebrow group inline-flex min-h-11 items-center gap-3">
            <span className="link-draw py-1">View everything</span>
            <span aria-hidden="true" className="text-maroon transition-transform duration-500 ease-editorial group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-3 md:mt-10 md:h-[min(80svh,46rem)] md:grid-cols-2 md:grid-rows-2 md:gap-4">
          {tiles.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08} y={24} className={cn("min-h-0", t.className)}>
              <Link
                href={t.href}
                className={cn(
                  "group relative block h-full overflow-hidden rounded-[6px] bg-sand",
                  i === 0 ? "aspect-[4/5] md:aspect-auto" : "aspect-[16/11] md:aspect-auto",
                )}
              >
                <Image
                  src={t.photo.src}
                  alt={t.photo.alt}
                  fill
                  sizes={i === 0 ? "(min-width: 768px) 48vw, 100vw" : "(min-width: 768px) 48vw, 100vw"}
                  className="object-cover transition-transform duration-[1600ms] ease-editorial group-hover:scale-[1.04]"
                  style={{ objectPosition: "50% 25%" }}
                />
                <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(26_26_26/0.55)_0%,transparent_50%)]" />
                <span className="absolute inset-x-5 bottom-5 text-ivory md:inset-x-7 md:bottom-7">
                  <span className="block font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.5rem)] leading-none">{t.title}</span>
                  <span className="mt-2 block max-w-xs text-[14px] text-ivory/85">{t.line}</span>
                  <span className="eyebrow mt-4 inline-flex items-center gap-2 text-ivory">
                    Shop now <span aria-hidden="true" className="transition-transform duration-500 ease-editorial group-hover:translate-x-1">→</span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
