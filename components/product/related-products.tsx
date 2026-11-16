import Link from "next/link";
import type { Category, Product } from "@/data/products";
import { MaskedLines, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ThreadLine } from "@/components/motion/thread-line";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import { groupUnderline } from "./underline";

type RelatedProductsProps = {
  products: Product[];
  category: Category;
  categoryName: string;
};

/**
 * "In the same spirit": four more pieces (same category first, then one from
 * another) on a staggered editorial grid, led in by the thread.
 */
export function RelatedProducts({ products, category, categoryName }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="relative pb-24 pt-28 md:pb-36 md:pt-44">
      {/* The thread runs out of the craft band and loops into the heading. */}
      <ThreadLine
        preset="loop"
        showTip
        className="absolute inset-x-0 -top-10 h-36 md:-top-16 md:h-56"
        offset={["start 90%", "end 40%"]}
      />

      <div className="shell">
        <div className="grid grid-cols-12 items-end gap-x-4 gap-y-8 md:gap-x-8">
          <div className="col-span-12 md:col-span-7">
            <p className="eyebrow text-maroon">More from the edit</p>
            <MaskedLines
              id="related-heading"
              as="h2"
              className="text-display mt-6"
              lines={[
                "In the same",
                <>
                  <em className="italic">spirit</em>.
                </>,
              ]}
            />
          </div>
          <Reveal className="col-span-12 md:col-span-4 md:col-start-9" delay={0.15}>
            <p className="max-w-sm text-[15px] font-light leading-relaxed text-ink/75">
              More {categoryName.toLowerCase()} from the Loom Edit, and a piece from across the collection —
              each made slowly, in small runs.
            </p>
            <Link
              href={`/shop?category=${category}`}
              className="eyebrow group mt-6 inline-flex min-h-11 items-center gap-2"
            >
              <span className={groupUnderline}>All {categoryName.toLowerCase()}</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-500 ease-editorial group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>

        <Stagger
          className="mt-14 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 md:mt-20 lg:grid-cols-4 lg:gap-x-6"
          stagger={0.1}
        >
          {products.map((product, i) => (
            <StaggerItem key={product.slug} className={cn(i % 2 === 1 && "mt-10 lg:mt-24")}>
              <ProductCard product={product} sizes="(min-width: 1024px) 24vw, 50vw" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
