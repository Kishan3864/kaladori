# KalaDori Textile

Storefront for **KalaDori Textile**, a modern Indian label of handwoven sarees, kurtis and tailored pants. Editorial layout, the signature maroon thread drawn on scroll, and a persistent cart.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) + TypeScript
- Tailwind CSS 4 (CSS-first config in `app/globals.css`, no `tailwind.config`)
- Framer Motion for reveals, the scroll-drawn thread and page transitions
- Zustand for the cart, persisted to `localStorage`
- Fonts via `next/font`: Bodoni Moda (headings) and Jost (body)

## Scripts

```bash
npm install
npm run dev     # local development on http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Structure

```
app/                 Routes and metadata
  page.tsx           Home: hero, category marquee, tiles, new arrivals, story, lookbook, testimonials, newsletter
  shop/              /shop with category filter and sort (?category=sarees|kurtis|pants)
  product/[slug]/    Product page: gallery, size select, Add to Cart
  about/ contact/    Brand story and contact form
  template.tsx       Page transition
  not-found.tsx      Editorial 404
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx   SEO and app metadata
components/
  layout/            Header, footer, logo, cart drawer
  motion/            Reveal, ImageReveal, ThreadLine, Marquee, page thread
  product/           ProductCard and product UI
data/products.ts     The 12 sample products and 3 categories, plus lookup helpers
lib/                 Cart store, site config, image registry, hooks, utilities
public/brand/        Logo, wordmark, icon and favicon files (use as supplied)
```

## Content and images

- **Products**: edit `data/products.ts`. Each product needs a unique `slug`, a price in whole rupees and at least three images (front, alternate, detail).
- **Editorial imagery** (hero, category tiles, story, lookbook, about, contact): edit `lib/images.ts`. Every non-product photo is registered there with its alt text.
- All photos are Unsplash placeholders. Remote images are allowed from `images.unsplash.com` only; to use your own CDN, add its host to `images.remotePatterns` in `next.config.ts`.
- **Brand assets**: the logos in `public/brand/` are the source files. Render them through `components/layout/logo.tsx` rather than redrawing them.
- **Site details** (name, tagline, email, phone, social links, free-shipping threshold): `lib/site.ts`.

## Cart

The cart is a Zustand store (`lib/cart-store.ts`) saved to `localStorage` under the key `kaladori-cart`. It rehydrates on the client after the first render, so cart counts appear once the page has hydrated. Clearing site data empties the cart.

## Front-end only

This is a front-end build with no payment or order backend. **Checkout, the newsletter sign-up and the contact form do not send data anywhere.** Any confirmation they show happens only in the browser. Connect them to your commerce platform, email provider or form backend before launch.

## Domain and SEO

Set `NEXT_PUBLIC_SITE_URL` to the production origin (for example `https://kaladori.com`). It is used for `metadataBase`, canonical URLs, Open Graph tags, `sitemap.xml` and `robots.txt`. If it is unset, `https://kaladori.com` is used.

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://www.example.com
```

`sitemap.ts` uses a fixed `lastModified` date, because Cache Components does not allow `new Date()` during prerendering. Update it when the catalogue changes.

## Cache Components notes

`cacheComponents` is enabled in `next.config.ts`. Do not call `new Date()`, `Date.now()` or `Math.random()` during render. Use `site.year` for the copyright year. Do not export `dynamic`, `revalidate` or `runtime` from route files. Client components that read search params sit inside a `<Suspense>` boundary.
