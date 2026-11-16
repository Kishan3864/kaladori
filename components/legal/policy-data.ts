import type { Metadata } from "next";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

/** Static on purpose: Cache Components forbids `new Date()` during prerender. */
export const LAST_UPDATED = { label: "16 November 2026", iso: "2026-11-16" } as const;

export type PolicyLink = { href: string; label: string; blurb: string };

/** The four client-care policies, in reading order. Used by the footer, sitemap and cross-links. */
export const policyPages = [
  {
    href: "/privacy-policy",
    label: "Privacy Policy",
    blurb: "What we collect, why we collect it, and your rights over it.",
  },
  {
    href: "/terms",
    label: "Terms & Conditions",
    blurb: "How ordering, UPI payment and confirmation work on KalaDori.",
  },
  {
    href: "/shipping-policy",
    label: "Shipping Policy",
    blurb: "Dispatch times, delivery across India, charges and tracking.",
  },
  {
    href: "/refund-policy",
    label: "Returns & Refunds",
    blurb: "Returns, exchanges, refunds to UPI, and cancellations.",
  },
] as const satisfies readonly PolicyLink[];

export const telHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;
export const whatsappHref = whatsappLink();
export const mailHref = `mailto:${site.email}`;

/** Full registered address when set in lib/site.ts, otherwise the agreed placeholder line. */
export const addressText = site.address.trim() || "Registered address available on request";

/** Page metadata shared by the legal pages. */
export function legalMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: path,
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
    },
    twitter: {
      card: "summary",
      title: `${title} — ${site.name}`,
      description,
    },
  };
}
