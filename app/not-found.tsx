import type { Metadata } from "next";
import Link from "next/link";
import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { ThreadDraw } from "@/components/motion/thread-line";
import { categories } from "@/data/products";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for has moved or no longer exists.",
};

export default function NotFound() {
  return (
    <div className="relative">
      <div className="shell pt-14 md:pt-24">
        <div className="flex items-center gap-4">
          <p className="eyebrow text-maroon">Error 404</p>
          <span aria-hidden="true" className="h-px w-10 bg-line" />
          <p className="eyebrow text-stone">Page not found</p>
        </div>

        <MaskedLines
          as="h1"
          animateOnMount
          delay={0.15}
          className="mt-8 text-hero md:mt-12"
          lines={[
            "Lost the",
            <em key="thread" className="block pl-[10vw] italic md:pl-[16vw]">
              thread.
            </em>,
          ]}
        />
      </div>

      {/* Full-bleed flourish: the thread wanders in from the edge and ties a loop */}
      <ThreadDraw
        preset="loop"
        delay={0.7}
        duration={2.4}
        className="-mt-2 h-24 w-full sm:h-32 md:-mt-10 md:h-44 lg:-mt-16 lg:h-56"
      />

      <div className="shell grid grid-cols-12 gap-x-5 gap-y-16 pb-24 pt-10 md:gap-x-8 md:pb-36 md:pt-12">
        <Reveal delay={0.5} className="col-span-12 md:col-span-5 lg:col-span-4 lg:col-start-2">
          <p className="text-lede text-ink-soft">
            The page you were looking for has moved, or was never woven at all. The collection, however, is exactly
            where we left it.
          </p>
          <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-10">
            <Link href="/shop" className="btn btn-ink">
              Shop the collection <span aria-hidden="true">→</span>
            </Link>
            <Link href="/" className="eyebrow inline-flex min-h-11 items-center justify-center sm:justify-start">
              <span className="link-draw py-1">Return home</span>
            </Link>
          </div>
        </Reveal>

        <Reveal
          delay={0.65}
          className="col-span-12 md:col-span-6 md:col-start-7 md:mt-24 lg:col-span-5 lg:col-start-8"
        >
          <nav aria-label="Shop by category">
            <p className="eyebrow text-stone">Or pick up a thread</p>
            <ul className="mt-6 border-t border-line">
              {categories.map((category, i) => (
                <li key={category.slug} className="border-b border-line">
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="group flex min-h-11 items-baseline gap-5 py-5 md:gap-8 md:py-6"
                  >
                    <span className="eyebrow w-6 shrink-0 text-stone">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-[1.75rem] leading-none transition-colors duration-500 ease-editorial group-hover:text-maroon md:text-[2.25rem]">
                      {category.name}
                    </span>
                    <span className="ml-auto hidden text-sm font-light text-stone sm:inline">{category.tagline}</span>
                    <span
                      aria-hidden="true"
                      className="ml-auto text-stone transition-transform duration-500 ease-editorial group-hover:translate-x-1 group-hover:text-maroon sm:ml-0"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>
      </div>
    </div>
  );
}
