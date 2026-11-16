import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds for one full loop. */
  duration?: number;
  /** Scroll right-to-left (default) or left-to-right. */
  reverse?: boolean;
};

/**
 * Infinite CSS marquee. Children are rendered twice; the duplicate is hidden
 * from assistive tech. Pauses on hover; stops under reduced motion.
 */
export function Marquee({ children, className, duration = 38, reverse = false }: MarqueeProps) {
  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      <div
        className="flex w-max shrink-0 animate-marquee group-hover:[animation-play-state:paused]"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
