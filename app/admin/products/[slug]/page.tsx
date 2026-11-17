import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteProductAction } from "@/app/admin/catalog-actions";
import { AdminHeader } from "@/components/admin/admin-header";
import { gate } from "@/components/admin/gate";
import { ProductForm } from "@/components/admin/product-form";
import { SubmitButton } from "@/components/admin/submit-button";
import { getAdminCatalog } from "@/lib/server/catalog";

export const metadata: Metadata = {
  title: "Edit product · Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function EditProductPage(props: Props) {
  return (
    <div className="shell py-8 md:py-12">
      <AdminHeader active="products" />
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse bg-sand/50" aria-hidden />}>
        <EditProduct {...props} />
      </Suspense>
    </div>
  );
}

async function EditProduct({ params, searchParams }: Props) {
  await gate();
  const [{ slug }, sp, { products, categories }] = await Promise.all([params, searchParams, getAdminCatalog()]);
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/products" className="eyebrow link-draw text-stone">
          ← All products
        </Link>
        <Link href={`/product/${product.slug}`} target="_blank" className="eyebrow link-draw text-ink">
          View in shop ↗
        </Link>
      </div>
      <h2 className="mt-4 font-display text-2xl md:text-3xl">{product.name}</h2>
      {sp.saved ? (
        <p role="status" className="mt-4 border border-line bg-sand/50 px-4 py-3 text-sm">
          Saved. The shop shows the change now.
        </p>
      ) : null}

      <div className="mt-8">
        {/* key: fresh fields after a save that changed the link */}
        <ProductForm key={product.slug} product={product} categories={categories} />
      </div>

      <form action={deleteProductAction} className="mt-14 border-t border-line pt-6">
        <input type="hidden" name="slug" value={product.slug} />
        <p className="text-[14px] text-stone">
          Deleting removes the product from the shop for good. Past orders keep their own copy of it.
        </p>
        <SubmitButton
          confirm={`Delete “${product.name}”? This cannot be undone.`}
          pendingLabel="Deleting…"
          className="mt-3 border border-maroon px-4 py-2.5 text-[13px] text-maroon hover:bg-maroon hover:text-ivory"
        >
          Delete product
        </SubmitButton>
      </form>
    </div>
  );
}
