"use client";

/**
 * HERO 01: "Photo Ring" (approved by the client, 17 Nov 2026).
 *
 * Dark maroon room. Every piece in the collection stands on a ring of
 * portrait photographs turning slowly in CSS 3D under the headline. Scrolling
 * spins the ring toward the viewer and opens the Sarees photograph from the
 * centre to the full screen; Kurtis and Pants then wipe up over the last
 * photo, which darkens and sinks back. Copy blocks tilt in on X.
 *
 * Keep this file as is: it is a saved design the client can ask to re-apply.
 */
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { clamp01, CollectionCopy, HeroActions, smooth, StageBlock, StageNav, useStoryTimeline } from "./story-kit";
import type { HeroData, RingPhoto, StoryCollection } from "./types";

export function HeroPhotoRing({ data }: { data: HeroData }) {
  const { collections, ring } = data;
  const { trackRef, stage, goTo } = useStoryTimeline();

  return (
    <section
      id="home-story"
      ref={trackRef}
      aria-label="KalaDori collections"
      className="relative -mt-16 h-[400svh] md:-mt-[4.5rem]"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-[#1a1214] text-ivory">
        {/* Warm glow behind the ring. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_58%,#4d1528_0%,transparent_75%)]"
        />

        <PhotoRing photos={ring} stage={stage} />

        {collections.map((collection, i) => (
          <StagePhoto key={collection.slug} index={i + 1} stage={stage} photo={collection.photo} />
        ))}

        <div className="shell relative flex h-full flex-col">
          <div className="h-16 shrink-0 md:h-[4.5rem]" />

          <div className="relative min-h-0 flex-1">
            <StageBlock
              index={0}
              stage={stage}
              onFocus={goTo}
              className="inset-0 flex flex-col items-center justify-between py-6 text-center md:py-10"
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

/* ----------------------------------------------------------------- the ring */

/**
 * Pure CSS 3D (no WebGL): panels placed round a cylinder, the whole ring
 * tilted toward the viewer. An idle CSS spin turns it slowly; scroll adds a
 * faster turn and carries it past the camera as the first photograph opens.
 */
function PhotoRing({ photos, stage }: { photos: RingPhoto[]; stage: MotionValue<number> }) {
  const n = photos.length;
  const spin = useTransform(stage, (s) => clamp01(s) * -150);
  const scale = useTransform(stage, (s) => 1 + clamp01(s) * 1.4);
  const opacity = useTransform(stage, (s) => 1 - smooth(0.35, 0.85, s));
  const ref = useRef<HTMLDivElement>(null);

  // Stop the idle spin while the ring is off screen or faded out.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let onScreen = true;
    const sync = () => {
      el.dataset.paused = !onScreen || opacity.get() < 0.02 ? "true" : "false";
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    const off = opacity.on("change", sync);
    return () => {
      io.disconnect();
      off();
    };
  }, [opacity]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="ring-stage absolute inset-0 flex items-center justify-center"
      style={{ opacity, scale }}
    >
      <div className="ring-tilt">
        <motion.div className="ring-scroll" style={{ rotateY: spin }}>
          <div className="ring-spin">
            {photos.map((photo, i) => (
              <div key={photo.src} className="ring-panel" style={{ "--i": i, "--n": n } as React.CSSProperties}>
                <Image src={photo.src} alt="" fill loading="eager" sizes="(min-width: 768px) 210px, 120px" className="object-cover" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------- stage photographs */

function StagePhoto({
  index,
  stage,
  photo,
}: {
  index: number;
  stage: MotionValue<number>;
  photo: StoryCollection["photo"];
}) {
  // r: 0 hidden, 1 fully open. The first opens from a window in the centre,
  // later ones wipe up from the bottom. After the next one arrives this one sinks back.
  const r = useTransform(stage, (s) => clamp01(s - (index - 1)));
  const clipPath = useTransform(r, (v) => {
    if (index === 1) {
      // Grows from nothing in the centre as the ring flies past.
      const g = 1 - smooth(0.1, 1, v);
      return `inset(${g * 50}% ${g * 50}% ${g * 50}% ${g * 50}% round ${g * 24}px)`;
    }
    return `inset(${(1 - v) * 100}% 0% 0% 0%)`;
  });
  const imageScale = useTransform(stage, (s) => {
    const own = clamp01(s - (index - 1));
    const after = clamp01(s - index);
    return 1.3 - own * 0.3 + after * 0.06; // never below 1, so no edges show
  });
  const shade = useTransform(stage, (s) => 0.25 + clamp01(s - index) * 0.5);

  return (
    <motion.div aria-hidden="true" className="absolute inset-0" style={{ clipPath, zIndex: index }}>
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        <Image
          src={photo.src}
          alt=""
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: photo.position ?? "50% 30%" }}
        />
      </motion.div>
      {/* Legibility: a soft dark floor under the copy, deepening as the next photo comes in. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(20_12_14/0.85)_0%,rgb(20_12_14/0.35)_45%,transparent_75%)]" />
      <motion.div className="absolute inset-0 bg-[#140c0e]" style={{ opacity: shade }} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ hero copy */

function HeroCopy() {
  return (
    <>
      <h1 className="text-[clamp(2.5rem,1.4rem+4.4vw,5.5rem)] leading-[1] tracking-[-0.03em] [text-shadow:0_2px_30px_rgb(0_0_0/0.35)]">
        <span className="block overflow-hidden pb-[0.06em]">
          <span className="hero-rise block" style={{ animationDelay: "0.1s" }}>
            The art of the
          </span>
        </span>
        <span className="block overflow-hidden pb-[0.14em]">
          <span className="hero-rise block" style={{ animationDelay: "0.22s" }}>
            <em className="italic text-blush">thread</em>.
          </span>
        </span>
      </h1>

      <div className="hero-fade flex flex-col items-center" style={{ animationDelay: "0.55s" }}>
        <p className="max-w-[26rem] text-[15px] font-light leading-relaxed text-ivory/80 [text-shadow:0_1px_16px_rgb(0_0_0/0.5)] md:text-base">
          Handwoven sarees, kurtis and tailored pants, made in small runs by India&rsquo;s master weavers.
        </p>
        <HeroActions className="mt-6 justify-center" />
      </div>
    </>
  );
}
