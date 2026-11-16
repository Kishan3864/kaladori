import Image from "next/image";
import Link from "next/link";
import { SectionEyebrow } from "@/components/home/section-eyebrow";
import { ImageReveal } from "@/components/motion/image-reveal";
import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { categories, getProductsByCategory, type CategoryInfo } from "@/data/products";
import { editorial } from "@/lib/images";
import { cn } from "@/lib/utils";

type TileProps = {
  category: CategoryInfo;
  index: number;
  feature?: boolean;
  className?: string;
  /** Aspect classes for the image frame. */
  frameClassName: string;
  sizes: string;
  delay?: number;
};

function CategoryTile({ category, index, feature = false, className, frameClassName, sizes, delay = 0 }: TileProps) {
  const image = editorial.categories[category.slug];
  const count = getProductsByCategory(category.slug).length;

  return (
    <Link href={`/shop?category=${category.slug}`} className={cn("group block", className)}>
      <ImageReveal delay={delay} className={frameClassName}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1600ms] ease-editorial group-hover:scale-[1.06]"
        />
      </ImageReveal>

      <div className="mt-5 md:mt-7">
        <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3.5">
          <span className="eyebrow text-maroon">{String(index + 1).padStart(2, "0")}</span>
          <span className="eyebrow text-[10px] text-stone">{count} pieces</span>
        </div>
        <h3 className={cn(feature ? "mt-6 text-display" : "mt-5 text-title")}>{category.name}</h3>
        <p className={cn("mt-4 max-w-sm text-[15px] leading-relaxed text-stone", !feature && "hidden md:block")}>
          {category.description}
        </p>
        <span className="eyebrow mt-4 inline-flex min-h-11 items-center gap-3">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-1 transition-[background-size] duration-500 ease-editorial group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
            Shop {category.name.toLowerCase()}
          </span>
          <span
            aria-hidden="true"
            className="text-maroon transition-transform duration-500 ease-editorial group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export function CategoryTiles() {
  const [sarees, kurtis, pants] = categories;

  return (
    <section className="relative pb-24 pt-32 md:pb-36 md:pt-44">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12 md:gap-x-6 lg:gap-x-8">
          <div className="md:col-span-7">
            <SectionEyebrow index="01" label="The collections" />
            <MaskedLines
              className="mt-7 text-display"
              lines={[
                "Drape, layer, ",
                <>
                  <em className="italic">anchor</em>.
                </>,
              ]}
            />
          </div>
          <Reveal delay={0.15} className="md:col-span-4 md:col-start-9 md:self-end">
            <p className="text-lede text-stone">
              Three collections, cut to work together. Every piece begins on a loom or under a needle, and is
              finished by hand.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-16 md:mt-24 md:grid-cols-12 md:gap-x-6 lg:gap-x-8">
          {sarees ? (
            <CategoryTile
              category={sarees}
              index={0}
              feature
              className="col-span-2 md:col-span-7"
              frameClassName="aspect-[4/5]"
              sizes="(min-width: 1600px) 880px, (min-width: 768px) 56vw, 100vw"
            />
          ) : null}

          <div className="col-span-2 grid grid-cols-2 gap-x-4 md:col-span-4 md:col-start-9 md:grid-cols-1 md:gap-y-20">
            {kurtis ? (
              <CategoryTile
                category={kurtis}
                index={1}
                className="md:mt-28"
                frameClassName="aspect-[3/4]"
                sizes="(min-width: 1600px) 460px, (min-width: 768px) 30vw, 46vw"
                delay={0.1}
              />
            ) : null}
            {pants ? (
              <CategoryTile
                category={pants}
                index={2}
                className="mt-16 md:mt-0 md:-translate-x-[24%]"
                frameClassName="aspect-[3/4]"
                sizes="(min-width: 1600px) 460px, (min-width: 768px) 30vw, 46vw"
                delay={0.2}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
