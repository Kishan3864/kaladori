import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const values = [
  {
    title: "Natural fibres",
    body: "Silk, cotton and linen, with tested zari on every Banarasi. Nothing synthetic hidden in the weave.",
  },
  {
    title: "Fair wages",
    body: "Weavers set their own rate for each piece, and are paid when the cloth is delivered, not when it sells.",
  },
  {
    title: "Small batches",
    body: "Most pieces are made in runs of twelve or fewer. When a cloth is gone, it is gone.",
  },
  {
    title: "Made to be mended",
    body: "Spare buttons, kept offcuts and repairs at cost. A garment should outlive its season by decades.",
  },
] as const;

/** Section III — the house principles, set in a hairline-ruled row on sand. */
export function AboutValues() {
  return (
    <section aria-labelledby="about-values" className="bg-sand">
      <div className="shell py-24 md:py-36">
        <div className="grid grid-cols-12 gap-x-5 gap-y-8 md:gap-x-8">
          <Reveal y={16} className="col-span-12 lg:col-span-7">
            <p className="eyebrow text-ink/70">
              <span className="text-maroon">III</span>
              <span className="mx-3 inline-block h-px w-6 translate-y-[-3px] bg-ink/20 align-middle" aria-hidden="true" />
              Principles
            </p>
            <h2 id="about-values" className="mt-8 text-display md:mt-10">
              Small promises, <em className="italic">kept</em>.
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="col-span-12 sm:col-span-9 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="text-lede text-ink/80">
              Four things we hold to, whatever the season and whatever it costs us. They are the reason our
              pieces take longer — and the reason they last.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-16 md:mt-24" stagger={0.12}>
          <ul className="grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4 lg:border-b">
            {values.map((value, index) => (
              <li
                key={value.title}
                className="border-b border-ink/15 py-10 sm:odd:pr-8 sm:even:border-l sm:even:pl-8 lg:border-b-0 lg:px-8 lg:py-14 lg:first:pl-0 lg:[&:nth-child(n+2)]:border-l"
              >
                <StaggerItem>
                  <span className="eyebrow text-maroon" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 text-[1.5rem] leading-[1.1] md:mt-8 md:text-[1.75rem]">{value.title}</h3>
                  <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-ink/75">{value.body}</p>
                </StaggerItem>
              </li>
            ))}
          </ul>
        </Stagger>
      </div>
    </section>
  );
}
