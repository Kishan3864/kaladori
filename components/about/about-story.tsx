import { ParallaxImage } from "@/components/about/parallax-image";
import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { ThreadLine } from "@/components/motion/thread-line";
import { editorial } from "@/lib/images";

const figures = [
  { value: "19", unit: "days", label: "to weave a single Banarasi with a full zari pallu" },
  { value: "5", unit: "craft clusters", label: "Varanasi, Chanderi, Lucknow, Bagru and Phulia" },
  { value: "12", unit: "or fewer", label: "pieces in most production runs" },
] as const;

const steps = [
  {
    number: "01",
    title: "Fibre & dye",
    body: "It starts with the yarn: mulberry silk, long-staple cotton and fine linen, chosen by hand. Wherever we can, colour comes from plants — indigo, madder, pomegranate rind — and is dyed in small lots, so every batch carries a faint variation of its own.",
    note: "Mulberry silk · Cotton · Linen",
  },
  {
    number: "02",
    title: "The loom",
    body: "Our sarees are woven on pit and frame looms by families who have woven for generations. A Banarasi with a full zari pallu can take a master weaver and an assistant close to three weeks; a Chanderi, eight to ten days. We plan our collections around that pace, not the other way round.",
    note: "Banarasi · Chanderi · Handloom cotton",
  },
  {
    number: "03",
    title: "Hand finishing",
    body: "Kurtis are cut in small runs in our Lucknow workshop and finished by hand: chikankari worked stitch by stitch, hems turned and blind-stitched, buttons sewn on with a shank so they sit properly. Every saree is checked inch by inch before it is folded in muslin.",
    note: "Chikankari · Block print · Hand-rolled hems",
  },
  {
    number: "04",
    title: "Made to last",
    body: "Each kurti comes with spare buttons, and we keep offcuts of every cloth we weave, so a piece can be mended rather than replaced. Send it back to us and our tailors will repair it at cost.",
    note: "Spare buttons · Kept offcuts · Repairs at cost",
  },
] as const;

/**
 * The long-form story: a plate, the manifesto and the four-step craft
 * section. A single maroon thread meanders down the left of all three,
 * drawn as you scroll, passing beneath the photographs like a weft thread.
 */
