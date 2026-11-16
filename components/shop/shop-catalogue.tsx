"use client";

import { useSearchParams } from "next/navigation";
import { CatalogueView } from "./catalogue-view";
import { parseCategory, parseSort } from "./shop-params";

/**
 * Reads ?category= and ?sort= from the URL (invalid values fall back to the
 * defaults). Must sit under a <Suspense> boundary — see app/shop/page.tsx.
 */
export function ShopCatalogue() {
  const searchParams = useSearchParams();
  const category = parseCategory(searchParams.get("category"));
  const sort = parseSort(searchParams.get("sort"));

  return <CatalogueView category={category} sort={sort} />;
}
