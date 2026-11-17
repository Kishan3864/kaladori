import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "en-IN",
    dir: "ltr",
    background_color: "#F6F1EA",
    theme_color: "#A2284E",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/brand/favicon/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/favicon/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/brand/favicon/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
