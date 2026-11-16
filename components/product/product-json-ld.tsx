import type { Product } from "@/data/products";
import { policies, site } from "@/lib/site";

/**
 * Static price-validity date for the sample catalogue (Cache Components
 * forbids `new Date()` during prerender). Update with the price list.
 */
const PRICE_VALID_UNTIL = "2027-12-31";

/** schema.org Product structured data for rich results. */
export function ProductJsonLd({ product, categoryName }: { product: Product; categoryName: string }) {
  const url = `${site.url}/product/${product.slug}`;
  const finalSale = Boolean(product.compareAtPrice);
  const freeShipping = product.price >= site.freeShippingThreshold;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.slug,
    category: categoryName,
    color: product.colour,
    material: product.fabric,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: PRICE_VALID_UNTIL,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.name },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: freeShipping ? 0 : policies.flatShipping,
          currency: "INR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: policies.dispatchDays,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: policies.deliveryMetroDays[0],
            maxValue: policies.deliveryElsewhereDays[1],
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: finalSale
        ? {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "IN",
            returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
          }
        : {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "IN",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: policies.returnDays,
            returnMethod: "https://schema.org/ReturnByMail",
            returnFees: "https://schema.org/FreeReturn",
          },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
