import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand logo from /public/brand (rendered as supplied, never redrawn).
 * `variant="dark"` (ink + maroon) for light backgrounds, `variant="light"`
 * (ivory + blush) for dark sections. The SVG viewBox is 1349 × 479, so the
 * rendered height is width ÷ 2.82.
 *
 * The "TEXTILE" line is small inside the artwork itself, so keep the logo
 * at least ~140px wide wherever it appears (header 140–208px, footer 220px+).
 */
export function Logo({
  variant = "dark",
  className,
  priority = false,
  href = "/",
  onClick,
}: {
  variant?: "dark" | "light";
  className?: string;
  /** Above the fold (header): load eagerly. It is never the LCP, so it is not preloaded. */
  priority?: boolean;
  href?: string | null;
  onClick?: () => void;
}) {
  const img = (
    <Image
      src={variant === "light" ? "/brand/kaladori-logo-light.svg" : "/brand/kaladori-logo.svg"}
      alt="KalaDori Textile"
      width={1349}
      height={479}
      loading={priority ? "eager" : undefined}
      unoptimized
      draggable={false}
      className={cn("block h-auto w-full select-none", !href && className)}
    />
  );

  if (!href) return img;

  return (
    <Link
      href={href}
      aria-label="KalaDori Textile — home"
      onClick={onClick}
      className={cn("block transition-opacity duration-500 ease-editorial hover:opacity-80", className)}
    >
      {img}
    </Link>
  );
}
