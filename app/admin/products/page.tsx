import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { moveProductAction, togglePublishedAction } from "@/app/admin/catalog-actions";
import { AdminHeader } from "@/components/admin/admin-header";
import { gate } from "@/components/admin/gate";
import { SubmitButton } from "@/components/admin/submit-button";
import { getAdminCatalog } from "@/lib/server/catalog";
import { cn, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products · Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="shell py-8 md:py-12">
      <AdminHeader active="products" />
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse bg-sand/50" aria-hidden />}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ProductList({ searchParams }: { searchParams: SearchParams }) {
  await gate();
  const [{ products, categories }, sp] = await Promise.all([getAdminCatalog(), searchParams]);
  const cat = first(sp.category);
  const q = first(sp.q).trim().toLowerCase().slice(0, 60);
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  const visible = products.filter(
    (p) => (!cat || p.category === cat) && (!q || p.name.toLowerCase().includes(q) || p.slug.includes(q)),
  );
  const filtering = Boolean(cat || q);
  const hidden = products.filter((p) => p.published === false).length;

  return (
    <div className="mt-8 space-y-6">
      {first(sp.deleted) ? (
        <p role="status" className="border border-line bg-sand/50 px-4 py-3 text-sm">
          Product deleted.
        </p>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-2xl">
          Products <span className="text-base text-stone">({products.length}{hidden ? `, ${hidden} hidden` : ""})</span>
        </h2>
        <Link href="/admin/products/new" className="btn btn-ink min-h-11 px-6">
          + Add product
        </Link>
      </div>

      <form action="/admin/products" role="search" className="flex flex-wrap items-center gap-2">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <input
          id="product-search"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search by name"
          className="min-w-0 flex-1 rounded-none border border-line bg-ivory px-3 py-2.5 text-sm outline-none placeholder:text-stone/70 focus:border-maroon sm:max-w-xs"
        />
        <label htmlFor="product-category" className="sr-only">
          Category
        </label>
        <select
          id="product-category"
          name="category"
          defaultValue={cat}
          className="rounded-none border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-maroon"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-outline min-h-10 px-4">
          Filter
        </button>
        {filtering ? (
          <Link href="/admin/products" className="link-draw text-sm text-stone">
            Clear
          </Link>
        ) : null}
      </form>

      {visible.length === 0 ? (
        <p className="border border-dashed border-line px-6 py-12 text-center text-stone">
          {products.length === 0 ? "No products yet. Add the first one." : "No products match this filter."}
        </p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {visible.map((p) => {
            const index = products.indexOf(p);
            const isHidden = p.published === false;
            return (
              <li key={p.slug} className={cn("flex items-center gap-3 py-3 sm:gap-4", isHidden && "opacity-60")}>
                <Link href={`/admin/products/${p.slug}`} className="relative h-20 w-16 shrink-0 overflow-hidden bg-sand">
                  {p.images[0] ? <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" /> : null}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/products/${p.slug}`} className="link-draw font-medium">
                    {p.name}
                  </Link>
                  <p className="mt-1 text-[13px] text-stone">
                    {categoryName(p.category)} · {formatPrice(p.price)}
                    {p.compareAtPrice ? <del className="ml-1.5">{formatPrice(p.compareAtPrice)}</del> : null}
                    {p.isNew ? <span className="ml-2 text-maroon">New</span> : null}
                    {isHidden ? <span className="ml-2 font-medium text-ink">Hidden</span> : null}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {!filtering ? (
                    <>
                      <form action={moveProductAction}>
                        <input type="hidden" name="slug" value={p.slug} />
                        <input type="hidden" name="dir" value="up" />
                        <SubmitButton className="h-9 w-9 border border-line text-sm disabled:opacity-30" aria-label={`Move ${p.name} up`}>
                          ↑
                        </SubmitButton>
                      </form>
                      <form action={moveProductAction}>
                        <input type="hidden" name="slug" value={p.slug} />
                        <input type="hidden" name="dir" value="down" />
                        <SubmitButton className="h-9 w-9 border border-line text-sm" aria-label={`Move ${p.name} down`}>
                          ↓
                        </SubmitButton>
                      </form>
                    </>
                  ) : null}
                  <form action={togglePublishedAction} className="hidden sm:block">
                    <input type="hidden" name="slug" value={p.slug} />
                    <SubmitButton pendingLabel="…" className="h-9 border border-line px-3 text-[12px]">
                      {isHidden ? "Show" : "Hide"}
                    </SubmitButton>
                  </form>
                  <Link href={`/admin/products/${p.slug}`} className="flex h-9 items-center border border-ink px-3 text-[12px]">
                    Edit
                  </Link>
                </div>
                <span className="sr-only">Position {index + 1}</span>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-[13px] text-stone">
        The order here is the shop&rsquo;s &ldquo;Featured&rdquo; order. Hidden products stay here but are not shown in the shop.
      </p>
    </div>
  );
}
