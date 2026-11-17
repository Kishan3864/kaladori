import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Already normalised (no trailing slash) in lib/site.ts. */
const base = site.url;

export default function robots(): MetadataRoute.Robots {
  return {
    // Private / per-customer pages (admin, checkout, order-status links) and the design lab.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/checkout", "/order", "/lab"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
