import Link from "next/link";
import { WhatsAppGlyph } from "@/components/checkout/whatsapp-glyph";
import { addressText, mailHref, policyPages, telHref, whatsappHref } from "@/components/legal/policy-data";
import { Facts, TextLink } from "@/components/legal/prose";
import { site } from "@/lib/site";

/** Grievance Officer details (IT Act, DPDP Act and Consumer Protection (E-Commerce) Rules). */
export function GrievanceOfficer() {
  return (
    <Facts
      items={[
        {
          term: "Grievance Officer",
          detail: (
            <>
              {site.owner}
              <span className="block text-[14px] text-stone">Founder &amp; Proprietor, {site.name}</span>
            </>
          ),
        },
        {
          term: "Phone & WhatsApp",
          detail: (
            <>
              <TextLink href={telHref}>{site.phone}</TextLink>
              <span className="mx-2 text-stone" aria-hidden="true">
                ·
              </span>
              <TextLink href={whatsappHref}>Message on WhatsApp</TextLink>
            </>
          ),
        },
        { term: "Email", detail: <TextLink href={mailHref}>{site.email}</TextLink> },
        { term: "Address", detail: addressText },
        { term: "Hours", detail: site.hours },
        {
          term: "Response time",
          detail: "Acknowledged within 48 hours and resolved within 30 days of receipt.",
        },
      ]}
    />
  );
}

/** Closing panel on every policy page: talk to us, then read the related policies. */
export function LegalClosing({ current }: { current: string }) {
  const related = policyPages.filter((page) => page.href !== current);

  return (
    <div className="mt-20 md:mt-24">
      <div className="bg-ink px-6 py-10 text-ivory sm:px-10 md:py-12">
        <p className="eyebrow text-blush">Still have a question?</p>
        <h2 className="mt-5 max-w-[24ch] font-display text-[1.75rem] leading-[1.12] md:text-[2.25rem]">
          Talk to us. A real person at the atelier will answer.
        </h2>
        <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-ivory/70">
          WhatsApp is the quickest way to reach us about an order, a payment or a return. We reply{" "}
          {site.hours.replace("–", " to ")}.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-light">
            <WhatsAppGlyph size={16} />
            WhatsApp us
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href={telHref}
            className="btn border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink"
          >
            Call {site.phone}
          </a>
        </div>
        <p className="mt-8 text-[14px] leading-relaxed text-ivory/60">
          Or write to{" "}
          <a href={mailHref} className="link-draw text-ivory">
            {site.email}
          </a>
          , or use the{" "}
          <Link href="/contact" className="link-draw text-ivory">
            contact form
          </Link>
          .
        </p>
      </div>

      <nav aria-label="Related policies" className="mt-14">
        <p className="eyebrow text-stone">Related policies</p>
        <ul className="mt-6 grid grid-cols-1 border-t border-line sm:grid-cols-3 sm:gap-6 sm:border-t-0">
          {related.map((page) => (
            <li key={page.href} className="border-b border-line sm:border-b-0 sm:border-t">
              <Link href={page.href} className="group flex h-full flex-col gap-2 py-5 sm:pt-6">
                <span className="flex items-baseline justify-between gap-4 font-display text-[1.25rem] leading-tight transition-colors duration-300 group-hover:text-maroon">
                  {page.label}
                  <span
                    aria-hidden="true"
                    className="font-sans text-base transition-transform duration-500 ease-editorial group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </span>
                <span className="text-[13px] leading-relaxed text-stone">{page.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
