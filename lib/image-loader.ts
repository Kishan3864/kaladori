/**
 * next/image loader (next.config.ts → images.loaderFile).
 *
 * - Unsplash photos load straight from the Unsplash CDN, which resizes them
 *   and serves AVIF/WebP itself. Routing them through the Next optimiser made
 *   the server fetch each original first, and cold fetches past its fixed 7s
 *   limit failed with 504s.
 * - Photos uploaded in the admin (/media/...) are resized on our own server
 *   (app/media/[file]/route.ts) and cached on disk.
 * - Anything else local is served as it is (the width is added only so every
 *   srcset entry is distinct).
 */
type LoaderArgs = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
    return url.toString();
  }
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
