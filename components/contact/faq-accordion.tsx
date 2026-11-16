"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";
import type { FaqItem } from "@/components/contact/faq-data";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Accessible disclosure list: each question is a button (aria-expanded /
 * aria-controls) inside a heading. Answers stay in the DOM so they are
 * crawlable; collapsed panels are `inert` and animate to height 0.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const uid = useId();
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set(items[0] ? [items[0].id] : []));

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="border-t border-ink/15">
      {items.map((item, index) => {
        const isOpen = open.has(item.id);
        const buttonId = `${uid}-faq-${item.id}-button`;
        const panelId = `${uid}-faq-${item.id}-panel`;

        return (
          <div key={item.id} className="border-b border-ink/15">
            <h3 className="font-sans text-base font-normal tracking-normal">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex min-h-[44px] w-full items-start gap-4 py-6 text-left md:gap-8 md:py-8"
              >
                <span className="eyebrow w-7 shrink-0 pt-[0.6em] text-[10px] text-maroon md:w-10" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-[1.375rem] leading-[1.2] tracking-[-0.01em] transition-colors duration-500 group-hover:text-maroon md:text-[1.75rem]">
                  {item.question}
                </span>
                <span className="relative mt-[0.55em] block h-3.5 w-3.5 shrink-0 md:mt-3" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink" />
                  <span
                    className={cn(
                      "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink transition-transform duration-500 ease-editorial",
                      isOpen && "rotate-90 scale-y-0",
                    )}
                  />
                </span>
              </button>
            </h3>

            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{
                height: { duration: 0.7, ease: EASE },
                opacity: { duration: isOpen ? 0.6 : 0.3, ease: "easeOut", delay: isOpen ? 0.12 : 0 },
              }}
              className="overflow-hidden"
            >
              <div className="max-w-[62ch] space-y-4 pb-8 pl-11 pr-8 text-[15px] leading-relaxed text-ink/75 md:pb-10 md:pl-[4.5rem] md:text-base">
                {item.answer.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
