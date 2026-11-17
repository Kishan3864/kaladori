import { MEDIA_TYPES, readUpload } from "@/lib/server/media";

/**
 * Serves photos uploaded from the admin (DATA_DIR/uploads). File names are
 * random and never reused, so responses can be cached for a year.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const data = await readUpload(file);
  if (!data) return new Response("Not found", { status: 404 });

  const ext = file.split(".").pop() ?? "";
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": MEDIA_TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
