import { Reveal } from "@/components/motion/reveal";
import { ThreadLine } from "@/components/motion/thread-line";

/** Full-bleed ink pull quote; the thread ties a single stitch-loop beneath it as you scroll. */
export function AboutQuote() {
  return (
    <section aria-label="From the loom" className="relative overflow-hidden bg-ink text-ivory">
      {/* Blush on ink, as in the Lookbook and Newsletter: maroon nearly disappears here (2.4:1). */}
      <ThreadLine
        preset="loop"
        color="var(--color-blush)"
        strokeWidth={1.25}
        className="absolute inset-x-0 bottom-6 h-28 md:bottom-10 md:h-44"
        offset={["start 80%", "end 60%"]}
        showTip
      />

      <div className="shell relative pb-40 pt-24 md:pb-56 md:pt-36">
        <figure className="grid grid-cols-12 gap-x-5 md:gap-x-8">
          <Reveal y={16} className="col-span-12 lg:col-span-2">
            <span aria-hidden="true" className="block font-display text-[4.5rem] leading-[0.6] text-blush md:text-[6.5rem]">
              &ldquo;
            </span>
          </Reveal>
          <blockquote className="col-span-12 mt-8 lg:col-span-9 lg:col-start-3 lg:mt-0">
            <Reveal delay={0.1}>
              <p className="max-w-[26ch] font-display text-[clamp(1.75rem,1.1rem+2.4vw,3.375rem)] leading-[1.1] tracking-[-0.02em]">
                The loom does not hurry. It asks you to <em className="italic text-blush">listen</em> — and then it
                remembers everything.
              </p>
            </Reveal>
          </blockquote>
          <figcaption className="col-span-12 mt-10 md:mt-14 lg:col-span-9 lg:col-start-3">
            <Reveal delay={0.25} className="flex items-center gap-4">
              <span className="h-px w-10 bg-blush" aria-hidden="true" />
              <span className="eyebrow text-ivory/70">A master weaver, Varanasi</span>
            </Reveal>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
