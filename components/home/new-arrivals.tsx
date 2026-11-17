import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ProductCard } from "@/components/product/product-card";
import { getNewArrivals } from "@/lib/catalog";
import { getCatalog } from "@/lib/server/catalog";

/** Four new pieces in one even row. Cards tip up from a slight 3D lean as they enter. */
export async function NewArrivals() {
  const arrivals = getNewArrivals(await getCatalog(), 4);
  if (arrivals.length === 0) return null;

  return (
    <section aria-labelledby="new-arrivals-title" className="shell pt-24 md:pt-36">
      <Reveal y={16} className="flex items-end justify-between gap-6">
        <h2 id="new-arrivals-title" className="text-[clamp(1.625rem,1.2rem+1.5vw,2.5rem)] leading-[1.1]">
          New this season
        </h2>
        <Link href="/shop?sort=newest" className="eyebrow group inline-flex min-h-11 shrink-0 items-center gap-3">
          <span className="link-draw py-1">View all</span>
          <span aria-hidden="true" className="text-maroon transition-transform duration-500 ease-editorial group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Reveal>

      <Stagger
        stagger={0.1}
        amount={0.05}
        className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 [perspective:1200px] md:mt-14 md:gap-x-6 lg:grid-cols-4"
      >
        {arrivals.map((product) => (
          <StaggerItem key={product.slug} depth>
            <ProductCard product={product} priority sizes="(min-width: 1600px) 360px, (min-width: 1024px) 23vw, 46vw" />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
