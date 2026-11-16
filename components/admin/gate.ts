import { connection } from "next/server";
import { requireAdmin } from "@/lib/server/auth";

/**
 * Call first in every request-time admin component (inside <Suspense>).
 * `connection()` makes sure nothing below — env checks, cookies, file reads,
 * Date — is ever evaluated during prerender, so a build without
 * ADMIN_PASSWORD can't bake a redirect into the static shell.
 */
export async function gate() {
  await connection();
  await requireAdmin();
}
