import { cn } from "@/lib/utils";

const tones = {
  /** Ivory / sand sections. */
  dark: { label: "text-ink", index: "text-maroon" },
  /** Ink sections: blush index (6.2:1 on ink). */
  light: { label: "text-ivory/80", index: "text-blush" },
  /** Maroon sections: blush fails on maroon (2.5:1), so the index stays ivory. */
  maroon: { label: "text-ivory/90", index: "text-ivory" },
} as const;

/** Numbered section marker: "01 —— The collections". */
export function SectionEyebrow({
  index,
  label,
  tone = "dark",
  className,
}: {
  index: string;
  label: string;
  tone?: keyof typeof tones;
  className?: string;
}) {
  const colours = tones[tone];
  return (
    <p className={cn("eyebrow flex items-center gap-4", colours.label, className)}>
      <span className={colours.index}>{index}</span>
      <span aria-hidden="true" className="h-px w-10 bg-current opacity-40" />
      <span>{label}</span>
    </p>
  );
}
