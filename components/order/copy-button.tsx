"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Copies `value` to the clipboard and confirms briefly. */
export function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={state === "copied" ? `${label} copied` : `Copy ${label}`}
      className={cn(
        "eyebrow inline-flex min-h-11 shrink-0 items-center gap-2 border border-ink/20 px-3.5 text-[10px] transition-colors duration-300 hover:border-ink",
        state === "copied" && "border-maroon text-maroon hover:border-maroon",
        className,
      )}
    >
      {state === "copied" ? (
        <svg width="11" height="9" viewBox="0 0 12 10" fill="none" aria-hidden="true">
          <path d="M1 5.2 4.3 8.5 11 1.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="3.5" y="3.5" width="8" height="8" stroke="currentColor" strokeWidth="1.1" />
          <path d="M8.5 1.5V.5h-8v8h1" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      )}
      <span aria-live="polite">{state === "copied" ? "Copied" : state === "failed" ? "Select to copy" : "Copy"}</span>
    </button>
  );
}
