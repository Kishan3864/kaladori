import type { MetadataRoute } from "next";
import { LAST_UPDATED, policyPages } from "@/components/legal/policy-data";
import { getCatalog } from "@/lib/server/catalog";
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getCatalog();
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: LAST_MODIFIED, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: LAST_MODIFIED, changeFrequency: "yearly", priority: 0.4 },
    ...policyPages.map((page) => ({
      url: `${base}${page.href}`,
      lastModified: LAST_UPDATED.iso,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/product/${product.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: product.isNew ? 0.8 : 0.7,
    images: product.images.slice(0, 2).map((src) => xmlSafe(src.startsWith("/") ? `${base}${src}` : src)),
  }));

  return [...pages, ...productPages];
}
