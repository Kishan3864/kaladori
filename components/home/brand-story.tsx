import Image from "next/image";
import Link from "next/link";
import { SectionEyebrow } from "@/components/home/section-eyebrow";
import { ImageReveal } from "@/components/motion/image-reveal";
import { MaskedLines, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ThreadLine } from "@/components/motion/thread-line";
import { editorial } from "@/lib/images";

const figures = [
  { value: "42", label: "Artisan families" },
  { value: "5", label: "Craft clusters" },
  { value: "19", label: "Days to weave one Banarasi" },
];

export function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-sand py-24 md:py-36">
      {/* The thread runs the full height of the panel, between image and text. */}
      <ThreadLine
        preset="meander"
        className="absolute inset-y-0 -right-20 z-[5] w-48 md:left-[47%] md:right-auto md:w-72 md:-translate-x-1/2 lg:w-80"
      />

      <div className="shell relative grid gap-y-20 md:grid-cols-12 md:gap-x-6 lg:gap-x-8">
        {/* Imagery */}
        <div className="relative mb-12 md:col-span-6 md:mb-0 lg:col-span-6">
          <ImageReveal className="aspect-[4/5] w-[88%] md:w-full">
            <Image
              src={editorial.story.src}
              alt={editorial.story.alt}
              fill
              sizes="(min-width: 768px) 48vw, 88vw"
              className="object-cover"
            />
          </ImageReveal>
          <p className="eyebrow mt-4 max-w-[48%] text-[10px] leading-[1.6] text-stone md:max-w-none">
            Fig. 01 — A pit loom, Varanasi
          </p>

          <div className="absolute -bottom-12 right-0 z-10 w-[46%] bg-sand p-2 md:-bottom-16 md:-right-[14%] md:w-[42%] lg:p-2.5">
            <ImageReveal delay={0.25} from="top" className="aspect-[3/4]">
              <Image
                src={editorial.storySecondary.src}
                alt={editorial.storySecondary.alt}
                fill
                sizes="(min-width: 768px) 20vw, 44vw"
                className="object-cover"
              />
            </ImageReveal>
          </div>
        </div>

        {/* Text */}
        <div className="relative z-10 md:col-span-5 md:col-start-8 md:self-center md:pt-10">
          <SectionEyebrow index="03" label="The house" />
          <MaskedLines
            className="mt-7 font-display text-[2.5rem] leading-[1] tracking-[-0.025em] md:text-[3.25rem] xl:text-[4.25rem]"
            lines={[
              "Slow cloth, ",
              <>
                for a <em className="italic">long</em> life.
              </>,
            ]}
          />

          <Reveal delay={0.1} className="mt-9 space-y-5 text-[15px] leading-[1.75] text-ink/80 md:text-base">
            <p>
              KalaDori began at a single pit loom in Varanasi, with a simple conviction: the most modern thing a
              garment can be is lasting. Today we work with weaving and embroidery families in Varanasi, Chanderi,
              Lucknow, Bagru and Phulia — people we know by name.
            </p>
            <p>
              We make in small runs, choose natural fibres and honest dyes, and pay for time. A Banarasi pallu can
              take nineteen days at the loom. We think it should.
            </p>
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-3 border-y border-line" stagger={0.1}>
            {figures.map((figure, i) => (
              <StaggerItem
                key={figure.label}
                className={i === 0 ? "py-6 pr-3" : "border-l border-line py-6 pl-4 pr-2 md:pl-6"}
              >
                <p className="font-display text-[2.25rem] leading-none tracking-[-0.02em] md:text-[2.75rem]">
                  {figure.value}
                </p>
                <p className="eyebrow mt-3 text-[10px] leading-[1.5] text-stone">{figure.label}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} className="mt-10">
            <Link href="/about" className="btn btn-outline">
              Our story
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
