import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  /** `sizes` hint for next/image — match the grid the card sits in. */
  sizes?: string;
  /**
   * First row above the fold: load eagerly. Deliberately not preloaded —
   * only a page's single hero / LCP image gets a preload.
   */
  priority?: boolean;
  className?: string;
  /** Taller editorial crop for feature slots. */
  tall?: boolean;
};

/**
 * Shared product tile: hover zoom + alternate image cross-fade, discreet
 * badge, and an understated name/price row.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className,
  tall = false,
}: ProductCardProps) {
  const [primary, secondary] = product.images;
  // One discreet tag: a craft badge ("Handloom", "Limited") wins over "New".
  const tag = product.badge ?? (product.isNew ? "New" : undefined);

  return (
    <Link href={`/product/${product.slug}`} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden bg-sand", tall ? "aspect-[3/4.4]" : "aspect-[3/4]")}>
        <Image
          src={primary}
          alt={`${product.name} in ${product.colour}`}
          fill
          sizes={sizes}
          loading={priority ? "eager" : undefined}
          className="object-cover transition-transform duration-[1600ms] ease-editorial group-hover:scale-[1.07]"
        />
        {/* Hover view: display:none on touch screens, so the lazy image is never downloaded there. */}
        {secondary ? (
          <Image
            src={secondary}
            alt=""
            aria-hidden="true"
            fill
            sizes={sizes}
            className="hidden object-cover opacity-0 transition-[opacity,transform] duration-[1200ms] ease-editorial group-hover:scale-[1.04] group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:hover)]:block"
          />
        ) : null}

        {tag ? (
          <span className="eyebrow absolute left-2.5 top-2.5 bg-ivory/95 px-2 py-1.5 text-[9px] text-ink sm:left-3 sm:top-3 sm:px-2.5 sm:text-[10px]">
            {tag}
          </span>
        ) : null}

        <span className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-3 items-center justify-between bg-ivory/95 px-4 py-3 opacity-0 transition-[opacity,transform] duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:hover)]:md:flex">
          <span className="eyebrow text-[10px]">Discover</span>
          <span className="text-[11px] text-stone">{product.sizes.length > 1 ? `${product.sizes[0]}–${product.sizes[product.sizes.length - 1]}` : product.sizes[0]}</span>
        </span>
      </div>

      {/* Stacked on phones (2-up cards are ~150px wide); name and price side by side from sm. */}
      <div className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="font-sans text-[15px] font-normal leading-snug tracking-normal break-words">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-editorial group-hover:bg-[length:100%_1px]">
              {product.name}
            </span>
          </h3>
          <p className="mt-1.5 flex items-center gap-2 text-[13px] text-stone">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-ink/15"
              style={{ backgroundColor: product.colourHex }}
              aria-hidden="true"
            />
            {product.colour}
          </p>
        </div>
        <p className="text-[15px] tabular-nums sm:shrink-0 sm:text-right">
          {product.compareAtPrice ? <span className="sr-only">Sale price </span> : null}
          {formatPrice(product.price)}
          {product.compareAtPrice ? (
            <>
              {" "}
              <del className="ml-1.5 text-[13px] text-stone sm:ml-0 sm:block">
                <span className="sr-only">Original price </span>
                {formatPrice(product.compareAtPrice)}
              </del>
            </>
          ) : null}
        </p>
      </div>
    </Link>
  );
}
