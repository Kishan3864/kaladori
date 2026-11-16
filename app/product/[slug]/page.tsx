import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategory, getProduct, getRelatedProducts, products } from "@/data/products";
import { site } from "@/lib/site";
import { BrandPromises } from "@/components/home/brand-promises";
import { Breadcrumbs } from "@/components/product/breadcrumbs";
import { CraftNotes } from "@/components/product/craft-notes";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductJsonLd } from "@/components/product/product-json-ld";
import { ProductSkeleton } from "@/components/product/product-skeleton";
import { RelatedProducts } from "@/components/product/related-products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

/** Resize an Unsplash URL for social cards (4:5, 1200 wide). */
function socialImage(src: string) {
  const url = new URL(src);
  url.searchParams.set("w", "1200");
  url.searchParams.set("h", "1500");
  url.searchParams.set("fit", "crop");
  return url.toString();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const path = `/product/${product.slug}`;
  const title = `${product.name} — ${site.name}`;
  const image = {
    url: socialImage(product.images[0]),
    width: 1200,
    height: 1500,
    alt: `${product.name} in ${product.colour}`,
  };

  return {
    title: product.name,
    description: product.summary,
    keywords: [product.name, product.fabric, category?.name ?? product.category, site.name],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: site.name,
      url: path,
      title,
      description: product.summary,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.summary,
      images: [image.url],
    },
  };
}

/**
 * Product detail page. The shell (skeleton) is static; the product itself
 * renders once params resolve — every slug is prerendered at build time.
 */
export default function ProductPage(props: ProductPageProps) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetail params={props.params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: { params: ProductPageProps["params"] }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const categoryName = category?.name ?? product.category;
  const related = getRelatedProducts(product.slug, 4);

  return (
    <div data-pdp="">
      <ProductJsonLd product={product} categoryName={categoryName} />

      <article aria-labelledby={`title-${product.slug}`} className="pb-20 md:pb-28">
        <div className="shell pt-5 md:pt-8">
          <Breadcrumbs
            items={[
              { label: "Shop", href: "/shop" },
              { label: categoryName, href: `/shop?category=${product.category}` },
              { label: product.name },
            ]}
          />
        </div>

        <div className="shell mt-5 md:mt-8 lg:grid lg:grid-cols-12 lg:gap-x-10 xl:gap-x-16">
          <div className="-mx-5 md:-mx-10 lg:col-span-7 lg:mx-0">
            <ProductGallery key={product.slug} images={product.images} name={product.name} colour={product.colour} />
          </div>
          <div className="mt-10 sm:mt-12 lg:col-span-5 lg:mt-0 xl:col-span-4 xl:col-start-9">
            <ProductInfo key={product.slug} product={product} categoryName={categoryName} />
          </div>
        </div>
      </article>

      <CraftNotes product={product} />

      <RelatedProducts products={related} category={product.category} categoryName={categoryName} />

      <BrandPromises className="pb-20 md:pb-28" />

      {/* Marks the end of page content: the mobile buy bar hides once this is reached. */}
      <div data-pdp-end="" aria-hidden="true" />
    </div>
  );
}
