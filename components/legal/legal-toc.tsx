"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; title: string };

/**
 * Desktop table of contents. Plain anchor links; the current section is
 * highlighted with an IntersectionObserver (no URL hooks, no hash writes).
 */
export function LegalToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const ids = items.map((item) => item.id).join("|");

  useEffect(() => {
    const order = ids.split("|");
    const sections = order
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = order.find((id) => visible.has(id));
        if (current) setActive(current);
      },
      // A thin band a third of the way down the viewport decides the current section.
      { rootMargin: "-32% 0px -64% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return (
    <nav aria-label="On this page">
      <p className="eyebrow text-stone">On this page</p>
      <ol className="mt-6 border-l border-line">
        {items.map((item, index) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative -ml-px flex gap-3 border-l py-2 pl-5 pr-2 text-[13px] leading-snug transition-colors duration-300",
                  isActive
                    ? "border-maroon text-ink"
                    : "border-transparent text-stone hover:border-ink/30 hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "w-5 shrink-0 font-sans text-[10px] font-medium tracking-[0.12em] tabular-nums leading-[1.9]",
                    isActive ? "text-maroon" : "text-stone/70",
                  )}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
