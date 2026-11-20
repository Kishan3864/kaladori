import { MaskedLines, Reveal } from "@/components/motion/reveal";

const glossary = [
  { term: "Kalā", meaning: "art; skill; the knowledge held in the hand." },
  // Written as dotless i + combining macron: Newsreader's precomposed ī keeps the dot under the bar.
  { term: "Dorı̄", meaning: "thread; the cord that binds one thing to another." },
] as const;

/** Opening statement for /about: oversized Bodoni headline with a glossary of the house name. */
export function AboutHero() {
  return (
    <section className="shell pb-20 pt-12 md:pb-28 md:pt-20 lg:pt-24">
      <Reveal y={12} className="flex items-center gap-4">
        <span className="h-px w-10 bg-maroon" aria-hidden="true" />
        <p className="eyebrow text-maroon">Our story</p>
      </Reveal>

      <div className="mt-10 grid grid-cols-12 gap-x-5 md:mt-12 md:gap-x-8">
        <MaskedLines
          as="h1"
          animateOnMount
          delay={0.15}
          className="col-span-12 text-hero lg:col-span-8"
          lines={[
            <span key="l1">The art of</span>,
            <span key="l2" className="inline-block pl-[0.9em] md:pl-[1.8em]">
              a single
            </span>,
            <span key="l3">
              <em className="italic text-maroon">thread</em>.
            </span>,
          ]}
        />

        <Reveal
          delay={0.7}
          y={20}
          className="col-span-12 mt-12 sm:col-span-8 sm:col-start-5 lg:col-span-3 lg:col-start-10 lg:mt-0 lg:self-end lg:pb-3"
        >
          <dl className="space-y-6 border-t border-line pt-6">
            {glossary.map((entry) => (
              <div key={entry.term}>
                <dt lang="hi-Latn" className="font-display text-2xl italic leading-none">
                  {entry.term}
                </dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-stone">
                  <span className="eyebrow mr-2 text-[10px] text-ink/70">noun</span>
                  {entry.meaning}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-[15px] leading-relaxed text-ink/80">
            KalaDori is a small Indian house making sarees, kurtis and scarves with weaving families in
            Varanasi, Chanderi and Phulia, block printers in Bagru and embroiderers in Lucknow.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
