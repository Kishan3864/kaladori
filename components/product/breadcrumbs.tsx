import Link from "next/link";
import { site } from "@/lib/site";
import { groupUnderline } from "./underline";

export type Crumb = {
  label: string;
  /** Omit for the current page. */
  href?: string;
};

/** Quiet editorial breadcrumb trail with matching BreadcrumbList structured data. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, site.url).toString() } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-stone">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-x-2.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="group inline-flex min-h-11 items-center tracking-wide transition-colors hover:text-ink sm:min-h-0 sm:py-1"
                >
                  <span className={groupUnderline}>{item.label}</span>
                </Link>
              ) : (
                <span aria-current="page" className="truncate text-ink">
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span aria-hidden="true" className="text-ink/25">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </nav>
  );
}
