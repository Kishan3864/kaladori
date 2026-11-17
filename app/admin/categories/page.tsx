import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { moveCategoryAction } from "@/app/admin/catalog-actions";
import { AdminHeader } from "@/components/admin/admin-header";
import { CategoryEditor } from "@/components/admin/category-editor";
import { gate } from "@/components/admin/gate";
import { SubmitButton } from "@/components/admin/submit-button";
import { getAdminCatalog } from "@/lib/server/catalog";

export const metadata: Metadata = {
  title: "Categories · Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminCategoriesPage() {
  return (
    <div className="shell py-8 md:py-12">
      <AdminHeader active="categories" />
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse bg-sand/50" aria-hidden />}>
        <Categories />
      </Suspense>
    </div>
  );
}

async function Categories() {
  await gate();
  const { categories, products } = await getAdminCatalog();
  const count = (slug: string) => products.filter((p) => p.category === slug).length;

  return (
    <div className="mt-8 grid gap-12 lg:grid-cols-12">
      <section aria-labelledby="cat-list" className="lg:col-span-7">
        <h2 id="cat-list" className="font-display text-2xl">
          Categories <span className="text-base text-stone">({categories.length})</span>
        </h2>
        <p className="mt-2 text-[14px] text-stone">
          The order here is the order in the menu and the shop filters.
        </p>
        <ul className="mt-6 space-y-4">
          {categories.map((c, i) => (
            <li key={c.slug} className="border border-line p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-display text-xl">
                  {c.name}{" "}
                  <Link href={`/admin/products?category=${c.slug}`} className="link-draw text-[13px] text-stone">
                    {count(c.slug)} product{count(c.slug) === 1 ? "" : "s"}
                  </Link>
                </p>
                <div className="flex gap-1">
                  <form action={moveCategoryAction}>
                    <input type="hidden" name="slug" value={c.slug} />
                    <input type="hidden" name="dir" value="up" />
                    <SubmitButton className="h-9 w-9 border border-line text-sm" aria-label={`Move ${c.name} up`}>
                      ↑
                    </SubmitButton>
                  </form>
                  <form action={moveCategoryAction}>
                    <input type="hidden" name="slug" value={c.slug} />
                    <input type="hidden" name="dir" value="down" />
                    <SubmitButton className="h-9 w-9 border border-line text-sm" aria-label={`Move ${c.name} down`}>
                      ↓
                    </SubmitButton>
                  </form>
                </div>
              </div>
              <CategoryEditor key={`${c.slug}-${i}`} category={c} count={count(c.slug)} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cat-new" className="lg:col-span-5">
        <div className="border border-ink p-4 md:p-6 lg:sticky lg:top-28">
          <h2 id="cat-new" className="font-display text-2xl">
            Add a category
          </h2>
          <p className="mt-2 text-[14px] text-stone">It appears in the menu and shop filters as soon as it is added.</p>
          <div className="mt-5">
            {/* Stays mounted so its confirmation stays visible; React resets the fields after a successful add. */}
            <CategoryEditor />
          </div>
        </div>
      </section>
    </div>
  );
}
