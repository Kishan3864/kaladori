import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  /** `sizes` hint for next/image: match the grid the card sits in. */
  sizes?: string;
  /**
   * First row above the fold: load eagerly. Deliberately not preloaded:
   * only a page's single hero / LCP image gets a preload.
   */
  priority?: boolean;
  className?: string;
  /** Taller crop for feature slots. */
  tall?: boolean;
};

/**
 * Shared product tile, compact enough for a 6-column grid: image with a
 * hover cross-fade to the alternate view, then name, price and colour,
 * stacked so nothing collides however narrow the column gets.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  priority = false,
  className,
  tall = false,
}: ProductCardProps) {
  const [primary, secondary] = product.images;
  // One discreet tag: a craft badge ("Handloom", "Limited") wins over "New".
  const tag = product.badge ?? (product.isNew ? "New" : undefined);

  return (
    <Link href={`/product/${product.slug}`} className={cn("group block min-w-0", className)}>
      <div className={cn("relative overflow-hidden bg-sand", tall ? "aspect-[3/4.4]" : "aspect-[3/4]")}>
        <Image
          src={primary}
          alt={`${product.name} in ${product.colour}`}
          fill
          sizes={sizes}
          loading={priority ? "eager" : undefined}
          className="object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.05]"
        />
        {/* Hover view: display:none on touch screens, so the lazy image is never downloaded there. */}
        {secondary ? (
          <Image
            src={secondary}
            alt=""
            aria-hidden="true"
            fill
            sizes={sizes}
            className="hidden object-cover opacity-0 transition-opacity duration-700 ease-editorial group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:hover)]:block"
          />
        ) : null}

        {tag ? (
          <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate bg-ivory/90 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-ink sm:text-[10px]">
            {tag}
          </span>
        ) : null}
      </div>

      <div className="mt-3 min-w-0">
        <h3 className="line-clamp-2 font-sans text-[13px] font-normal leading-snug tracking-normal text-ink sm:text-[14px]">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-editorial group-hover:bg-[length:100%_1px]">
            {product.name}
          </span>
        </h3>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[13px] tabular-nums text-ink sm:text-[14px]">
          {product.compareAtPrice ? <span className="sr-only">Sale price </span> : null}
          <span>{formatPrice(product.price)}</span>
          {product.compareAtPrice ? (
            <del className="text-[12px] text-stone">
              <span className="sr-only">Original price </span>
              {formatPrice(product.compareAtPrice)}
            </del>
          ) : null}
        </p>
        <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[12px] text-stone">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full ring-1 ring-ink/15"
            style={{ backgroundColor: product.colourHex }}
            aria-hidden="true"
          />
          <span className="truncate">{product.colour}</span>
        </p>
      </div>
    </Link>
  );
}
