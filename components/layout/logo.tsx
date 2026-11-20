import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * kaladori needle-and-thread logo (Kaladori-Logo-Kit, copied into
 * /public/brand; rendered as supplied, never redrawn or recoloured).
 *
 * Layouts (viewBox sizes from the kit):
 * - "horizontal": needle + kaladori + thread underline (910 × 252). Header, footer.
 *   Kit minimum: 140px wide.
 * - "stacked": needle above the name (794 × 520). Square spaces.
 * - "icon": the needle mark alone (157 × 248). Small spaces.
 *
 * Tones: "color" (black + maroon) for light backgrounds, "reverse" (cream +
 * blush) for dark ones, and "auto" (header) which renders both and lets CSS
 * pick, so the header can sit over the dark home hero.
 */
const LAYOUTS = {
  horizontal: { file: "kaladori-horizontal", width: 910, height: 252 },
  stacked: { file: "kaladori-stacked", width: 794, height: 520 },
  icon: { file: "kaladori-icon", width: 157, height: 248 },
} as const;

type Tone = "color" | "reverse";

export function Logo({
  layout = "horizontal",
  tone = "color",
  className,
  priority = false,
  href = "/",
  onClick,
}: {
  layout?: keyof typeof LAYOUTS;
  tone?: Tone | "auto";
  className?: string;
  /** Above the fold (header): load eagerly. It is never the LCP, so it is not preloaded. */
  priority?: boolean;
  href?: string | null;
  onClick?: () => void;
}) {
  const { file, width, height } = LAYOUTS[layout];

  const render = (t: Tone, extra?: string, decorative = false) => (
    <Image
      src={`/brand/${file}-${t}.svg`}
      alt={decorative ? "" : "kaladori"}
      width={width}
      height={height}
      loading={priority ? "eager" : undefined}
      unoptimized
      draggable={false}
      className={cn("block h-auto w-full select-none", extra, !href && className)}
    />
  );

  const img =
    tone === "auto" ? (
      <>
        {render("color", "logo-on-light")}
        {render("reverse", "logo-on-dark", true)}
      </>
    ) : (
      render(tone)
    );

  if (!href) return img;

  return (
    <Link
      href={href}
      aria-label="kaladori, home"
      onClick={onClick}
      className={cn("block transition-opacity duration-500 ease-editorial hover:opacity-80", className)}
    >
      {img}
    </Link>
  );
}
