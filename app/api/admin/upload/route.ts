import { isAdmin } from "@/lib/server/auth";
import { saveUpload } from "@/lib/server/media";

/**
 * Admin photo upload: multipart "files" (one or more). Returns the /media
 * URLs of the stored photos, plus a message for any file that was refused.
 * A Route Handler (not a Server Action) so large photos are not capped at 1 MB.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Please sign in again." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Could not read the upload." }, { status: 400 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File).slice(0, 12);
  if (files.length === 0) return Response.json({ error: "No photos were chosen." }, { status: 400 });

  const urls: string[] = [];
  const errors: string[] = [];
  for (const file of files) {
    const saved = await saveUpload(file);
    if (saved.ok) urls.push(saved.url);
    else errors.push(saved.message);
  }
  return Response.json({ urls, errors });
}
