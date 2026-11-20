"use client";

/**
 * HERO 03: "Gallery Flight".
 *
 * Real-time 3D (WebGL): the camera glides forward through a dark room of
 * floating photographs. The season's pieces hang at different depths around
 * the path; each collection has a large photograph on the path that fills the
 * screen when the camera stops in front of it, then dissolves as the camera
 * flies on through it to the next. One continuous move, with inertia, and a
 * silk-like ripple on every photo while moving. The opening is the lotus
 * logo stitching itself in gold over "Stitched like art."
 *
 * Without WebGL2 (or if it fails), the collection photographs cross-fade
 * instead, so the section always works.
 */
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { FlightHandle } from "@/lib/3d/gallery-flight";
import { clamp01, CollectionCopy, HeroActions, StageBlock, StageNav, useStoryTimeline } from "./story-kit";
import type { HeroData, StoryCollection } from "./types";

const BACKGROUND = "#120c0e";

export function HeroGalleryFlight({ data }: { data: HeroData }) {
  const { collections } = data;
  const { trackRef, stage, goTo } = useStoryTimeline();
  const [failed, setFailed] = useState(false);

  return (
    <section
      id="home-story"
      ref={trackRef}
      aria-label="KalaDori collections"
      className="relative -mt-16 h-[420svh] md:-mt-[4.5rem]"
    >
      <div className="sticky top-0 h-svh overflow-hidden text-ivory" style={{ backgroundColor: BACKGROUND }}>
        <FlightCanvas data={data} stage={stage} onFail={() => setFailed(true)} />
        {failed ? <FallbackPhotos collections={collections} stage={stage} /> : null}

        {/* Legibility: deeper at the foot for the copy, a soft vignette all round. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgb(18_12_14/0.75)_100%),linear-gradient(to_top,rgb(18_12_14/0.85)_0%,rgb(18_12_14/0.25)_35%,transparent_60%)]"
        />

        <div className="shell relative flex h-full flex-col">
          <div className="h-16 shrink-0 md:h-[4.5rem]" />

          <div className="relative min-h-0 flex-1">
            <StageBlock
              index={0}
              stage={stage}
              onFocus={goTo}
              className="inset-0 flex flex-col items-center justify-center text-center"
            >
              <HeroCopy />
            </StageBlock>
            {collections.map((collection, i) => (
              <StageBlock
                key={collection.slug}
                index={i + 1}
                stage={stage}
                onFocus={goTo}
                className="inset-x-0 bottom-0 pb-4 md:pb-8"
              >
                <CollectionCopy collection={collection} />
              </StageBlock>
            ))}
          </div>

          <StageNav names={collections.map((c) => c.name)} stage={stage} onSelect={goTo} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- canvas */

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

function pickWidth(candidates: { width: number; url: string }[]) {
  // Enough pixels to cover the screen at its pixel ratio, capped at 3840 (4K).
  const need = Math.min(3840, Math.round(window.innerWidth * Math.min(window.devicePixelRatio || 1, 2)) * 1.1);
  return (candidates.find((c) => c.width >= need) ?? candidates[candidates.length - 1])?.url ?? "";
}

function FlightCanvas({ data, stage, onFail }: { data: HeroData; stage: MotionValue<number>; onFail: () => void }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const failRef = useRef(onFail);
  useEffect(() => {
    failRef.current = onFail;
  }, [onFail]);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) {
      failRef.current();
      return;
    }

    let cancelled = false;
    let handle: FlightHandle | null = null;
    let unsubscribe: (() => void) | undefined;

    const start = async () => {
      try {
        const { mountGalleryFlight } = await import("@/lib/3d/gallery-flight");
        if (cancelled) return;
        handle = mountGalleryFlight(slot, {
          background: BACKGROUND,
          products: data.textures.products,
          landmarks: data.textures.landmarks.map((l) => ({ url: pickWidth(l.candidates), aspect: l.aspect })),
        });
        if (!handle) {
          failRef.current();
          return;
        }
        handle.setStage(stage.get());
        unsubscribe = stage.on("change", (s) => handle?.setStage(s));
      } catch {
        if (!cancelled) failRef.current();
      }
    };

    const w = window as IdleWindow;
    const idleId = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 1200 }) : undefined;
    const timeoutId = idleId === undefined ? window.setTimeout(start, 300) : undefined;

    return () => {
      cancelled = true;
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      unsubscribe?.();
      handle?.dispose();
    };
  }, [data, stage]);

  return <div ref={slotRef} aria-hidden="true" className="absolute inset-0" />;
}

