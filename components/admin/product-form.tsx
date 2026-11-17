"use client";

import Image from "next/image";
import { useActionState, useId, useRef, useState } from "react";
import { saveProductAction, type ProductFormState } from "@/app/admin/catalog-actions";
import type { CategoryInfo, Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const initial: ProductFormState = {};
const SIZE_PRESETS = [
  { label: "One Size", value: "One Size" },
  { label: "XS to XXL", value: "XS, S, M, L, XL, XXL" },
  { label: "S to XL", value: "S, M, L, XL" },
  { label: "Free Size", value: "Free Size" },
];

const field =
  "mt-2 block w-full rounded-none border border-line bg-ivory px-3 py-2.5 text-[15px] text-ink outline-none placeholder:text-stone/60 focus:border-maroon";

/** Add or edit one product. `product` undefined = new product. */
export function ProductForm({ product, categories }: { product?: Product; categories: CategoryInfo[] }) {
  const [state, action, pending] = useActionState(saveProductAction, initial);
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const err = state.errors ?? {};

  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadNote, setUploadNote] = useState("");
  const [sizes, setSizes] = useState(product?.sizes.join(", ") ?? "One Size");
  const [colourHex, setColourHex] = useState(product?.colourHex ?? "#8a7f74");
  const [linkInput, setLinkInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadNote("");
    // One photo per request: stays under the server's request size limit
    // however many photos are chosen together.
    let added = 0;
    const problems: string[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("files", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        if (res.status === 413) {
          problems.push(`${file.name}: too large for the server.`);
          continue;
        }
        const data = (await res.json()) as { urls?: string[]; errors?: string[]; error?: string };
        if (data.urls?.length) {
          added += data.urls.length;
          setImages((list) => [...list, ...data.urls!].slice(0, 8));
        }
        problems.push(...[data.error, ...(data.errors ?? [])].filter((m): m is string => Boolean(m)));
      } catch {
        problems.push(`${file.name}: upload failed, please check your connection.`);
      }
    }
    setUploadNote([added ? `${added} photo${added === 1 ? "" : "s"} added.` : "", ...problems].filter(Boolean).join(" "));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function move(i: number, dir: -1 | 1) {
    setImages((list) => {
      const next = [...list];
      const j = i + dir;
      if (j < 0 || j >= next.length) return list;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function addLink() {
    const url = linkInput.trim();
    if (!/^https:\/\/images\.unsplash\.com\//.test(url)) {
      setUploadNote("Only links from images.unsplash.com can be added. For other photos, upload the file.");
      return;
    }
    setImages((list) => [...list, url].slice(0, 8));
    setLinkInput("");
    setUploadNote("");
  }

  const fieldError = (name: string) =>
    err[name] ? (
      <p id={id(`${name}-err`)} className="mt-1.5 text-[13px] text-maroon">
        {err[name]}
      </p>
    ) : null;

  return (
    <form action={action} className="grid gap-10 lg:grid-cols-12" noValidate>
      {product ? <input type="hidden" name="originalSlug" value={product.slug} /> : null}
      {images.map((url) => (
        <input key={url} type="hidden" name="images" value={url} />
      ))}

      <div className="space-y-6 lg:col-span-7">
        <div>
          <label htmlFor={id("name")} className="eyebrow block text-stone">
            Product name *
          </label>
          <input id={id("name")} name="name" defaultValue={product?.name} required className={field} aria-invalid={!!err.name} />
          {fieldError("name")}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={id("category")} className="eyebrow block text-stone">
              Category *
            </label>
            <select id={id("category")} name="category" defaultValue={product?.category ?? categories[0]?.slug} className={field}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {fieldError("category")}
          </div>
          <div>
            <label htmlFor={id("slug")} className="eyebrow block text-stone">
              Link (web address)
            </label>
            <input
              id={id("slug")}
              name="slug"
              defaultValue={product?.slug}
              placeholder="made from the name if empty"
              className={field}
              aria-invalid={!!err.slug}
            />
            {fieldError("slug")}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={id("price")} className="eyebrow block text-stone">
              Price (₹) *
            </label>
            <input id={id("price")} name="price" type="number" min={1} step={1} inputMode="numeric" defaultValue={product?.price} className={field} aria-invalid={!!err.price} />
            {fieldError("price")}
          </div>
          <div>
            <label htmlFor={id("compare")} className="eyebrow block text-stone">
              Original price (₹), for a sale
            </label>
            <input id={id("compare")} name="compareAtPrice" type="number" min={1} step={1} inputMode="numeric" defaultValue={product?.compareAtPrice} placeholder="leave empty if not on sale" className={field} aria-invalid={!!err.compareAtPrice} />
            {fieldError("compareAtPrice")}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={id("colour")} className="eyebrow block text-stone">
              Colour name
            </label>
            <div className="flex items-end gap-3">
              <input id={id("colour")} name="colour" defaultValue={product?.colour} placeholder="e.g. Saffron Gold" className={field} />
              <input
                type="color"
                name="colourHex"
                value={colourHex}
                onChange={(e) => setColourHex(e.target.value)}
                aria-label="Colour swatch"
                className="h-[46px] w-14 shrink-0 cursor-pointer border border-line bg-ivory p-1"
              />
            </div>
          </div>
          <div>
            <label htmlFor={id("fabric")} className="eyebrow block text-stone">
              Fabric
            </label>
            <input id={id("fabric")} name="fabric" defaultValue={product?.fabric} placeholder="e.g. Pure Katan silk" className={field} />
          </div>
        </div>

        <div>
          <label htmlFor={id("summary")} className="eyebrow block text-stone">
            Short summary *
          </label>
          <input id={id("summary")} name="summary" defaultValue={product?.summary} maxLength={240} placeholder="One line for cards and Google" className={field} aria-invalid={!!err.summary} />
          {fieldError("summary")}
        </div>

        <div>
          <label htmlFor={id("description")} className="eyebrow block text-stone">
            Description
          </label>
          <textarea id={id("description")} name="description" rows={5} defaultValue={product?.description} className={field} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={id("details")} className="eyebrow block text-stone">
              Details <span className="normal-case tracking-normal">(one per line)</span>
            </label>
            <textarea id={id("details")} name="details" rows={5} defaultValue={product?.details.join("\n")} className={field} />
          </div>
          <div>
            <label htmlFor={id("care")} className="eyebrow block text-stone">
              Care <span className="normal-case tracking-normal">(one per line)</span>
            </label>
            <textarea id={id("care")} name="care" rows={5} defaultValue={product?.care.join("\n")} className={field} />
          </div>
        </div>

        <div>
          <label htmlFor={id("sizes")} className="eyebrow block text-stone">
            Sizes * <span className="normal-case tracking-normal">(separated by commas)</span>
          </label>
          <input id={id("sizes")} name="sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} className={field} aria-invalid={!!err.sizes} />
          <div className="mt-2 flex flex-wrap gap-2">
            {SIZE_PRESETS.map((p) => (
              <button key={p.label} type="button" onClick={() => setSizes(p.value)} className="border border-line px-3 py-1.5 text-[12px] hover:border-ink">
                {p.label}
              </button>
            ))}
          </div>
          {fieldError("sizes")}
        </div>
      </div>

      <div className="space-y-6 lg:col-span-5">
        {/* Photos */}
        <fieldset>
          <legend className="eyebrow text-stone">Photos * (first one is the main photo, up to 8)</legend>
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((url, i) => (
              <li key={url} className="group relative aspect-[3/4] overflow-hidden bg-sand">
                <Image src={url} alt="" fill sizes="120px" className="object-cover" />
                {i === 0 ? <span className="absolute left-1 top-1 bg-ink px-1.5 py-0.5 text-[10px] text-ivory">Main</span> : null}
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/70 p-1 text-ivory">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="h-7 w-7 text-sm disabled:opacity-30" aria-label="Move photo earlier">
                    ←
                  </button>
                  <button type="button" onClick={() => setImages((l) => l.filter((u) => u !== url))} className="h-7 w-7 text-sm" aria-label="Remove photo">
                    ✕
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="h-7 w-7 text-sm disabled:opacity-30" aria-label="Move photo later">
                    →
                  </button>
                </div>
              </li>
            ))}
            {images.length < 8 ? (
              <li>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-1 border border-dashed border-ink/40 text-[12px] text-stone hover:border-ink hover:text-ink disabled:cursor-wait"
                >
                  <span className="text-2xl leading-none">{uploading ? "…" : "+"}</span>
                  {uploading ? "Uploading" : "Upload"}
                </button>
              </li>
            ) : null}
          </ul>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="sr-only"
            tabIndex={-1}
            aria-label="Upload photos"
            onChange={(e) => upload(e.target.files)}
          />
          <div className="mt-3 flex gap-2">
            <label htmlFor={id("link")} className="sr-only">
              Unsplash photo link
            </label>
            <input
              id={id("link")}
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="or paste an images.unsplash.com link"
              className="min-w-0 flex-1 rounded-none border border-line bg-ivory px-3 py-2 text-[13px] outline-none focus:border-maroon"
            />
            <button type="button" onClick={addLink} className="border border-ink px-3 text-[12px]">
              Add
            </button>
          </div>
          <p aria-live="polite" className="mt-2 min-h-5 text-[13px] text-stone">
            {uploadNote}
          </p>
          {fieldError("images")}
        </fieldset>

        <div>
          <label htmlFor={id("badge")} className="eyebrow block text-stone">
            Badge <span className="normal-case tracking-normal">(optional, e.g. Handloom, Limited)</span>
          </label>
          <input id={id("badge")} name="badge" maxLength={24} defaultValue={product?.badge} className={field} />
        </div>

        <div className="space-y-3 border border-line p-4">
          <label className="flex items-center gap-3 text-[15px]">
            <input type="checkbox" name="published" defaultChecked={product?.published !== false} className="h-5 w-5 accent-maroon" />
            Show in the shop
          </label>
          <label className="flex items-center gap-3 text-[15px]">
            <input type="checkbox" name="isNew" defaultChecked={product ? Boolean(product.isNew) : true} className="h-5 w-5 accent-maroon" />
            Mark as New (shows in &ldquo;New this season&rdquo;)
          </label>
        </div>

        <div className="sticky bottom-0 -mx-5 border-t border-line bg-ivory/95 px-5 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
          <button type="submit" disabled={pending || uploading} className="btn btn-ink w-full disabled:cursor-wait disabled:opacity-60">
            {pending ? "Saving…" : product ? "Save changes" : "Add product"}
          </button>
          <p
            role="status"
            className={cn("mt-3 min-h-5 text-[14px]", state.ok ? "text-ink" : "text-maroon")}
          >
            {state.message}
          </p>
        </div>
      </div>
    </form>
  );
}
