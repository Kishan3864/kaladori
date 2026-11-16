import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Reading column for policy copy: ~68ch measure, generous leading. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-[68ch] space-y-5 text-[15px] leading-[1.8] text-ink/80 md:text-base",
        "[&_strong]:font-medium [&_strong]:text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small serif sub-heading inside a numbered section. */
export function Sub({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-3 font-display text-[1.25rem] leading-snug tracking-[-0.01em] text-ink md:text-[1.375rem]">
      {children}
    </h3>
  );
}

/** Bulleted (maroon rule) or numbered list. */
export function List({ items, ordered = false }: { items: ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="relative pl-8">
          {ordered ? (
            <span
              className="absolute left-0 top-[0.2em] font-sans text-[11px] font-medium tracking-[0.12em] text-maroon"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : (
            <span className="absolute left-0 top-[0.9em] h-px w-4 bg-maroon" aria-hidden="true" />
          )}
          {item}
        </li>
      ))}
    </Tag>
  );
}

/** Two-column term / detail rows, e.g. delivery timelines. */
export function Facts({ items }: { items: { term: ReactNode; detail: ReactNode }[] }) {
  return (
    <dl className="border-t border-line">
      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-1 border-b border-line py-4 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-6"
        >
          <dt className="eyebrow pt-1 text-stone">{item.term}</dt>
          <dd className="text-ink">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Quiet callout for the one thing a reader must not miss. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <aside className="border-l-2 border-maroon bg-blush/10 px-5 py-4 text-ink md:px-6">
      {children}
    </aside>
  );
}

/** Inline link: next/link for internal paths, plain anchor for tel:, mailto: and external URLs. */
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  const className =
    "text-ink underline decoration-maroon/40 decoration-1 underline-offset-[5px] transition-colors duration-300 hover:text-maroon hover:decoration-maroon";

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}
