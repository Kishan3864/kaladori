import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Already normalised (no trailing slash) in lib/site.ts. */
const base = site.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
