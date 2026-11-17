"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { slugify, type CategoryInfo, type Product } from "@/lib/catalog";
import { requireAdmin } from "@/lib/server/auth";
import {
  CATALOG_TAG,
  deleteCategory,
  deleteProduct,
  getAdminCatalog,
  moveCategory,
  moveProduct,
  saveCategory,
  saveProduct,
} from "@/lib/server/catalog";

/* Every action authorises itself: never trust the page that rendered the form. */

const str = (v: FormDataEntryValue | null, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const lines = (v: FormDataEntryValue | null, maxLines = 20, maxLen = 200) =>
  str(v, 6000)
    .split("\n")
    .map((l) => l.trim().slice(0, maxLen))
    .filter(Boolean)
    .slice(0, maxLines);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Photos must be uploaded ones or from the Unsplash CDN (the only remote host next/image allows). */
const IMAGE_URL = /^(\/media\/[a-f0-9]{24}\.(jpg|png|webp|avif)|https:\/\/images\.unsplash\.com\/[\w\-./?=&%]+)$/;

/** Make every page that shows the catalogue fresh after an edit. */
function refreshCatalog() {
  updateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------- products */

export type ProductFormState = {
  ok?: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
};

export async function saveProductAction(_prev: ProductFormState, form: FormData): Promise<ProductFormState> {
  await requireAdmin();
  const errors: Record<string, string> = {};
  const originalSlug = str(form.get("originalSlug"), 90) || undefined;

  const name = str(form.get("name"), 120);
  if (!name) errors.name = "Please give the product a name.";

  const slug = slugify(str(form.get("slug"), 90) || name);
  if (!slug || !SLUG.test(slug)) errors.slug = "Use letters, numbers and dashes.";

  const category = str(form.get("category"), 80);
  if (!category) errors.category = "Please choose a category.";

  const price = Math.round(Number(str(form.get("price"), 12)));
  if (!Number.isFinite(price) || price < 1 || price > 10_000_000) errors.price = "Enter the price in rupees, e.g. 4500.";

  const compareRaw = str(form.get("compareAtPrice"), 12);
  const compareAtPrice = compareRaw ? Math.round(Number(compareRaw)) : undefined;
  if (compareAtPrice !== undefined && (!Number.isFinite(compareAtPrice) || compareAtPrice <= price)) {
    errors.compareAtPrice = "The original price must be higher than the price (or leave it empty).";
  }

  const summary = str(form.get("summary"), 240);
  if (!summary) errors.summary = "One line for product cards and search results.";

  const sizes = str(form.get("sizes"), 300)
    .split(",")
    .map((s) => s.trim().slice(0, 20))
    .filter(Boolean)
    .slice(0, 12);
  if (sizes.length === 0) errors.sizes = "Add at least one size, e.g. One Size or S, M, L.";

  const images = form
    .getAll("images")
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean)
    .slice(0, 8);
  if (images.length === 0) errors.images = "Add at least one photo.";
  else if (images.some((u) => !IMAGE_URL.test(u))) errors.images = "One of the photos is not an uploaded or Unsplash image.";

  const colourHex = str(form.get("colourHex"), 7);

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please check the highlighted fields.", errors };
  }

  const product: Product = {
    slug,
    name,
    category,
    price,
    ...(compareAtPrice !== undefined ? { compareAtPrice } : {}),
    colour: str(form.get("colour"), 60) || "Natural",
    colourHex: /^#[0-9a-f]{6}$/i.test(colourHex) ? colourHex : "#8a7f74",
    fabric: str(form.get("fabric"), 120),
    summary,
    description: str(form.get("description"), 3000),
    details: lines(form.get("details")),
    care: lines(form.get("care")),
    sizes,
    images,
    isNew: form.get("isNew") === "on",
    ...(str(form.get("badge"), 24) ? { badge: str(form.get("badge"), 24) } : {}),
    published: form.get("published") === "on",
  };

  const saved = await saveProduct(product, originalSlug);
  if (!saved.ok) return { ok: false, message: saved.message, errors: { slug: saved.message } };

  refreshCatalog();
  if (!originalSlug || originalSlug !== saved.slug) redirect(`/admin/products/${saved.slug}?saved=1`);
  return { ok: true, message: "Saved. The shop shows the change now." };
}

export async function deleteProductAction(form: FormData) {
  await requireAdmin();
  const slug = str(form.get("slug"), 90);
  if (SLUG.test(slug)) {
    await deleteProduct(slug);
    refreshCatalog();
  }
  redirect("/admin/products?deleted=1");
}

export async function moveProductAction(form: FormData) {
  await requireAdmin();
  const slug = str(form.get("slug"), 90);
  const dir = form.get("dir") === "up" ? -1 : 1;
  if (SLUG.test(slug)) {
    await moveProduct(slug, dir);
    refreshCatalog();
  }
}

/** Show / hide in the shop without opening the editor. */
export async function togglePublishedAction(form: FormData) {
  await requireAdmin();
  const slug = str(form.get("slug"), 90);
  const { products } = await getAdminCatalog();
  const product = products.find((p) => p.slug === slug);
  if (!product) return;
  await saveProduct({ ...product, published: product.published === false }, slug);
  refreshCatalog();
}

/* ----------------------------------------------------------- categories */

export type CategoryFormState = { ok?: boolean; message?: string };

export async function saveCategoryAction(_prev: CategoryFormState, form: FormData): Promise<CategoryFormState> {
  await requireAdmin();
  const originalSlug = str(form.get("originalSlug"), 90) || undefined;
  const name = str(form.get("name"), 60);
  if (!name) return { ok: false, message: "Please give the category a name." };
  const slug = slugify(str(form.get("slug"), 80) || name);
  if (!slug || !SLUG.test(slug)) return { ok: false, message: "The link may use letters, numbers and dashes." };

  const category: CategoryInfo = {
    slug,
    name,
    tagline: str(form.get("tagline"), 80) || name,
    description: str(form.get("description"), 400),
  };
  const saved = await saveCategory(category, originalSlug);
  if (!saved.ok) return { ok: false, message: saved.message };
  refreshCatalog();
  return { ok: true, message: originalSlug ? "Saved." : `“${name}” added. It now shows in the shop and the menu.` };
}

export async function deleteCategoryAction(_prev: CategoryFormState, form: FormData): Promise<CategoryFormState> {
  await requireAdmin();
  const slug = str(form.get("slug"), 90);
  if (!SLUG.test(slug)) return { ok: false, message: "Unknown category." };
  const result = await deleteCategory(slug);
  if (!result.ok) return { ok: false, message: result.message };
  refreshCatalog();
  return { ok: true, message: "Deleted." };
}

export async function moveCategoryAction(form: FormData) {
  await requireAdmin();
  const slug = str(form.get("slug"), 90);
  const dir = form.get("dir") === "up" ? -1 : 1;
  if (SLUG.test(slug)) {
    await moveCategory(slug, dir);
    refreshCatalog();
  }
}
