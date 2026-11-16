import Link from "next/link";
import { Logo } from "@/components/layout/logo";
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
      { label: "Shipping & returns", href: "/contact#faq" },
      { label: "Size guidance", href: "/contact#faq" },
      { label: "Fabric care", href: "/contact#faq" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer id="site-footer" className="relative overflow-hidden bg-ink text-ivory">
      <div className="shell pb-10 pt-20 md:pt-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo variant="light" className="w-[180px] md:w-[220px]" />
            <p className="mt-10 max-w-[22ch] font-display text-3xl leading-[1.1] text-ivory md:text-4xl">
              Woven slowly. Worn for a lifetime.
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/60">{site.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:pl-12">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="eyebrow font-sans tracking-[0.26em] text-blush">{column.title}</h2>
                <ul className="mt-6 space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="link-draw text-[15px] text-ivory/80 hover:text-ivory">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3">
              <h2 className="eyebrow font-sans tracking-[0.26em] text-blush">Write to us</h2>
              <a
                href={`mailto:${site.email}`}
                className="link-draw mt-5 inline-block font-display text-2xl text-ivory md:text-3xl"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line-light pt-8 text-[12px] text-ivory/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {site.year} {site.name}. All rights reserved.
          </p>
          <p className="eyebrow text-[10px] text-ivory/50">Handwoven in India · Shipped worldwide</p>
        </div>
      </div>
    </footer>
  );
}
