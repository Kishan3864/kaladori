import Image from "next/image";
import Link from "next/link";
import { HandwovenMark } from "@/components/home/brand-mark";
import { ScrollCue } from "@/components/home/scroll-cue";
import { ImageReveal } from "@/components/motion/image-reveal";
import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { ThreadLine } from "@/components/motion/thread-line";
import { editorial } from "@/lib/images";

/*
 * The signature thread starts here. It enters from the right across the
 * campaign image, slips under the ink marquee band (z-30) like a stitch going
 * through cloth, and surfaces again in the white space of the next section.
 *
 * Coordinates are in a 1440 × 360 box stretched over the wrapper:
 * y ≈ 116 is the bottom of the hero, y ≈ 270–290 the bottom of the band.
 */
const HERO_THREAD =
  "M1470 6 C 1320 40, 1190 0, 1050 46 S 840 122, 720 86 C 640 60, 560 82, 560 150 S 640 300, 780 318 S 1000 322, 1120 352";

export function Hero() {
  return (
    <section className="relative">
      <div className="shell grid min-h-[calc(100svh-100px)] grid-cols-1 md:min-h-[calc(100svh-120px)] md:grid-cols-12 md:grid-rows-[auto_1fr_auto] md:gap-x-6 lg:gap-x-8">
        {/* Season label */}
        <Reveal
          delay={0.1}
          y={12}
          className="flex items-center justify-between gap-6 border-b border-line pb-4 pt-6 md:col-[1/7] md:row-[1/2] md:pt-10"
        >
          <p className="eyebrow text-[10px] sm:text-[11px]">
            Autumn–Winter 2026 <span className="px-1 text-maroon">·</span> The Loom Edit
          </p>
          <p className="hidden font-display text-[15px] italic text-stone lg:block">
            Kalā, art <span className="px-1 not-italic text-maroon">·</span> Dorī, thread
          </p>
        </Reveal>

        {/* Headline */}
        <div className="relative z-20 pt-9 md:col-[1/7] md:row-[2/3] md:self-end md:pt-16">
          <MaskedLines
            as="h1"
            animateOnMount
            delay={0.15}
            className="text-hero"
            lines={[
              "The art ",
              "of the ",
              <>
                <em className="italic text-maroon">thread</em>.
              </>,
            ]}
          />
        </div>

        {/* Lede + calls to action */}
        <div className="pb-10 pt-7 md:col-[1/6] md:row-[3/4] md:pb-12 md:pt-12">
          <Reveal delay={0.6} y={18}>
            <p className="text-lede max-w-[28rem] text-ink/80">
              Handwoven sarees, kurtis and tailored pants from India’s great weaving towns — made slowly, in
              small runs, for a wardrobe you keep.
            </p>
            {/* Side by side only where the column is wide enough: the md–xl text column is ~270–470px. */}
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-8 md:flex-col md:items-start md:gap-4 2xl:flex-row 2xl:items-center 2xl:gap-8">
              <Link href="/shop" className="btn btn-ink whitespace-nowrap">
                Shop the collection
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/shop?category=sarees"
                className="eyebrow group inline-flex min-h-11 items-center justify-center gap-3 sm:justify-start"
              >
                <span className="link-draw py-1">Discover sarees</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-editorial group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
            <HandwovenMark className="mt-8 md:mt-10" label="Handwoven in India · Small runs" />
            <div className="mt-10 hidden md:block">
              <ScrollCue />
            </div>
          </Reveal>
        </div>

        {/*
          Campaign imagery. On phones it leads the hero, full-bleed at about
          ~60% of the viewport (capped), so the first screen is the photograph
          with the headline starting just below it.
          From md it moves to the right half and bleeds to the edge.
        */}
        <div className="relative -mx-5 order-first md:order-none md:col-[7/13] md:row-[1/4] md:mx-0 md:-mr-10 xl:-mr-14">
          <ImageReveal
            animateOnMount
            delay={0.2}
            className="h-[60svh] max-h-[640px] min-h-[360px] w-full md:h-full md:max-h-none md:min-h-[560px]"
          >
            <Image
              src={editorial.hero.src}
              alt={editorial.hero.alt}
              fill
              preload
              quality={85}
              sizes="(min-width: 768px) 52vw, 100vw"
              className="object-cover object-[50%_28%]"
            />
          </ImageReveal>

          {/* Describes the cloth in the photograph (not a specific product), and leads to the sarees. */}
          <Link
            href="/shop?category=sarees"
            className="eyebrow group absolute right-4 top-4 z-10 flex min-h-11 items-center gap-3 bg-ivory/95 px-4 text-[10px] transition-colors duration-500 ease-editorial hover:bg-ivory md:right-6 md:top-6 xl:right-8"
          >
            <span className="text-maroon">AW26</span>
            <span className="link-draw py-0.5">Silk &amp; zari sarees</span>
          </Link>

          {/* Secondary print, matted in ivory, overlapping into the text column */}
          <div className="absolute bottom-[9%] -left-[17%] z-10 hidden w-[34%] max-w-[290px] bg-ivory p-2 md:block lg:p-2.5">
            <ImageReveal animateOnMount delay={0.75} from="left" className="aspect-[3/4]">
              <Image
                src={editorial.heroSecondary.src}
                alt={editorial.heroSecondary.alt}
                fill
                sizes="(min-width: 1280px) 290px, 18vw"
                className="object-cover"
              />
            </ImageReveal>
            <p className="eyebrow mt-2.5 text-[10px] text-stone">Zari border, detail</p>
          </div>
        </div>
      </div>

      <ThreadLine
        d={HERO_THREAD}
        viewBox="0 0 1440 360"
        offset={["start 135%", "end 45%"]}
        showTip
        className="absolute inset-x-0 -bottom-[14.5rem] z-20 h-[21.5rem] md:-bottom-[19rem] md:h-[28rem]"
      />
    </section>
  );
}
