import type { ReactNode } from "react";
import { LegalClosing } from "@/components/legal/legal-contact";
import { LegalToc, type TocItem } from "@/components/legal/legal-toc";
import { LAST_UPDATED } from "@/components/legal/policy-data";
import { Prose } from "@/components/legal/prose";

export type LegalSection = TocItem & { body: ReactNode };

/**
 * Editorial policy document: eyebrow, serif title, an "in short" summary,
 * numbered anchored sections, a sticky table of contents on desktop and a
 * collapsible one on smaller screens, then contact and related policies.
 */
export function LegalPage({
  path,
  eyebrow,
  title,
  intro,
  summary,
  sections,
}: {
  /** Route of this page, e.g. "/terms" (excluded from the related links). */
  path: string;
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  summary: ReactNode[];
  sections: LegalSection[];
}) {
  const toc: TocItem[] = sections.map(({ id, title: sectionTitle }) => ({ id, title: sectionTitle }));

  return (
    <article className="shell pb-24 pt-14 md:pb-32 md:pt-24">
      <header className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-3 lg:pt-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-maroon" aria-hidden="true" />
            <p className="eyebrow text-maroon">{eyebrow}</p>
          </div>
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <h1 className="text-title">{title}</h1>
          <p className="mt-6 max-w-[60ch] text-lede text-ink/80 md:mt-8">{intro}</p>
          <p className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px] text-stone">
            <span className="eyebrow text-[10px]">Last updated</span>
            <time dateTime={LAST_UPDATED.iso}>{LAST_UPDATED.label}</time>
          </p>
        </div>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-y-10 md:mt-16 lg:grid-cols-12 lg:gap-x-8">
        <aside className="lg:col-span-3">
          {/* Phones and tablets: collapsible contents. */}
          <details className="group border-y border-line lg:hidden">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="eyebrow text-ink">On this page</span>
              <span className="relative block h-3 w-3" aria-hidden="true">
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink" />
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink transition-transform duration-500 ease-editorial group-open:scale-y-0" />
              </span>
            </summary>
            <ol className="pb-4">
              {toc.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex min-h-[44px] items-center gap-4 py-1 text-[15px] leading-snug text-ink/80 hover:text-maroon"
                  >
                    <span
                      className="w-6 shrink-0 text-[10px] font-medium tracking-[0.12em] text-maroon"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          {/* Desktop: sticky contents with the current section highlighted. */}
          <div className="hidden lg:sticky lg:top-[calc(var(--header-offset)+2.5rem)] lg:block lg:transition-[top] lg:duration-500">
            <LegalToc items={toc} />
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-8 lg:col-start-5">
          <section aria-label="Summary" className="max-w-[68ch] border border-line bg-sand/50 p-6 sm:p-8 md:p-10">
            <p className="eyebrow text-maroon">In short</p>
            <ul className="mt-6 space-y-3.5 text-[15px] leading-relaxed text-ink/85">
              {summary.map((point, index) => (
                <li key={index} className="relative pl-8">
                  <span className="absolute left-0 top-[0.8em] h-px w-4 bg-maroon" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-14 space-y-14 md:mt-20 md:space-y-16">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="max-w-[68ch] scroll-mt-28 border-t border-line pt-8 md:pt-10"
              >
                <p className="eyebrow text-maroon" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 id={`${section.id}-title`} className="mt-4 font-display text-[1.625rem] leading-[1.15] md:text-[2rem]">
                  {section.title}
                </h2>
                <Prose className="mt-6">{section.body}</Prose>
              </section>
            ))}
          </div>

          <LegalClosing current={path} />
        </div>
      </div>
    </article>
  );
}
