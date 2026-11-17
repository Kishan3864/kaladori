import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * KalaDori lotus logo (pack in /public/brand/svg, rendered as supplied, never redrawn).
 *
 * Layouts (viewBox sizes from the pack):
 * - "header": lotus + KALA DORI (bold wordmark), for the site header (660 × 158)
 * - "horizontal": with the "Stitched like art" tagline (660 × 166)
 * - "stacked": lotus above the name and tagline (486 × 327)
 *
 * Tones: "color" for ivory / light grounds, "dark" for very dark grounds,
 * "maroon" for maroon grounds, and "auto" (header only) renders color + dark
 * and lets CSS pick, so the header can sit over the dark home hero.
 */
const LAYOUTS = {
  header: { file: "logo-header", width: 660, height: 158 },
  horizontal: { file: "logo-horizontal", width: 660, height: 166 },
  stacked: { file: "logo-stacked", width: 486, height: 327 },
} as const;

type Tone = "color" | "dark" | "maroon" | "white" | "black";

export function Logo({
  layout = "header",
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
      src={`/brand/svg/${file}-${t}.svg`}
      alt={decorative ? "" : "KalaDori Textile"}
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
        {render("dark", "logo-on-dark", true)}
      </>
    ) : (
      render(tone)
    );

  if (!href) return img;

  return (
    <Link
      href={href}
      aria-label="KalaDori Textile, home"
      onClick={onClick}
      className={cn("block transition-opacity duration-500 ease-editorial hover:opacity-80", className)}
    >
      {img}
    </Link>
  );
}
