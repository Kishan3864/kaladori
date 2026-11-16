import { NewsletterForm } from "@/components/home/newsletter-form";
import { SectionEyebrow } from "@/components/home/section-eyebrow";
import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { ThreadLine } from "@/components/motion/thread-line";

export function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-maroon text-ivory">
      {/* A blush thread ties its single stitch-loop across the top of the panel. */}
      <ThreadLine
        preset="loop"
        color="var(--color-blush)"
        strokeWidth={1.25}
        offset={["start 95%", "end 45%"]}
        showTip
        className="absolute inset-x-0 top-12 h-32 md:top-16 md:h-44"
      />

      <div className="shell relative z-10 grid gap-y-14 pb-24 pt-48 md:grid-cols-12 md:gap-x-6 md:pb-32 md:pt-64 lg:gap-x-8">
        <div className="md:col-span-6">
          <SectionEyebrow index="06" label="The KalaDori letter" tone="maroon" />
          {/* Blush is too faint on maroon for type; the blush thread above carries the accent. */}
          <MaskedLines
            className="mt-7 text-display text-ivory"
            lines={[
              "Stay in ",
              <>
                the <em className="italic">loop</em>.
              </>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="text-lede mt-8 max-w-md text-ivory/90">
              New collections, notes from our weavers and early access to limited runs. Once a month, never
              more.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="md:col-span-5 md:col-start-8 md:self-end">
          <NewsletterForm />
        </Reveal>
      </div>
    </section>
  );
}
