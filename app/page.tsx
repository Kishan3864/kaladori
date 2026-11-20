import type { Metadata } from "next";
import { getHeroData } from "@/components/home/heroes/data";
import { ACTIVE_HERO, HomeHero } from "@/components/home/heroes/registry";
import { HomeSections } from "@/components/home/home-sections";
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
    // Brand card from Kaladori-Logo-Kit (app/opengraph-image.png) for link previews.
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
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

export default async function HomePage() {
  const heroData = await getHeroData();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* Which saved hero design is live: components/home/heroes/registry.tsx */}
      <HomeHero id={ACTIVE_HERO} data={heroData} />
      <HomeSections />
    </>
  );
}
