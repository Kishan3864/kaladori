"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

/**
 * Hairline accordion. Closed panels stay in the DOM (height 0 + inert) so
 * the copy remains crawlable while hidden from keyboard and screen readers.
 */
export function Accordion({
  items,
  defaultOpen = [],
  className,
}: {
  items: AccordionItem[];
  defaultOpen?: string[];
  className?: string;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);

  const toggle = (id: string) =>
    setOpen((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className="border-b border-line">
            <h2 className="font-sans text-base tracking-normal">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left"
              >
                <span className="eyebrow transition-colors duration-300 group-hover:text-maroon">{item.title}</span>
                <span aria-hidden="true" className="relative block h-2.5 w-2.5 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                  <span
                    className={cn(
                      "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-editorial",
                      isOpen && "scale-y-0",
                    )}
                  />
                </span>
              </button>
            </h2>
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{
                height: { duration: 0.6, ease: EASE },
                opacity: { duration: isOpen ? 0.6 : 0.3, ease: EASE, delay: isOpen ? 0.1 : 0 },
              }}
              className="overflow-hidden"
            >
              <div className="pb-7 pr-2 text-[14.5px] leading-[1.75] text-ink/80">{item.content}</div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
