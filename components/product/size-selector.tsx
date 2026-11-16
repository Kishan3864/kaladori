"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

type SizeSelectorProps = {
  sizes: string[];
  value: string | null;
  onChange: (size: string) => void;
  /** id of the visible label element. */
  labelledBy: string;
  /** id of the error message, when shown. */
  errorId?: string;
  invalid?: boolean;
  /** Receives the radiogroup element so the parent can move focus to it. */
  groupRef?: React.Ref<HTMLDivElement>;
};

/**
 * Square size chips with radio-group semantics: one tab stop, arrow keys
 * move and select, Home / End jump to the ends.
 */
export function SizeSelector({ sizes, value, onChange, labelledBy, errorId, invalid, groupRef }: SizeSelectorProps) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const single = sizes.length === 1;
  const selectedIndex = value ? sizes.indexOf(value) : -1;
  const tabStop = selectedIndex >= 0 ? selectedIndex : 0;

  const select = (index: number) => {
    const size = sizes[index];
    if (!size) return;
    onChange(size);
    buttons.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = sizes.length - 1;
    let next: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
    }
    if (next !== null) {
      event.preventDefault();
      select(next);
    }
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-required="true"
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? errorId : undefined}
      className={cn(single ? "flex" : "grid grid-cols-6 gap-1.5 sm:gap-2")}
    >
      {sizes.map((size, index) => {
        const checked = value === size;
        return (
          <button
            key={size}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={index === tabStop ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "flex h-12 items-center justify-center border text-[12.5px] uppercase tracking-[0.12em] transition-colors duration-300",
              single ? "px-7" : "min-w-0 px-1",
              checked
                ? "border-ink bg-ink text-ivory"
                : invalid
                  ? "border-maroon/60 text-ink hover:border-maroon"
                  : "border-line text-ink hover:border-ink",
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
