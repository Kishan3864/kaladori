"use client";

/**
 * HERO 02: "Pleats".
 *
 * The screen is cut into vertical strips like the pleats of a saree. Each
 * strip is a four-sided prism in CSS 3D carrying a slice of four photographs
 * (campaign, Sarees, Kurtis, Pants). Scrolling turns the prisms a quarter
 * turn each, one after another left to right, so the next photograph is
 * folded into place pleat by pleat. At rest the pleats sway a little, and the
 * whole wall leans toward a fine pointer.
 */
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { clamp01, CollectionCopy, HeroActions, smooth, STAGES, StageBlock, StageNav, useStoryTimeline } from "./story-kit";
import type { HeroData, ImgProps } from "./types";

const PLEATS = 7;
/** How far the turn travels across the wall (0 = all together, 1 = one after another). */
const STAGGER = 0.7;

type Face = { img: ImgProps; position: string };

export function HeroPleats({ data }: { data: HeroData }) {
  const { collections, heroPhoto } = data;
  const { trackRef, stage, goTo } = useStoryTimeline();
  const faces: Face[] = [
    { img: heroPhoto.img, position: heroPhoto.position ?? "50% 30%" },
    ...collections.map((c) => ({ img: c.photoImg, position: c.photo.position ?? "50% 30%" })),
  ];

  return (
    <section
      id="home-story"
      ref={trackRef}
      aria-label="KalaDori collections"
      className="relative -mt-16 h-[400svh] md:-mt-[4.5rem]"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-[#120c0e] text-ivory">
        <PleatWall faces={faces} stage={stage} />

        {/* Legibility: dark at the foot for the copy, a little at the top for the header. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(18_12_14/0.9)_0%,rgb(18_12_14/0.45)_38%,transparent_65%),linear-gradient(to_bottom,rgb(18_12_14/0.5)_0%,transparent_18%)]"
        />

        <div className="shell relative flex h-full flex-col">
          <div className="h-16 shrink-0 md:h-[4.5rem]" />

          <div className="relative min-h-0 flex-1">
            <StageBlock index={0} stage={stage} onFocus={goTo} className="inset-x-0 bottom-0 pb-4 md:pb-8">
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

/* ---------------------------------------------------------------- the wall */

function PleatWall({ faces, stage }: { faces: Face[]; stage: MotionValue<number> }) {
  const wallRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Strip and wall widths in px: translateZ cannot take percentages.
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const ro = new ResizeObserver(() => {
      const w = wall.clientWidth;
      wall.style.setProperty("--W", `${w}px`);
      wall.style.setProperty("--w", `${w / PLEATS}px`);
    });
    ro.observe(wall);
    return () => ro.disconnect();
  }, []);

  // The wall leans a few degrees toward a fine pointer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, (v) => v * 3), { stiffness: 60, damping: 20 });
  const rotateX = useSpring(useTransform(py, (v) => v * -2), { stiffness: 60, damping: 20 });
  useEffect(() => {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduced]);

  return (
    <div aria-hidden="true" className="pleat-stage absolute inset-0">
      <motion.div ref={wallRef} className="pleat-wall" style={{ rotateX, rotateY }}>
        {Array.from({ length: PLEATS }, (_, i) => (
          <Pleat key={i} index={i} faces={faces} stage={stage} reduced={reduced} />
        ))}
      </motion.div>
    </div>
  );
}

function Pleat({
  index,
  faces,
  stage,
  reduced,
}: {
  index: number;
  faces: Face[];
  stage: MotionValue<number>;
  reduced: boolean;
}) {
  // Read live inside the transform (the flag settles after hydration).
  const reducedRef = useRef(reduced);
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  // Quarter turn per stage, travelling across the wall from left to right.
  const angle = useTransform(stage, (s) => {
    const k = Math.min(STAGES - 1, Math.floor(s));
    const t = s - k;
    const local = clamp01(t * (1 + STAGGER) - (STAGGER * index) / (PLEATS - 1));
    const eased = reducedRef.current ? (t >= 0.5 ? 1 : 0) : smooth(0, 1, local);
    return -90 * (k + eased);
  });

  return (
    <div className="pleat" style={{ "--i": index } as React.CSSProperties}>
      {/* Set back by half a pleat, so the front face sits flush with the screen. */}
      <div className="pleat-depth">
        <motion.div className="pleat-prism" style={{ rotateY: angle }}>
          {faces.map((face, k) => (
            <PleatFace key={k} face={face} k={k} index={index} angle={angle} eager={k === 0} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function PleatFace({
  face,
  k,
  index,
  angle,
  eager,
}: {
  face: Face;
  k: number;
  index: number;
  angle: MotionValue<number>;
  eager: boolean;
}) {
  // Faces turned away from the viewer fall into shadow, like the inside of a fold.
  const shade = useTransform(angle, (a) => {
    const facing = Math.cos(((a + k * 90) * Math.PI) / 180);
    return 0.65 * (1 - Math.max(0, facing));
  });

  return (
    <div className="pleat-face" style={{ "--k": k } as React.CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element -- optimised props from getImageProps, sliced per pleat */}
      <img
        {...face.img}
        alt=""
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager && index === 0 ? "high" : undefined}
        decoding="async"
        draggable={false}
        className="pleat-img"
        style={{ objectPosition: face.position, left: `calc(var(--w) * ${-index})` }}
      />
      <motion.span className="absolute inset-0 bg-[#0d0809]" style={{ opacity: shade }} />
    </div>
  );
}

/* ------------------------------------------------------------------ hero copy */

function HeroCopy() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-[clamp(2.75rem,1.5rem+5vw,6.5rem)] leading-[0.95] tracking-[-0.035em]">
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
        <p className="mt-4 max-w-[26rem] text-[15px] font-light leading-relaxed text-ivory/85 md:mt-5 md:text-base">
          Handwoven sarees, kurtis and tailored pants, made in small runs by India&rsquo;s master weavers.
        </p>
        <HeroActions className="mt-6 md:mt-8" />
      </div>
    </div>
  );
}
