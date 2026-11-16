import { cn } from "@/lib/utils";

/** Four-point stitch star — the house's small decorative mark. */
export function Stitch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("shrink-0", className)} fill="currentColor">
      <path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z" />
    </svg>
  );
}

/** Small "Handwoven in India" provenance mark, set as an eyebrow with a maroon stitch. */
export function HandwovenMark({
  className,
  label = "Handwoven in India",
  tone = "dark",
}: {
  className?: string;
  label?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={cn(
        "eyebrow inline-flex items-center gap-2.5 text-[10px]",
        tone === "dark" ? "text-ink/70" : "text-ivory/75",
        className,
      )}
    >
      <Stitch className={cn("h-2.5 w-2.5", tone === "dark" ? "text-maroon" : "text-blush")} />
      <span>{label}</span>
    </p>
  );
}
