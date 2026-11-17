"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const STATEMENT =
  "Every piece begins on a handloom in one of India's weaving towns. It is finished by hand, made in small runs, and meant to be worn for years.";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{" "}
    </>
  );
}

/**
 * The brand story in one sentence. Words fill in from faint to ink as the
 * section scrolls through the viewport, so the reader's pace sets the reading
 * pace. Under reduced motion the sentence is simply shown.
 */
export function CraftStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = STATEMENT.split(" ");

  return (
    <section aria-label="Our craft" className="shell py-24 md:py-40">
      <div className="mx-auto max-w-4xl">
        <p
          ref={ref}
          className="font-display text-[clamp(1.5rem,1rem+2vw,2.75rem)] leading-[1.22] tracking-[-0.015em]"
        >
          {reduced
            ? STATEMENT
            : words.map((word, i) => (
                <Word
                  key={i}
                  word={word}
                  progress={scrollYProgress}
                  range={[i / words.length, Math.min(1, (i + 2) / words.length)]}
                />
              ))}
        </p>
        <Link href="/about" className="eyebrow group mt-10 inline-flex min-h-11 items-center gap-3 md:mt-14">
          <span className="link-draw py-1">Meet the weavers</span>
          <span aria-hidden="true" className="text-maroon transition-transform duration-500 ease-editorial group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
