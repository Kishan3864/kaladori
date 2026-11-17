/** Canonical origin without a trailing slash (an empty env value falls back to the default). */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://kaladori.empireevent.org").replace(/\/+$/, "");

export const site = {
  name: "KalaDori Textile",
  shortName: "KalaDori",
  url: siteUrl,
  tagline: "Stitched like art.",
  description:
    "KalaDori Textile is a modern Indian label of handwoven sarees, kurtis and tailored pants — heirloom craft, made with restraint for the way you live now.",
  email: "hello@kaladori.com",
  /** Founder & proprietor. */
  owner: "Komal Patel",
  /** Company phone (also the WhatsApp ordering line). */
  phone: "+91 92650 08264" as string,
  /** WhatsApp number in international format, digits only (for wa.me links). */
  whatsapp: "919265008264",
  /** Order / payment hours shown next to WhatsApp CTAs. */
  hours: "Monday–Saturday, 10am–7pm IST",
  country: "India",
  /** Registered business address — fill in before launch; UI hides it while empty. */
  address: "" as string,
  /** City / state shown publicly. */
  city: "Gujarat, India",
  instagram: "https://instagram.com/",
  /** Free-shipping threshold in INR, used by the cart drawer. */
  freeShippingThreshold: 4999,
  /** Static year — avoids `new Date()` during prerender (Cache Components). */
  year: 2026,
} as const;

/**
 * Client-care policy. The single source for the product page,
 * the bag, the FAQ and structured data, so they never disagree.
 */
export const policies = {
  /** Working days before an order leaves the atelier. */
  dispatchDays: 2,
  /** Working days in transit within India. */
  deliveryMetroDays: [3, 5],
  deliveryElsewhereDays: [5, 8],
  /** Flat shipping (INR) within India below the free-shipping threshold. */
  flatShipping: 250,
  /** Days after delivery to return or exchange full-price pieces. */
  returnDays: 14,
} as const;

/**
 * Messages rotating in the announcement bar above the header. Keep them true:
 * add a real offer here (for example a festive discount) when there is one.
 */
export const announcements = [
  `Free shipping across India over ₹${site.freeShippingThreshold.toLocaleString("en-IN")}`,
  "The Festive Edit 2026 is here",
  `Order on WhatsApp, pay by UPI, ${policies.returnDays}-day returns`,
] as const;

export type NavLink = { label: string; href: string };

/** "Shop all" plus one link per category, in the admin's order. */
export function shopLinks(categories: { name: string; slug: string }[]): NavLink[] {
  return [{ label: "Shop all", href: "/shop" }, ...categories.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` }))];
}

export const navigation = {
  primary: [
    { label: "Shop all", href: "/shop" },
    { label: "Sarees", href: "/shop?category=sarees" },
    { label: "Kurtis", href: "/shop?category=kurtis" },
    { label: "Pants", href: "/shop?category=pants" },
  ],
  secondary: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
