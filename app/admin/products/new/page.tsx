import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { gate } from "@/components/admin/gate";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminCatalog } from "@/lib/server/catalog";

export const metadata: Metadata = {
  title: "New product · Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function NewProductPage() {
  return (
    <div className="shell py-8 md:py-12">
      <AdminHeader active="products" />
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse bg-sand/50" aria-hidden />}>
        <NewProduct />
      </Suspense>
    </div>
  );
}

async function NewProduct() {
  await gate();
  const { categories } = await getAdminCatalog();
  return (
    <div className="mt-8">
      <Link href="/admin/products" className="eyebrow link-draw text-stone">
        ← All products
      </Link>
      <h2 className="mt-4 font-display text-2xl md:text-3xl">Add a product</h2>
      {categories.length === 0 ? (
        <p className="mt-6 border border-dashed border-line px-6 py-10 text-center text-stone">
          Add a category first, then products can go into it.{" "}
          <Link href="/admin/categories" className="link-draw text-ink">
            Categories
          </Link>
        </p>
      ) : (
        <div className="mt-8">
          <ProductForm categories={categories} />
        </div>
      )}
    </div>
  );
}