/* ----------------------------------------------------------------- fallback */

function FallbackPhotos({ collections, stage }: { collections: StoryCollection[]; stage: MotionValue<number> }) {
  return (
    <>
      {collections.map((c, i) => (
        <FallbackPhoto key={c.slug} collection={c} index={i + 1} stage={stage} />
      ))}
    </>
  );
}

function FallbackPhoto({ collection, index, stage }: { collection: StoryCollection; index: number; stage: MotionValue<number> }) {
  const opacity = useTransform(stage, (s) => clamp01(1 - Math.abs(s - index) * 1.6));
  const scale = useTransform(stage, (s) => 1.08 - clamp01(1 - Math.abs(s - index)) * 0.08);
  return (
    <motion.div aria-hidden="true" className="absolute inset-0 overflow-hidden" style={{ opacity }}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- optimised props from getImageProps */}
        <img
          {...collection.photoImg}
          alt=""
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: collection.photo.position ?? "50% 30%" }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- hero copy */

/** The lotus mark (from the logo pack), stitching itself: each petal's running stitch travels. */
function StitchedLotus() {
  const petals = [
    "M120 40C150 80 150 140 120 184C90 140 90 80 120 40Z",
    "M118 184C70 176 46 136 52 92C88 104 112 140 118 184Z",
    "M122 184C170 176 194 136 188 92C152 104 128 140 122 184Z",
  ];
  const leaves = [
    "M114 186C70 190 30 172 14 148C50 146 90 160 114 186Z",
    "M126 186C170 190 210 172 226 148C190 146 150 160 126 186Z",
  ];
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" className="lotus-stitch h-20 w-20 md:h-24 md:w-24">
      {petals.map((d, i) => (
        <path key={d} d={d} className="lotus-petal" style={{ animationDelay: `${0.15 + i * 0.18}s` }} stroke="#d9b26f" />
      ))}
      {leaves.map((d, i) => (
        <path key={d} d={d} className="lotus-petal" style={{ animationDelay: `${0.7 + i * 0.12}s` }} stroke="#f3ece4" />
      ))}
      <path d="M40 212H200" className="lotus-rule" stroke="#f3ece4" strokeWidth={5} style={{ animationDelay: "1s" }} />
      <path d="M70 226H170" className="lotus-rule" stroke="#d9b26f" strokeWidth={4} style={{ animationDelay: "1.15s" }} />
    </svg>
  );
}

function HeroCopy() {
  return (
    <div className="flex flex-col items-center">
      <StitchedLotus />
      <h1 className="mt-5 text-[clamp(2.75rem,1.5rem+5.2vw,6.75rem)] leading-[0.95] tracking-[-0.035em] [text-shadow:0_2px_40px_rgb(0_0_0/0.45)] md:mt-7">
        <span className="block overflow-hidden pb-[0.06em]">
          <span className="hero-rise block" style={{ animationDelay: "0.35s" }}>
            Stitched
          </span>
        </span>
        <span className="block overflow-hidden pb-[0.14em]">
          <span className="hero-rise block" style={{ animationDelay: "0.48s" }}>
            like <em className="italic text-rose">art</em>.
          </span>
        </span>
      </h1>
      <div className="hero-fade flex flex-col items-center" style={{ animationDelay: "0.8s" }}>
        <p className="mt-4 max-w-[26rem] text-[15px] font-light leading-relaxed text-ivory/80 md:mt-5 md:text-base">
          Handwoven sarees, kurtis and scarves, made in small runs by India&rsquo;s master weavers.
        </p>
        <HeroActions className="mt-7 justify-center" />
      </div>
    </div>
  );
}
