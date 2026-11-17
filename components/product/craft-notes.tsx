import { Fragment } from "react";
import Image from "next/image";
import type { Category, Product } from "@/data/products";
import { ImageReveal } from "@/components/motion/image-reveal";
import { MaskedLines, Stagger, StaggerItem } from "@/components/motion/reveal";

type Craft = {
  eyebrow: string;
  lines: React.ReactNode[];
  notes: { title: string; text: string }[];
};

/** Written notes for the house categories; categories added later simply skip this band. */
const CRAFT: Partial<Record<Category, Craft>> = {
  sarees: {
    eyebrow: "The making",
    lines: [
      "A few inches",
      <Fragment key="line-1">
        a <em className="italic">day</em>.
      </Fragment>,
    ],
    notes: [
      {
        title: "The loom",
        text: "Every saree is woven on a handloom by a master weaver and their family — often over several weeks, and always at the pace the cloth sets.",
      },
      {
        title: "The thread",
        text: "Pure silks and fine cottons, with zari that is woven in rather than printed on, so the border ages with grace.",
      },
      {
        title: "The finish",
        text: "Each piece is checked edge to edge by hand, then folded in muslin before it leaves the atelier.",
      },
    ],
  },
  kurtis: {
    eyebrow: "The making",
    lines: [
      "Made by hand,",
      <Fragment key="line-1">
        cut for <em className="italic">now</em>.
      </Fragment>,
    ],
    notes: [
      {
        title: "The cloth",
        text: "Breathable natural fibres — cotton mulmul, block-printed cotton, linen and mulberry silk — chosen to soften with wear.",
      },
      {
        title: "The hand",
        text: "Chikankari, block printing and finishing are done by artisan partners in Lucknow and Rajasthan we work with season after season.",
      },
      {
        title: "The cut",
        text: "Clean, modern patterns developed in our studio and graded across six sizes, so tradition sits easily in the working week.",
      },
    ],
  },
  pants: {
    eyebrow: "The making",
    lines: [
      "The quiet",
      <Fragment key="line-1">
        <em className="italic">foundation</em>.
      </Fragment>,
    ],
    notes: [
      {
        title: "The cloth",
        text: "Washed linen, silk crepe and cotton twill, chosen for the way they move and the way they soften over time.",
      },
      {
        title: "The cut",
        text: "Considered rises, true pleats and real pockets, patterned in our studio and pressed by hand before dispatch.",
      },
      {
        title: "The pairing",
        text: "Designed to sit beneath our kurtis — and beneath everything else you already love to wear.",
      },
    ],
  },
};

/** Editorial band between the purchase area and recommendations. */
export function CraftNotes({ product }: { product: Product }) {
  const craft = CRAFT[product.category];
  if (!craft) return null;
  const image = product.images[2] ?? product.images[product.images.length - 1];

  return (
    <section aria-label={`The making of the ${product.name}`} className="bg-sand py-24 md:py-36">
      <div className="shell grid grid-cols-12 gap-x-4 gap-y-14 md:gap-x-8">
        <div className="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 md:col-span-5 md:col-start-1 lg:col-span-4 lg:col-start-2">
          <ImageReveal className="aspect-[4/5]" from="top">
            <Image
              src={image}
              alt={`${product.name} — fabric detail`}
              fill
              sizes="(min-width: 1600px) 500px, (min-width: 1024px) 31vw, (min-width: 768px) 40vw, (min-width: 640px) 64vw, 82vw"
              className="object-cover"
            />
          </ImageReveal>
          <p className="eyebrow mt-4 text-stone">{product.fabric}</p>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7 md:pt-16 lg:col-span-5 lg:col-start-7 lg:pt-28">
          <p className="eyebrow flex items-center gap-4 text-maroon">
            <span aria-hidden="true" className="h-px w-10 bg-maroon" />
            {craft.eyebrow}
          </p>
          <MaskedLines as="h2" lines={craft.lines} className="text-display mt-6" />

          <Stagger className="mt-12 border-t border-ink/15 md:mt-16" stagger={0.12}>
            {craft.notes.map((note, i) => (
              <StaggerItem
                key={note.title}
                className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-ink/15 py-6 md:grid-cols-[4rem_10rem_1fr] md:gap-x-6"
              >
                <span className="eyebrow pt-1 text-maroon">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-xl leading-tight md:text-[1.375rem]">{note.title}</h3>
                <p className="col-start-2 mt-2 text-[14.5px] leading-relaxed text-ink/75 md:col-start-3 md:mt-0">
                  {note.text}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
