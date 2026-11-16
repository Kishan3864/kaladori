import { categories, isCategory, products, type Category, type Product } from "@/data/products";

/**
 * Shop state lives in the URL: /shop?category=sarees&sort=price-asc.
 * Defaults (all categories, featured order) are omitted from the URL.
 * Server-safe: shared by the page, the Suspense fallback and the client view.
 */

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortKey = "featured";

export type ShopState = {
  category: Category | null;
  sort: SortKey;
};

export function isSortKey(value: string | null | undefined): value is SortKey {
  return SORT_OPTIONS.some((option) => option.value === value);
}

/** Unknown or missing values fall back to "all categories". */
export function parseCategory(value: string | null | undefined): Category | null {
  return isCategory(value) ? value : null;
}

/** Unknown or missing values fall back to the featured order. */
export function parseSort(value: string | null | undefined): SortKey {
  return isSortKey(value) ? value : DEFAULT_SORT;
}

export function sortLabel(sort: SortKey) {
  return SORT_OPTIONS.find((option) => option.value === sort)?.label ?? "Featured";
}

/** Canonical shop URL for a state; parameters equal to their default are dropped. */
export function buildShopHref(category: Category | null, sort: SortKey) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (sort !== DEFAULT_SORT) params.set("sort", sort);
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

const catalogueIndex = new Map(products.map((product, index) => [product.slug, index]));
const byCatalogue = (a: Product, b: Product) =>
  (catalogueIndex.get(a.slug) ?? 0) - (catalogueIndex.get(b.slug) ?? 0);

/** Filter by category (null = everything), then order. Ties keep catalogue order. */
export function getShopProducts(category: Category | null, sort: SortKey): Product[] {
  const list = category ? products.filter((p) => p.category === category) : [...products];

  switch (sort) {
    case "newest":
      return list.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || byCatalogue(a, b));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price || byCatalogue(a, b));
    case "price-desc":
      return list.sort((a, b) => b.price - a.price || byCatalogue(a, b));
    default:
      return list.sort(byCatalogue);
  }
}

export type CategoryOption = {
  slug: Category | null;
  name: string;
  count: number;
};

/** "All" plus each category, with item counts for the filter row. */
export const categoryOptions: CategoryOption[] = [
  { slug: null, name: "All", count: products.length },
  ...categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: products.filter((p) => p.category === c.slug).length,
  })),
];

/** 4 → "04" — editorial numbering. */
export function pad(n: number) {
  return String(n).padStart(2, "0");
}
