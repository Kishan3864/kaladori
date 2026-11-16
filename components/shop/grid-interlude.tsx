"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "@/components/motion/image-reveal";
import { ThreadDraw, threads } from "@/components/motion/thread-line";
import { editorial } from "@/lib/images";

/**
 * Editorial pause inside the product grid. Spans the full row and mirrors
 * the grid's own columns on md+: a quote panel over two columns, a detail
 * photograph in the third (hidden on mobile, where the panel stands alone).
 *
 * `animated={false}` renders a static version (used by the Suspense fallback,
 * which is never hydrated, so nothing may start hidden).
 */
export function GridInterlude({ animated = true }: { animated?: boolean }) {
  const image = editorial.storySecondary;
  const photo = (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes="(min-width: 1600px) 480px, 31vw"
      className="object-cover"
    />
  );

  return (
    <div className="grid md:grid-cols-3 md:gap-x-8">
      <figure className="flex flex-col justify-between bg-sand px-6 py-12 sm:px-10 sm:py-14 md:col-span-2 md:px-14 md:py-16 xl:px-20 xl:py-20">
        <p className="eyebrow text-maroon">A note from the studio</p>

        <div className="mt-12 md:mt-16">
          <blockquote>
            <p className="max-w-[18ch] font-display text-[clamp(2rem,3.6vw,3.75rem)] leading-[1.04] tracking-[-0.025em] text-balance">
              Cloth should <em className="italic">outlive</em> the season it was bought in.
            </p>
          </blockquote>
          {animated ? (
            <ThreadDraw preset="underline" className="mt-6 h-3 w-32 md:h-4 md:w-44" duration={1.8} />
          ) : (
            <div aria-hidden="true" className="mt-6 h-3 w-32 md:h-4 md:w-44">
              <svg
                viewBox={threads.underline.viewBox}
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
                fill="none"
              >
                <path
                  d={threads.underline.d}
                  stroke="var(--color-maroon)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          )}
        </div>

        <figcaption className="mt-12 flex flex-col gap-6 border-t border-line pt-6 md:mt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <p className="max-w-md text-[15px] leading-relaxed text-ink/75">
            Every piece is made in small runs with the weavers, printers and embroiderers we know by
            name — so it can be worn for years, then handed on.
          </p>
          <Link href="/about" className="eyebrow link-draw shrink-0 self-start py-3 lg:self-auto">
            Our story <span aria-hidden="true">→</span>
          </Link>
        </figcaption>
      </figure>

      <div className="hidden md:block">
        {animated ? (
          <ImageReveal className="aspect-[3/4]" from="top">
            {photo}
          </ImageReveal>
        ) : (
          <div className="relative aspect-[3/4] overflow-hidden bg-sand">{photo}</div>
        )}
        <p className="mt-4 text-[13px] text-stone">Silk yarn, dyed by hand before it meets the loom.</p>
      </div>
    </div>
  );
}
