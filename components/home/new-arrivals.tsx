import Link from "next/link";
import { SectionEyebrow } from "@/components/home/section-eyebrow";
import { MaskedLines, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ThreadDraw } from "@/components/motion/thread-line";
import { ProductCard } from "@/components/product/product-card";
import { getNewArrivals } from "@/data/products";
import { cn } from "@/lib/utils";

export function NewArrivals() {
  const arrivals = getNewArrivals(4);
  if (arrivals.length === 0) return null;

  return (
    <section className="pb-28 pt-12 md:pb-44 md:pt-16">
      <div className="shell">
        <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-12 md:gap-x-6 md:pt-14 lg:gap-x-8">
          <div className="md:col-span-7">
            <SectionEyebrow index="02" label="New arrivals" />
            <MaskedLines
              className="mt-7 text-display"
              lines={[
                "Just off ",
                <>
                  the <em className="italic">loom</em>.
                </>,
              ]}
            />
            <ThreadDraw className="mt-5 h-4 w-36 md:h-5 md:w-52" delay={0.6} />
          </div>

          <Reveal delay={0.15} className="md:col-span-4 md:col-start-9 md:self-end">
            <p className="max-w-sm text-[15px] leading-relaxed text-stone">
              New-season Banarasi and Chanderi, shadow-work chikankari and washed linen — the first pieces of the
              Loom Edit, in limited runs.
            </p>
            <Link
              href="/shop?sort=newest"
              className="eyebrow group mt-6 inline-flex min-h-11 items-center gap-3"
            >
              <span className="link-draw py-1">Shop the newest pieces</span>
              <span
                aria-hidden="true"
                className="text-maroon transition-transform duration-500 ease-editorial group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>

        <Stagger
          stagger={0.12}
          amount={0.1}
          className="mt-14 grid grid-cols-2 gap-x-4 gap-y-14 md:mt-20 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8"
        >
          {arrivals.map((product, i) => (
            <StaggerItem key={product.slug} className={cn(i % 2 === 1 && "mt-12 lg:mt-28")}>
              <ProductCard
                product={product}
                sizes="(min-width: 1024px) 23vw, (min-width: 768px) 45vw, 46vw"
                tall={i % 2 === 0}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