export function AboutStory() {
  return (
    <div className="relative">
      {/* The thread lives in the left lane: the page gutter on small screens, columns 1–3 on large ones. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="shell relative h-full">
          <ThreadLine
            preset="meander"
            showTip
            offset={["start 75%", "end 45%"]}
            className="absolute inset-y-0 left-0.5 w-4 md:left-1 md:w-8 lg:left-[1%] lg:w-[23%]"
          />
        </div>
      </div>

      {/* Plate I */}
      <div className="shell">
        <div className="grid grid-cols-12 gap-x-5 md:gap-x-8">
          <figure className="col-span-12 lg:col-span-9 lg:col-start-4">
            <ParallaxImage
              src={editorial.about.src}
              alt={editorial.about.alt}
              priority
              sizes="(min-width: 1600px) 1110px, (min-width: 1024px) 70vw, 100vw"
              className="aspect-[4/5] max-h-[78svh] w-full sm:aspect-[3/2] lg:aspect-[16/10] lg:max-h-none"
            />
            <figcaption className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
              <span className="eyebrow text-maroon">Plate I — On the loom</span>
              <span className="max-w-md text-[13px] leading-relaxed text-stone sm:text-right">
                A single Banarasi can carry more than five thousand warp threads, each one set on the loom by
                hand — and every one of them is woven in India.
              </span>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* I — The house (manifesto) */}
      <section aria-labelledby="about-house" className="shell py-24 md:py-36">
        <div className="grid grid-cols-12 gap-x-5 md:gap-x-8">
          <div className="col-span-12 lg:col-span-9 lg:col-start-4">
            <Reveal y={12}>
              <p className="eyebrow text-stone">
                <span className="text-maroon">I</span>
                <span className="mx-3 inline-block h-px w-6 translate-y-[-3px] bg-line align-middle" aria-hidden="true" />
                The house
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 id="about-house" className="mt-8 max-w-[22ch] text-title md:mt-10">
                We believe the most modern thing a garment can be is <em className="italic">lasting</em>.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="col-span-12 mt-12 md:mt-16 lg:col-span-5 lg:col-start-4">
            <p className="text-lede text-ink/85">
              KalaDori began with a handful of sarees and a simple question: what if we made less, and made it
              properly? Today we work with a small circle of weaving families and artisans, designing sarees,
              kurtis and scarves in quiet colours and clean lines — clothes made to be worn often, loved
              hard and passed on.
            </p>
            <p className="mt-6 text-[15px] leading-relaxed text-stone">
              We release a few small edits a year rather than chasing a fashion calendar, and mark down only the
              last pieces of a run. An edit is ready when the cloth is ready. Some pieces return in new
              colourways; others are woven once and never again.
            </p>
          </Reveal>

          <Reveal delay={0.25} className="col-span-12 mt-14 md:mt-16 lg:col-span-3 lg:col-start-10 lg:mt-16">
            <ul className="grid sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-1">
              {figures.map((figure) => (
                <li key={figure.unit} className="border-t border-line py-5">
                  <span className="font-display text-[2.5rem] leading-none md:text-5xl">{figure.value}</span>{" "}
                  <span className="eyebrow ml-2 text-maroon">{figure.unit}</span>{" "}
                  <span className="mt-3 block text-[13px] leading-relaxed text-stone">{figure.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* II — The craft */}
      <section id="craft" className="shell scroll-mt-24 pb-24 md:pb-36">
        <div className="grid grid-cols-12 gap-x-5 md:gap-x-8">
          <div className="col-span-12 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <figure className="ml-auto w-[84%] sm:w-[62%] lg:ml-0 lg:w-full">
              <ParallaxImage
                src={editorial.aboutSecondary.src}
                alt={editorial.aboutSecondary.alt}
                priority
                sizes="(min-width: 1600px) 620px, (min-width: 1024px) 40vw, (min-width: 640px) 62vw, 84vw"
                className="aspect-[4/5]"
                from="left"
                strength={6}
              />
              <figcaption className="mt-4 text-[13px] leading-relaxed text-stone">
                <span className="eyebrow mr-3 text-maroon">Plate II</span>
                Yarn coloured with plant dyes, drying in the sun.
              </figcaption>
            </figure>
          </div>

          <div className="col-span-12 mt-16 lg:col-span-6 lg:col-start-7 lg:mt-0">
            <Reveal y={12}>
              <p className="eyebrow text-stone">
                <span className="text-maroon">II</span>
                <span className="mx-3 inline-block h-px w-6 translate-y-[-3px] bg-line align-middle" aria-hidden="true" />
                The craft
              </p>
            </Reveal>
            <MaskedLines
              className="mt-8 text-display md:mt-10"
              lines={[
                <span key="c1">Four steps,</span>,
                <span key="c2">
                  no <em className="italic">shortcuts</em>.
                </span>,
              ]}
            />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md text-lede text-ink/80">
                Nothing we sell is made faster than its craft allows. This is how a piece comes to be.
              </p>
            </Reveal>

            <ol className="mt-14 md:mt-20">
              {steps.map((step, index) => (
                <li key={step.number} className={index % 2 === 1 ? "md:ml-[14%]" : undefined}>
                  <Reveal amount={0.2} className="grid grid-cols-[3.25rem_1fr] gap-x-4 border-t border-line py-10 md:grid-cols-[5rem_1fr] md:gap-x-6 md:py-14">
                    <span className="font-display text-3xl leading-none text-maroon md:text-4xl" aria-hidden="true">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-[1.5rem] leading-[1.1] md:text-[1.875rem]">
                        {step.title}
                      </h3>
                      <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-stone md:text-base">{step.body}</p>
                      <p className="eyebrow mt-6 text-[10px] text-ink/60">{step.note}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
