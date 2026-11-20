"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import type { Category } from "@/data/products";
import { useEscapeKey, useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.76, 0, 0.24, 1] as const;

/** Body measurements in inches. */
const ROWS = [
  { size: "XS", bust: 32, waist: 26, hip: 35 },
  { size: "S", bust: 34, waist: 28, hip: 37 },
  { size: "M", bust: 36, waist: 30, hip: 39 },
  { size: "L", bust: 38, waist: 32, hip: 41 },
  { size: "XL", bust: 40, waist: 34, hip: 43 },
  { size: "XXL", bust: 42, waist: 36, hip: 45 },
] as const;

const HOW_TO = [
  { title: "Bust", text: "Measure around the fullest part of the chest, keeping the tape level under the arms." },
  { title: "Waist", text: "Measure around your natural waistline — the narrowest part of the torso." },
  { title: "Hip", text: "Stand with feet together and measure around the fullest part of the hips." },
] as const;

const FIT_NOTES: Partial<Record<Category, string>> = {
  kurtis:
    "Our kurtis are cut with gentle ease through the body. If you are between sizes, take the smaller for a closer line or the larger for a relaxed drape.",
};

type SizeGuideProps = {
  open: boolean;
  onClose: () => void;
  category: Category;
  /** Highlight this row, if it is in the chart. */
  selectedSize?: string | null;
};

export function SizeGuide({ open, onClose, category, selectedSize }: SizeGuideProps) {
  return (
    <AnimatePresence>
      {open ? <SizeGuideSheet key="size-guide" onClose={onClose} category={category} selectedSize={selectedSize} /> : null}
    </AnimatePresence>
  );
}

function SizeGuideSheet({ onClose, category, selectedSize }: Omit<SizeGuideProps, "open">) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [unit, setUnit] = useState<"in" | "cm">("in");

  useFocusTrap(panelRef, closeRef);
  useLockBodyScroll(true);
  useEscapeKey(true, onClose);

  const format = (inches: number) => (unit === "in" ? String(inches) : String(Math.round(inches * 2.54)));
  const fitNote = FIT_NOTES[category];

  return (
    <div className="fixed inset-0 z-[65]">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-ink/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-ivory outline-none sm:max-w-[500px]"
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5 sm:px-10">
          <h2 id="size-guide-title" className="font-display text-2xl">
            Size guide
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="eyebrow -mr-2 flex h-11 items-center gap-2 px-2"
          >
            Close
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-12 pt-8 sm:px-10">
          <p className="text-[15px] font-light leading-relaxed text-ink/80">
            Measurements refer to the body, not the garment. Each piece is cut with ease, so choose the size that
            matches your own measurements most closely.
          </p>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p id="size-guide-units" className="eyebrow text-stone">
              Units
            </p>
            <div role="group" aria-labelledby="size-guide-units" className="flex border border-line">
              {(["in", "cm"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={unit === option}
                  onClick={() => setUnit(option)}
                  className={cn(
                    "eyebrow h-11 w-16 transition-colors duration-300",
                    unit === option ? "bg-ink text-ivory" : "text-ink hover:text-maroon",
                  )}
                >
                  {option === "in" ? "Inches" : "Cm"}
                </button>
              ))}
            </div>
          </div>

          <table className="mt-6 w-full border-collapse text-left text-[14px] tabular-nums">
            <caption className="sr-only">Body measurements in {unit === "in" ? "inches" : "centimetres"}</caption>
            <thead>
              <tr className="border-b border-ink">
                {["Size", "Bust", "Waist", "Hip"].map((heading) => (
                  <th key={heading} scope="col" className="eyebrow py-3 pr-2 font-medium text-stone last:pr-0 last:text-right">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const isSelected = row.size === selectedSize;
                return (
                  <tr key={row.size} className={cn("border-b border-line", isSelected && "bg-sand/70")}>
                    <th scope="row" className="py-3.5 pl-0 pr-2 font-normal">
                      <span className={cn(isSelected && "text-maroon")}>{row.size}</span>
                    </th>
                    <td className="py-3.5 pr-2">{format(row.bust)}</td>
                    <td className="py-3.5 pr-2">{format(row.waist)}</td>
                    <td className="py-3.5 text-right">{format(row.hip)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {fitNote ? <p className="mt-6 text-[13.5px] leading-relaxed text-stone">{fitNote}</p> : null}

          <h3 className="mt-12 font-display text-xl">How to measure</h3>
          <ol className="mt-5 space-y-5">
            {HOW_TO.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.25rem_1fr] gap-2">
                <span className="eyebrow pt-1 text-maroon">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[14px] leading-relaxed text-ink/80">
                  <span className="text-ink">{step.title}.</span> {step.text}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 bg-sand px-6 py-6">
            <p className="eyebrow">Still unsure?</p>
            <p className="mt-3 text-[14px] leading-relaxed text-ink/80">
              Write to the atelier at{" "}
              <a href={`mailto:${site.email}`} className="link-draw text-ink">
                {site.email}
              </a>{" "}
              with your measurements and we will recommend a size.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
