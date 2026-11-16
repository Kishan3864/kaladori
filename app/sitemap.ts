import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { site } from "@/lib/site";

/**
 * Fixed date for the sample catalogue. Cache Components forbids `new Date()`
 * during prerender — update this string (or derive it from product data)
 * when the catalogue changes.
 */
const LAST_MODIFIED = "2026-11-16";

/** Already normalised (no trailing slash) in lib/site.ts. */
const base = site.url;

/** Next.js writes sitemap values into XML verbatim, so escape entities in query strings. */
function xmlSafe(url: string) {
  return url.replace(/&/g, "&amp;");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: LAST_MODIFIED, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: LAST_MODIFIED, changeFrequency: "yearly", priority: 0.4 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/product/${product.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: product.isNew ? 0.8 : 0.7,
    images: product.images.slice(0, 2).map(xmlSafe),
  }));

  return [...pages, ...productPages];
}
