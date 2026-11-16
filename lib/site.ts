/** Canonical origin without a trailing slash (an empty env value falls back to the default). */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://kaladori.com").replace(/\/+$/, "");

export const site = {
  name: "KalaDori Textile",
  shortName: "KalaDori",
  url: siteUrl,
  tagline: "Handwoven heritage, cut for now.",
  description:
    "KalaDori Textile is a modern Indian label of handwoven sarees, kurtis and tailored pants — heirloom craft, made with restraint for the way you live now.",
  email: "hello@kaladori.com",
  /** Studio phone, e.g. "+91 98765 43210". Leave empty to hide the "Call" row on /contact. */
  phone: "" as string,
  instagram: "https://instagram.com/",
  /** Free-shipping threshold in INR, used by the cart drawer. */
  freeShippingThreshold: 4999,
  /** Static year — avoids `new Date()` during prerender (Cache Components). */
  year: 2026,
} as const;

/**
 * Client-care policy (sample copy). The single source for the product page,
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
