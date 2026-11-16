import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { ThreadLine } from "@/components/motion/thread-line";
import { categories, products } from "@/data/products";
import { pad } from "./shop-params";

/** Editorial page header for /shop: oversized Bodoni title, offset intro, scroll-drawn thread. */
export function ShopHeader() {
  return (
    <section className="relative">
      <div className="shell relative pb-32 pt-10 md:pb-48 md:pt-16">
        <Reveal y={12} className="flex items-center justify-between gap-6 border-b border-line pb-4">
          <p className="eyebrow text-maroon">The collection</p>
          <p className="eyebrow hidden text-stone sm:block">Sarees · Kurtis · Pants</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-12 gap-x-4 md:mt-20 md:gap-x-8">
          <MaskedLines
            as="h1"
            animateOnMount
            delay={0.15}
            className="col-span-12 text-[clamp(2.75rem,10vw,9.5rem)] leading-[0.9] tracking-[-0.035em] lg:col-span-11"
            lines={[
              "Kept close,",
              <>
                worn <em className="italic">often</em>.
              </>,
            ]}
          />

          <Reveal
            delay={0.55}
            className="col-span-12 mt-10 sm:col-span-10 md:col-span-6 md:col-start-7 md:mt-16 lg:col-span-4 lg:col-start-8"
          >
            <p className="text-lede text-ink/80">
              Handloom sarees, hand-finished kurtis and the trousers that hold them together — made in
              small runs, in natural fibres, to be worn for years.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-5">
              <div>
                <dt className="eyebrow text-stone">Pieces</dt>
                <dd className="mt-2 font-display text-2xl tabular-nums md:text-3xl">{pad(products.length)}</dd>
              </div>
              <div>
                <dt className="eyebrow text-stone">Categories</dt>
                <dd className="mt-2 font-display text-2xl tabular-nums md:text-3xl">{pad(categories.length)}</dd>
              </div>
              <div>
                <dt className="eyebrow text-stone">Made in</dt>
                <dd className="mt-2 font-display text-2xl md:text-3xl">India</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>

      {/* The signature thread runs beneath the header and draws as you scroll into the collection. */}
      <ThreadLine
        preset="wave"
        showTip
        offset={["start end", "end 30%"]}
        className="absolute inset-x-0 bottom-6 h-20 md:bottom-10 md:h-28"
      />
    </section>
  );
}
