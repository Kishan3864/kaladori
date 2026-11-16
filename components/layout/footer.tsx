import Link from "next/link";
import { WhatsAppGlyph } from "@/components/checkout/whatsapp-glyph";
import { Logo } from "@/components/layout/logo";
import { addressText, mailHref, policyPages, telHref, whatsappHref } from "@/components/legal/policy-data";
import { navigation, site } from "@/lib/site";

const columns = [
  {
    title: "Shop",
    links: navigation.primary,
  },
  {
    title: "The House",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Craft & makers", href: "/about#craft" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Client care",
    links: [
      { label: "How to order", href: "/contact#faq-ordering" },
      { label: "Paying by UPI", href: "/contact#faq-payment" },
      { label: "Size guidance", href: "/contact#faq-sizing" },
      { label: "Fabric care", href: "/contact#faq-care" },
    ],
  },
  {
    title: "Policies",
    links: policyPages,
  },
] as const;

export function Footer() {
  return (
    <footer id="site-footer" className="relative overflow-hidden bg-ink text-ivory">
      <div className="shell pb-10 pt-16 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Logo variant="light" className="w-[230px] sm:w-[270px] md:w-[320px]" />
            <p className="mt-10 max-w-[20ch] font-display text-3xl leading-[1.1] text-ivory md:text-4xl">
              Woven slowly. Worn for a lifetime.
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/60">{site.description}</p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:col-span-8 lg:pl-8 xl:pl-16"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="eyebrow font-sans tracking-[0.26em] text-blush">{column.title}</h2>
                <ul className="mt-5 space-y-1 md:mt-6">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-[40px] items-center py-1 text-[15px] leading-snug text-ivory/80 hover:text-ivory sm:min-h-0"
                      >
                        <span className="link-draw">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Real contact block: order line, email, and the people behind the house. */}
        <div className="mt-16 grid gap-12 border-t border-line-light pt-12 md:mt-20 md:grid-cols-12 md:gap-8 md:pt-14">
          <div className="md:col-span-6 lg:col-span-5">
            <h2 className="eyebrow font-sans tracking-[0.26em] text-blush">Order on WhatsApp or call</h2>
            <a
              href={telHref}
              className="link-draw mt-5 inline-block font-display text-[2rem] leading-tight text-ivory md:text-[2.5rem]"
            >
              {site.phone}
            </a>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                <WhatsAppGlyph size={16} />
                WhatsApp us
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href={telHref}
                className="btn border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink"
              >
                Call now
              </a>
            </div>
            <p className="mt-5 text-[13px] text-ivory/60">{site.hours}</p>
          </div>

          <div className="md:col-span-6 lg:col-span-4">
            <h2 className="eyebrow font-sans tracking-[0.26em] text-blush">Write to us</h2>
            <a
              href={mailHref}
              className="link-draw mt-5 inline-block break-all font-display text-2xl leading-tight text-ivory md:text-[1.75rem]"
            >
              {site.email}
            </a>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-ivory/60">
              Pay securely by UPI after you order. We verify every payment by hand and confirm on WhatsApp.
            </p>
          </div>

          <div className="md:col-span-12 lg:col-span-3">
            <h2 className="eyebrow font-sans tracking-[0.26em] text-blush">The atelier</h2>
            <p className="mt-5 font-display text-xl leading-snug text-ivory">Founded by {site.owner}</p>
            <address className="mt-3 text-[14px] not-italic leading-relaxed text-ivory/70">
              {site.city}
              <span className="block text-ivory/50">{addressText}</span>
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-line-light pt-8 text-[12px] text-ivory/50 md:mt-20 md:flex-row md:items-center md:justify-between">
          <p>
            © {site.year} {site.name}. All rights reserved.
          </p>
          <p className="eyebrow text-[10px] text-ivory/50">Handwoven in India · Delivered across India</p>
        </div>
      </div>
    </footer>
  );
}
