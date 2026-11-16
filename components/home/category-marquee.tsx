import { Stitch } from "@/components/home/brand-mark";
import { Marquee } from "@/components/motion/marquee";
import { MarqueeToggle } from "@/components/motion/marquee-toggle";
import { cn } from "@/lib/utils";

const words = [
  { label: "Sarees", italic: false },
  { label: "Handwoven in India", italic: true },
  { label: "Kurtis", italic: false },
  { label: "Natural fibres", italic: true },
  { label: "Pants", italic: false },
  { label: "Finished by hand", italic: true },
];

const crafts = [
  "Banarasi silk",
  "Chanderi",
  "Chikankari",
  "Bagru block print",
  "Real zari",
  "Handloom mul",
  "Natural indigo",
  "Washed linen",
];

/**
 * Full-bleed ink band. It sits above the hero thread (z-30), so the thread
 * appears to pass beneath it and resurface below.
 */
export function CategoryMarquee() {
  return (
    <section aria-label="Collections" data-marquee-group="" className="relative z-30 bg-ink text-ivory">
      <Marquee duration={46} className="py-5 md:py-7">
        {words.map((word) => (
          <span key={word.label} className="flex items-center">
            <span
              className={cn(
                "whitespace-nowrap px-5 font-display text-[2rem] leading-none tracking-[-0.02em] md:px-9 md:text-[3.25rem]",
                word.italic ? "italic text-ivory/65" : "text-ivory",
              )}
            >
              {word.label}
            </span>
            <Stitch className="h-3 w-3 text-blush md:h-4 md:w-4" />
          </span>
        ))}
      </Marquee>

      <div className="relative border-t border-line-light">
        {/* Pause control for both bands, set in its own hairline cell at the end of the craft line. */}
        <div className="absolute inset-y-0 right-0 z-10 flex items-center border-l border-line-light bg-ink px-3 motion-reduce:hidden md:px-5">
          <MarqueeToggle />
        </div>
        <Marquee duration={64} reverse className="py-4 md:py-5">
          {crafts.map((craft) => (
            <span key={craft} className="flex items-center">
              <span className="eyebrow whitespace-nowrap px-6 text-[10px] text-ivory/60 md:px-9 md:text-[11px]">
                {craft}
              </span>
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-blush" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
