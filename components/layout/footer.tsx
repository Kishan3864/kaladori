import Link from "next/link";
import { WhatsAppGlyph } from "@/components/checkout/whatsapp-glyph";
import { Logo } from "@/components/layout/logo";
import { addressText, mailHref, policyPages, telHref, whatsappHref } from "@/components/legal/policy-data";
import { navigation, site, type NavLink } from "@/lib/site";

const houseColumns = [
  {
    title: "The house",
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
  { title: "Policies", links: policyPages },
] as const;

/** Light, quiet footer: brand and order line on the left, four short link columns on the right. */
export function Footer({ shop = navigation.primary }: { shop?: readonly NavLink[] }) {
  const columns = [{ title: "Shop", links: shop }, ...houseColumns];
  return (
    <footer id="site-footer" className="border-t border-line bg-sand/50">
      <div className="shell pb-8 pt-16 md:pt-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo layout="horizontal" className="w-[200px]" />
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-stone">
              Handwoven sarees, kurtis and pants. Order on WhatsApp, pay by UPI.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ink min-h-11 px-6">
                <WhatsAppGlyph size={15} />
                WhatsApp us
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a href={telHref} className="link-draw text-[15px] tabular-nums">
                {site.phone}
              </a>
            </div>
            <p className="mt-4 text-[13px] text-stone">{site.hours}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="font-sans text-[13px] font-medium tracking-normal text-ink">{column.title}</h2>
                <ul className="mt-4 space-y-0.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-10 items-center text-[14px] text-stone transition-colors duration-300 hover:text-ink sm:min-h-8"
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

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-[12px] text-stone md:mt-20 md:flex-row md:items-center md:justify-between">
          <p>
            © {site.year} {site.name}. Founded by {site.owner}, {site.city}. {addressText}.
          </p>
          <a href={mailHref} className="link-draw w-fit">
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
