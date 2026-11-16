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

/** Four-point stitch star, drawn in SVG. */
function Stitch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("shrink-0", className)} fill="currentColor">
      <path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z" />
    </svg>
  );
}

/**
 * Full-bleed ink band. It sits above the hero thread (z-30), so the thread
 * appears to pass beneath it and resurface below.
 */
export function CategoryMarquee() {
  return (
    <section aria-label="Collections" data-marquee-group="" className="relative z-30 bg-ink text-ivory">
      <Marquee duration={46} className="py-6 md:py-9">
        {words.map((word) => (
          <span key={word.label} className="flex items-center">
            <span
              className={cn(
                "whitespace-nowrap px-6 font-display text-[2.75rem] leading-none tracking-[-0.02em] md:px-10 md:text-[5rem]",
                word.italic ? "italic text-ivory/65" : "text-ivory",
              )}
            >
              {word.label}
            </span>
            <Stitch className="h-3.5 w-3.5 text-blush md:h-5 md:w-5" />
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
