/**
 * Product photos uploaded from the admin. Stored in DATA_DIR/uploads (outside
 * git, survives redeploys) and served at /media/<file> (app/media/[file]).
 * SERVER ONLY.
 */
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { DATA_DIR } from "@/lib/server/store";

export const UPLOAD_DIR = path.join(/*turbopackIgnore: true*/ DATA_DIR, "uploads");
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** Stored file names: random hex + a known image extension. */
export const MEDIA_NAME = /^[a-f0-9]{24}\.(jpg|png|webp|avif)$/;

export const MEDIA_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

/** Detect the image type from its first bytes (never trust the file name or browser type). */
function sniff(bytes: Uint8Array): keyof typeof MEDIA_TYPES | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") return "png";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(4, 8) === "ftyp" && /avif|avis/.test(ascii(8, 12))) return "avif";
  return null;
}

export type SavedUpload = { ok: true; url: string } | { ok: false; message: string };

export async function saveUpload(file: File): Promise<SavedUpload> {
  if (file.size === 0) return { ok: false, message: `${file.name}: the file is empty.` };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, message: `${file.name}: larger than 8 MB.` };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniff(bytes);
  if (!ext) return { ok: false, message: `${file.name}: please use a JPG, PNG, WebP or AVIF photo.` };

  const name = `${randomBytes(12).toString("hex")}.${ext}`;
  await fs.mkdir(/*turbopackIgnore: true*/ UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), bytes);
  return { ok: true, url: `/media/${name}` };
}

export async function readUpload(name: string) {
  if (!MEDIA_NAME.test(name)) return null;
  try {
    return await fs.readFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name));
  } catch {
    return null;
  }
}
