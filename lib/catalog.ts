/**
 * Pure catalogue helpers, safe on server and client. They take the catalogue
 * as an argument: it is loaded on the server (lib/server/catalog.ts) and
 * passed down to client components as props.
 */
import type { Category, CategoryInfo, Product } from "@/data/products";

export type { Category, CategoryInfo, Product };

export type Catalog = {
  categories: CategoryInfo[];
  products: Product[];
};

export const isPublished = (p: Product) => p.published !== false;

export function getProduct(catalog: Catalog, slug: string) {
  return catalog.products.find((p) => p.slug === slug);
}

export function getCategory(catalog: Catalog, slug: string | null | undefined) {
  return slug ? catalog.categories.find((c) => c.slug === slug) : undefined;
}

export function getProductsByCategory(catalog: Catalog, category: Category) {
  return catalog.products.filter((p) => p.category === category);
}

/** Products flagged as new, in catalogue order (topped up with the rest if there are too few). */
export function getNewArrivals(catalog: Catalog, limit = 4) {
  const fresh = catalog.products.filter((p) => p.isNew);
  const rest = catalog.products.filter((p) => !p.isNew);
  return [...fresh, ...rest].slice(0, limit);
}

/** Lowest price in a category, for "from ₹..." labels. */
export function fromPrice(catalog: Catalog, category: Category) {
  const prices = getProductsByCategory(catalog, category).map((p) => p.price);
  return prices.length ? Math.min(...prices) : undefined;
}

/**
 * Same-category products first, then the next category in the list (a kurti
 * page ends with a trouser), then the rest. Excludes the given slug.
 */
export function getRelatedProducts(catalog: Catalog, slug: string, limit = 4) {
  const { products, categories } = catalog;
  const current = getProduct(catalog, slug);
  if (!current) return products.slice(0, limit);
  const at = categories.findIndex((c) => c.slug === current.category);
  const complement = categories[(at + 1) % Math.max(1, categories.length)]?.slug;
  const same = products.filter((p) => p.category === current.category && p.slug !== slug);
  const paired = products.filter((p) => p.category === complement && p.category !== current.category);
  const rest = products.filter((p) => p.category !== current.category && p.category !== complement);
  return [...same, ...paired, ...rest].slice(0, limit);
}

/** "Sarees" → "sarees", "Co-ord Sets!" → "co-ord-sets". */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
