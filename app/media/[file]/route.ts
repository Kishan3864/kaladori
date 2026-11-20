import { MEDIA_TYPES, readUpload, resizedUpload } from "@/lib/server/media";

/**
 * Serves photos uploaded from the admin (DATA_DIR/uploads).
 * ?w=<width> returns a WebP resized to that width (cached on disk), which is
 * what next/image asks for (lib/image-loader.ts); without it, the original.
 * File names are random and never reused, so responses cache for a year.
 */
export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const width = Number(new URL(request.url).searchParams.get("w"));

  if (Number.isFinite(width) && width > 0) {
    const resized = await resizedUpload(file, width);
    if (resized) {
      return new Response(new Uint8Array(resized), {
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  }

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
