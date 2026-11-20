import { Reveal } from "@/components/motion/reveal";

/** Compact page header for /shop: a title and one line, then straight into the products. */
export function ShopHeader() {
  return (
    <section className="shell pb-8 pt-10 md:pb-10 md:pt-14">
      <Reveal y={12}>
        <h1 className="text-display">The collection</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-stone">
          Handloom sarees, hand-finished kurtis and scarves in natural fibres, made in small runs.
        </p>
      </Reveal>
    </section>
  );
}
