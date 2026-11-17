# KalaDori — Lotus logo pack

All text is converted to outlines, so no fonts need to be installed. Every SVG scales crisply to any size.

## Variants (in /svg)
- color: white, ivory or light backgrounds
- dark: black or very dark backgrounds
- maroon: maroon (#5A1229 / #A2284E) backgrounds
- black / white: single-colour use (print, stamps, watermark)

## Files
- logo-header-*: website header and mobile nav (no tagline, so it stays sharp at small sizes)
- logo-horizontal-*: with tagline, for invoices, emails and banners
- logo-stacked-*: footer, hero, about page, packaging
- wordmark-*: text only, for tight spaces
- icon-*: profile picture, social media, stickers (48px and up)
- icon-small-*: simplified icon for 48px and below (favicon)
- /favicon: favicon.svg, favicon.ico, 16/32/48 PNG, apple-touch-icon (180), icon-192, icon-512, site.webmanifest
- /png: 2000px PNGs + og-image-1200x630.png (WhatsApp/Facebook link preview)

## Brand fonts
Wordmark: Cinzel Decorative Bold · Slogan + UI: Jost (both free on Google Fonts)

## Brand colours
Ink #161616 · Maroon #A2284E · Gold #C6A15B · Ivory #F6F1EA · Cream #F3ECE4 · Rose #E7A2B8

## Next.js setup
Copy this folder to /public/brand/, then in app/layout.tsx:

export const metadata = {
  icons: { icon: [{ url: "/brand/favicon/favicon.svg", type: "image/svg+xml" }, { url: "/brand/favicon/favicon.ico" }],
           apple: "/brand/favicon/apple-touch-icon.png" },
  manifest: "/brand/favicon/site.webmanifest",
  openGraph: { images: ["/brand/png/og-image-1200x630.png"] },
};

Header: <img src="/brand/svg/logo-header-color.svg" alt="KalaDori" className="h-12 md:h-16 w-auto" />
Footer (dark): <img src="/brand/svg/logo-stacked-dark.svg" alt="KalaDori" className="h-32 w-auto" />
Mobile header: logo-header-color.svg at h-11 (44px). Below 360px width use wordmark-color.svg at h-6.
