/**
 * The live catalogue: categories and products, stored in DATA_DIR/catalog.json
 * and edited from the admin panel. Until the first edit, reads return the
 * seed from data/products.ts. SERVER ONLY.
 *
 * Reads for the shop are cached ("use cache", tag "catalog"); every admin
 * write calls updateTag("catalog") so the site shows the change at once.
 */
import { cacheTag } from "next/cache";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "@/data/products";
import { isPublished, type Catalog, type CategoryInfo, type Product } from "@/lib/catalog";
import { readDocument, updateDocument } from "@/lib/server/store";

export const CATALOG_TAG = "catalog";
const FILE = "catalog.json";

const seed = (): Catalog => ({
  categories: structuredClone(SEED_CATEGORIES),
  products: structuredClone(SEED_PRODUCTS),
});

/** The shop's catalogue: published products only. Cached until an admin edit. */
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheTag(CATALOG_TAG);
  const doc = await readDocument(FILE, seed);
  return { categories: doc.categories, products: doc.products.filter(isPublished) };
}

/** Everything, including hidden products (admin only, never cached). */
export function getAdminCatalog(): Promise<Catalog> {
  return readDocument(FILE, seed);
}

/* ------------------------------------------------------------- products */

export type SaveResult = { ok: true; slug: string } | { ok: false; message: string };

/** Create (no originalSlug) or update a product. */
export function saveProduct(product: Product, originalSlug?: string): Promise<SaveResult> {
  return updateDocument<Catalog, SaveResult>(FILE, seed, (doc) => {
    if (!doc.categories.some((c) => c.slug === product.category)) {
      return { doc, result: { ok: false, message: "Please choose a category that exists." } };
    }
    const clash = doc.products.find((p) => p.slug === product.slug && p.slug !== originalSlug);
    if (clash) {
      return { doc, result: { ok: false, message: `Another product already uses the link "${product.slug}".` } };
    }

    const products = [...doc.products];
    const at = originalSlug ? products.findIndex((p) => p.slug === originalSlug) : -1;
    if (originalSlug && at === -1) return { doc, result: { ok: false, message: "That product no longer exists." } };
    if (at >= 0) products[at] = product;
    else products.unshift(product); // new pieces lead the shop
    return { doc: { ...doc, products }, result: { ok: true, slug: product.slug } };
  });
}

export function deleteProduct(slug: string): Promise<boolean> {
  return updateDocument<Catalog, boolean>(FILE, seed, (doc) => {
    const products = doc.products.filter((p) => p.slug !== slug);
    return { doc: { ...doc, products }, result: products.length !== doc.products.length };
  });
}

/** Move a product one place up (-1) or down (+1) in the shop's featured order. */
export function moveProduct(slug: string, dir: -1 | 1): Promise<void> {
  return updateDocument<Catalog, void>(FILE, seed, (doc) => {
    const products = [...doc.products];
    const at = products.findIndex((p) => p.slug === slug);
    const to = at + dir;
    if (at < 0 || to < 0 || to >= products.length) return { doc, result: undefined };
    [products[at], products[to]] = [products[to], products[at]];
    return { doc: { ...doc, products }, result: undefined };
  });
}

/* ----------------------------------------------------------- categories */

export function saveCategory(category: CategoryInfo, originalSlug?: string): Promise<SaveResult> {
  return updateDocument<Catalog, SaveResult>(FILE, seed, (doc) => {
    const clash = doc.categories.find((c) => c.slug === category.slug && c.slug !== originalSlug);
    if (clash) {
      return { doc, result: { ok: false, message: `A category with the link "${category.slug}" already exists.` } };
    }

    const categories = [...doc.categories];
    let products = doc.products;
    if (originalSlug) {
      const at = categories.findIndex((c) => c.slug === originalSlug);
      if (at === -1) return { doc, result: { ok: false, message: "That category no longer exists." } };
      categories[at] = category;
      // Changing the link keeps its products in it.
      if (originalSlug !== category.slug) {
        products = products.map((p) => (p.category === originalSlug ? { ...p, category: category.slug } : p));
      }
    } else {
      categories.push(category);
    }
    return { doc: { categories, products }, result: { ok: true, slug: category.slug } };
  });
}

export type DeleteCategoryResult = { ok: true } | { ok: false; message: string };

/** Only empty categories can be deleted, so no product is ever left without one. */
export function deleteCategory(slug: string): Promise<DeleteCategoryResult> {
  return updateDocument<Catalog, DeleteCategoryResult>(FILE, seed, (doc) => {
    const used = doc.products.filter((p) => p.category === slug).length;
    if (used > 0) {
      return {
        doc,
        result: { ok: false, message: `Move or delete its ${used} product${used === 1 ? "" : "s"} first.` },
      };
    }
    return { doc: { ...doc, categories: doc.categories.filter((c) => c.slug !== slug) }, result: { ok: true } };
  });
}

/** Move a category one place up (-1) or down (+1) (menu and filter order). */
export function moveCategory(slug: string, dir: -1 | 1): Promise<void> {
  return updateDocument<Catalog, void>(FILE, seed, (doc) => {
    const categories = [...doc.categories];
    const at = categories.findIndex((c) => c.slug === slug);
    const to = at + dir;
    if (at < 0 || to < 0 || to >= categories.length) return { doc, result: undefined };
    [categories[at], categories[to]] = [categories[to], categories[at]];
    return { doc: { ...doc, categories }, result: undefined };
  });
}
