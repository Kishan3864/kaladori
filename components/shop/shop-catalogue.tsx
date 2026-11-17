"use client";

import { useSearchParams } from "next/navigation";
import type { Catalog } from "@/lib/catalog";
import { CatalogueView } from "./catalogue-view";
import { parseCategory, parseSort } from "./shop-params";

/**
 * Reads ?category= and ?sort= from the URL (invalid values fall back to the
 * defaults). Must sit under a <Suspense> boundary — see app/shop/page.tsx.
 */
export function ShopCatalogue({ catalog }: { catalog: Catalog }) {
  const searchParams = useSearchParams();
  const category = parseCategory(catalog, searchParams.get("category"));
  const sort = parseSort(searchParams.get("sort"));

  return <CatalogueView catalog={catalog} category={category} sort={sort} />;
}
