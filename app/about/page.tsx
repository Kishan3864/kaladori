import type { Metadata } from "next";
import { AboutCta } from "@/components/about/about-cta";
import { AboutHero } from "@/components/about/about-hero";
import { AboutQuote } from "@/components/about/about-quote";
import { AboutStory } from "@/components/about/about-story";
import { AboutValues } from "@/components/about/about-values";
import { editorial } from "@/lib/images";
import { site } from "@/lib/site";

const title = "About";
const description =
  "The story of KalaDori Textile: a small Indian house making handwoven sarees, chikankari kurtis and tailored pants with artisan families in Varanasi, Chanderi, Lucknow, Bagru and Phulia — in small batches, at fair wages, made to be mended.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/about",
    siteName: site.name,
    title: `${title} — ${site.name}`,
    description,
    images: [{ url: editorial.about.src, alt: editorial.about.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — ${site.name}`,
    description,
    images: [{ url: editorial.about.src, alt: editorial.about.alt }],
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutQuote />
      <AboutCta />
    </>
  );
}
