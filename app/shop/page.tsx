import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandPromises } from "@/components/home/brand-promises";
import { CatalogueView } from "@/components/shop/catalogue-view";
import { ShopCatalogue } from "@/components/shop/shop-catalogue";
import { ShopHeader } from "@/components/shop/shop-header";
import { DEFAULT_SORT } from "@/components/shop/shop-params";
import type { Catalog } from "@/lib/catalog";
import { getCatalog } from "@/lib/server/catalog";
import { editorial } from "@/lib/images";
import { site } from "@/lib/site";

const title = "Shop";
const socialTitle = "Shop the collection — KalaDori Textile";
const description =
  "Shop handwoven Banarasi and Chanderi sarees, chikankari and block-printed kurtis, and handwoven dupattas, stoles and silk scarves, made in small runs with artisans across India.";
const socialImage = {
  url: editorial.categories.sarees.src,
  alt: editorial.categories.sarees.alt,
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/shop" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    url: "/shop",
    title: socialTitle,
    description,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description,
    images: [socialImage.url],
  },
};

/** CollectionPage + ItemList structured data for the full catalogue. */
const structuredData = ({ products }: Catalog) => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: socialTitle,
  description,
  url: `${site.url}/shop`,
  isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.url}/product/${product.slug}`,
      name: product.name,
      image: product.images[0],
    })),
  },
}).replace(/</g, "\\u003c");

export default async function ShopPage() {
  const catalog = await getCatalog();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(catalog) }} />

      <ShopHeader />

      {/*
        The catalogue reads the URL (useSearchParams), so it renders on the client.
        The fallback is the complete, unfiltered catalogue — the prerendered HTML
        carries every product for crawlers and for readers before hydration.
      */}
      <Suspense fallback={<CatalogueView catalog={catalog} category={null} sort={DEFAULT_SORT} isFallback />}>
        <ShopCatalogue catalog={catalog} />
      </Suspense>

      <BrandPromises className="pb-20 md:pb-28" />
    </>
  );
}
