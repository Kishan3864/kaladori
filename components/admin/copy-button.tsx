"use client";

import { useState } from "react";

/** Copies a value (e.g. a UTR) so it can be pasted into the bank / UPI app search. */
export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard blocked — the value is still selectable */
        }
      }}
      className="eyebrow border border-line px-2 py-1.5 text-stone transition-colors hover:border-ink hover:text-ink"
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
