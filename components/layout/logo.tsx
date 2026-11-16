import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand logo from /public/brand. `variant="dark"` (ink + maroon) for light
 * backgrounds, `variant="light"` (ivory + blush) for dark sections.
 * The SVG viewBox is 1349 × 479.
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
      preload={priority}
      unoptimized
      className={cn("h-auto w-full", !href && className)}
    />
  );

  if (!href) return img;

  return (
    <Link href={href} aria-label="KalaDori Textile — home" onClick={onClick} className={cn("block", className)}>
      {img}
    </Link>
  );
}
