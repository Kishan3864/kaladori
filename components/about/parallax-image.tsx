"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ImageReveal } from "@/components/motion/image-reveal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type ParallaxImageProps = {
  src: string;
  alt: string;
  /** next/image `sizes` hint for the frame. */
  sizes: string;
  /** Sizing / aspect classes for the frame, e.g. "aspect-[4/5]". */
  className?: string;
  /** Direction the reveal curtain opens from. */
  from?: "bottom" | "top" | "left" | "right";
  delay?: number;
  priority?: boolean;
  /** Drift distance as a percentage of the (oversized) image layer. */
  strength?: number;
};

/**
 * Editorial plate: the ImageReveal curtain, plus a slow vertical drift tied
 * to scroll so the photograph feels like it sits behind the page.
 * The image layer is 124% of the frame height, so an 8% drift never shows
 * an edge. Drift is disabled for reduced motion.
 */
export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  from = "bottom",
  delay = 0,
  priority = false,
  strength = 8,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Hydration-safe flag (false on the server and first client render).
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <ImageReveal className="h-full w-full" from={from} delay={delay}>
        <motion.div className="absolute inset-x-0 -inset-y-[12%]" style={{ y: reduceMotion ? 0 : y }}>
          <Image src={src} alt={alt} fill sizes={sizes} preload={priority} className="object-cover" />
        </motion.div>
      </ImageReveal>
    </div>
  );
}
