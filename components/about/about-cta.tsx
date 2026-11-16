import Link from "next/link";
import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { ThreadDraw } from "@/components/motion/thread-line";

/** Closing invitation: shop the collection, or come to the atelier. */
export function AboutCta() {
  return (
    <section className="shell py-24 md:py-36">
      <div className="grid grid-cols-12 gap-x-5 gap-y-14 md:gap-x-8 lg:items-end">
        <div className="col-span-12 lg:col-span-8">
          <Reveal y={12}>
            <p className="eyebrow text-stone">
              <span className="text-maroon">IV</span>
              <span className="mx-3 inline-block h-px w-6 translate-y-[-3px] bg-line align-middle" aria-hidden="true" />
              Visit
            </p>
          </Reveal>
          <MaskedLines
            className="mt-8 text-display md:mt-10"
            lines={[
              <span key="v1">Come and see</span>,
              <span key="v2">the cloth</span>,
              <span key="v3" className="inline-block pl-[1.2em]">
                <em className="italic">up close</em>.
              </span>,
            ]}
          />
          <ThreadDraw preset="underline" delay={0.9} className="ml-[1.2em] mt-1 h-[0.18em] w-[4.2em] text-display" />
        </div>

        <Reveal delay={0.2} className="col-span-12 sm:col-span-9 lg:col-span-4 lg:pb-4">
          <p className="text-lede text-ink/85">
            Our atelier is open by appointment, Monday to Saturday. Feel the weight of the silk, try the drape, and
            talk a piece through with the people who designed it — or browse the collection from wherever you
            are.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link href="/shop" className="btn btn-ink">
              Shop the collection <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Visit the atelier
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
