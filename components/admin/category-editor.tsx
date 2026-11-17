"use client";

import { useActionState, useId } from "react";
import {
  deleteCategoryAction,
  saveCategoryAction,
  type CategoryFormState,
} from "@/app/admin/catalog-actions";
import type { CategoryInfo } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const initial: CategoryFormState = {};
const field =
  "mt-1.5 block w-full rounded-none border border-line bg-ivory px-3 py-2.5 text-[15px] outline-none placeholder:text-stone/60 focus:border-maroon";

/** Add (no `category`) or edit one category, with delete for existing ones. */
export function CategoryEditor({ category, count }: { category?: CategoryInfo; count?: number }) {
  const [state, action, pending] = useActionState(saveCategoryAction, initial);
  const [delState, deleteAction, deleting] = useActionState(deleteCategoryAction, initial);
  const uid = useId();
  const message = delState.message ?? state.message;
  const ok = delState.message ? delState.ok : state.ok;

  return (
    <div className="space-y-3">
      <form action={action} className="grid gap-3 sm:grid-cols-2">
        {category ? <input type="hidden" name="originalSlug" value={category.slug} /> : null}
        <div>
          <label htmlFor={`${uid}-name`} className="eyebrow text-stone">
            Name *
          </label>
          <input id={`${uid}-name`} name="name" defaultValue={category?.name} placeholder="e.g. Lehengas" className={field} />
        </div>
        <div>
          <label htmlFor={`${uid}-slug`} className="eyebrow text-stone">
            Link
          </label>
          <input id={`${uid}-slug`} name="slug" defaultValue={category?.slug} placeholder="made from the name if empty" className={field} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-tagline`} className="eyebrow text-stone">
            Tagline
          </label>
          <input id={`${uid}-tagline`} name="tagline" defaultValue={category?.tagline} placeholder="e.g. Six yards of heritage" className={field} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-description`} className="eyebrow text-stone">
            Description
          </label>
          <textarea id={`${uid}-description`} name="description" rows={2} defaultValue={category?.description} className={field} />
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button type="submit" disabled={pending} className="btn btn-ink min-h-11 px-6 disabled:opacity-60">
            {pending ? "Saving…" : category ? "Save" : "Add category"}
          </button>
          {category ? (
            <button
              type="submit"
              formAction={deleteAction}
              name="slug"
              value={category.slug}
              disabled={deleting || (count ?? 0) > 0}
              title={(count ?? 0) > 0 ? "Move or delete its products first" : undefined}
              onClick={(e) => {
                if (!window.confirm(`Delete the category “${category.name}”?`)) e.preventDefault();
              }}
              className="border border-maroon px-4 py-2.5 text-[13px] text-maroon hover:bg-maroon hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-maroon"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          ) : null}
          {category && (count ?? 0) > 0 ? (
            <span className="text-[13px] text-stone">
              {count} product{count === 1 ? "" : "s"}: move them to another category before deleting.
            </span>
          ) : null}
        </div>
      </form>
      <p role="status" className={cn("min-h-5 text-[14px]", ok ? "text-ink" : "text-maroon")}>
        {message}
      </p>
    </div>
  );
}
