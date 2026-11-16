import type { Metadata } from "next";
import { BrandStory } from "@/components/home/brand-story";
import { CategoryMarquee } from "@/components/home/category-marquee";
import { CategoryTiles } from "@/components/home/category-tiles";
import { Hero } from "@/components/home/hero";
import { Lookbook } from "@/components/home/lookbook";
import { NewArrivals } from "@/components/home/new-arrivals";
import { Newsletter } from "@/components/home/newsletter";
import { Testimonials } from "@/components/home/testimonials";
import { editorial } from "@/lib/images";
import { site } from "@/lib/site";

const title = "KalaDori Textile — Handwoven Sarees, Kurtis & Pants";

export const metadata: Metadata = {
  title: { absolute: title },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: editorial.hero.src, alt: editorial.hero.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: [{ url: editorial.hero.src, alt: editorial.hero.alt }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/brand/icon-512.png`,
        width: 512,
        height: 512,
      },
      description: site.description,
      email: site.email,
      slogan: site.tagline,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en-IN",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <CategoryMarquee />
      <CategoryTiles />
      <NewArrivals />
      <BrandStory />
      <Lookbook />
      <Testimonials />
      <Newsletter />
    </>
  );
}
