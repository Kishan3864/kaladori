import Image from "next/image";
import Link from "next/link";
import { SectionEyebrow } from "@/components/home/section-eyebrow";
import { ImageReveal } from "@/components/motion/image-reveal";
import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { ThreadDraw } from "@/components/motion/thread-line";
import { getProduct } from "@/data/products";
import { editorial } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Six looks in an asymmetric 12-column layout. Each slot names its photograph
 * and the piece it links to, together, so a caption always matches the
 * garment in the picture (same category and craft; check the photo's alt in
 * lib/images.ts before re-pairing). `note` describes the photograph.
 * Placement / aspect / sizes are tuned per slot.
 */
const slots = [
  {
    // A printed saree, walking through a park at golden hour.
    image: editorial.lookbook[0],
    slug: "gulmohar-handloom-cotton-saree",
    note: "Golden hour",
    className: "md:col-span-7",
    frame: "aspect-[4/5]",
    sizes: "(min-width: 768px) 56vw, 100vw",
  },
  {
    // A wine-red chikankari kurta in a city park.
    image: editorial.lookbook[1],
    slug: "ada-chikankari-kurti",
    note: "Chikankari, up close",
    className: "w-[78%] justify-self-end md:w-auto md:col-span-4 md:col-start-9 md:mt-44",
    frame: "aspect-[3/4]",
    sizes: "(min-width: 768px) 32vw, 78vw",
  },
  {
    // Wide-leg trousers with a tailored jacket in a stone colonnade.
    image: editorial.lookbook[2],
    slug: "wide-leg-linen-trouser",
    note: "The colonnade",
    className: "w-[86%] md:w-auto md:col-span-4 md:col-start-2",
    frame: "aspect-[3/4]",
    sizes: "(min-width: 768px) 32vw, 86vw",
  },
  {
    // A pale saree with fine floral work, draped over a cane chair.
    image: editorial.lookbook[3],
    slug: "noor-chanderi-saree",
    note: "Florals on cane",
    className: "md:col-span-6 md:col-start-7 md:mt-32",
    frame: "aspect-[5/4]",
    sizes: "(min-width: 768px) 48vw, 100vw",
  },
  {
    // A printed paisley kurta with bell sleeves.
    image: editorial.lookbook[4],
    slug: "neel-block-printed-kurti",
    note: "Hand-blocked print",
    className: "w-[82%] justify-self-end md:w-auto md:justify-self-auto md:col-span-5",
    frame: "aspect-[4/5]",
    sizes: "(min-width: 768px) 40vw, 82vw",
  },
  {
    // Wide-leg trousers seen from behind, beside a vintage van.
    image: editorial.lookbook[5],
    slug: "pleated-silk-palazzo",
    note: "On the road",
    className: "md:col-span-4 md:col-start-8 md:mt-52",
    frame: "aspect-[3/4]",
    sizes: "(min-width: 768px) 32vw, 100vw",
  },
] as const;

export function Lookbook() {
  const looks = slots.flatMap((slot, i) => {
    const product = getProduct(slot.slug);
    return product ? [{ ...slot, product, number: String(i + 1).padStart(2, "0") }] : [];
  });

  return (
    <section className="relative bg-ink py-24 text-ivory md:py-36">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12 md:gap-x-6 lg:gap-x-8">
          <div className="md:col-span-7">
            <SectionEyebrow index="04" label="Autumn–Winter 2026" tone="light" />
            <MaskedLines
              className="mt-7 text-display text-ivory"
              lines={[
                <>
                  The <em className="italic">Lookbook</em>
                </>,
              ]}
            />
            <ThreadDraw className="mt-5 h-4 w-40 md:h-5 md:w-60" color="var(--color-blush)" delay={0.5} />
          </div>
          <Reveal delay={0.15} className="md:col-span-4 md:col-start-9 md:self-end">
            <p className="max-w-sm text-[15px] leading-relaxed text-ivory/70">
              Photographed in Varanasi in the first cool light of October. Six looks from the Loom Edit, worn
              simply — one considered piece at a time.
            </p>
            <Link
              href="/shop"
              className="eyebrow group mt-6 inline-flex min-h-11 items-center gap-3 text-ivory focus-visible:outline-blush"
            >
              <span className="link-draw py-1">Shop the edit</span>
              <span
                aria-hidden="true"
                className="text-blush transition-transform duration-500 ease-editorial group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-y-16 md:mt-28 md:grid-cols-12 md:items-start md:gap-x-6 md:gap-y-24 lg:gap-x-8">
          {looks.map((look, i) => (
            <li key={look.slug} className={cn("block", look.className)}>
              <Link
                href={`/product/${look.product.slug}`}
                className="group block focus-visible:outline-blush"
              >
                <ImageReveal delay={(i % 2) * 0.15} from={i % 3 === 1 ? "top" : "bottom"} className={look.frame}>
                  <Image
                    src={look.image.src}
                    alt={look.image.alt}
                    fill
                    sizes={look.sizes}
                    className="object-cover transition-transform duration-[1600ms] ease-editorial group-hover:scale-[1.05]"
                  />
                </ImageReveal>
                <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-line-light pb-4">
                  <p className="min-w-0 text-[14px] leading-snug text-ivory/85">
                    <span className="eyebrow mr-2 text-blush">Look {look.number}</span>
                    <span aria-hidden="true" className="mr-2 text-ivory/40">
                      —
                    </span>
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-editorial group-hover:bg-[length:100%_1px]">
                      {look.product.name}
                    </span>
                  </p>
                  <span className="hidden shrink-0 font-display text-[15px] italic text-ivory/50 sm:inline">
                    {look.note}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
