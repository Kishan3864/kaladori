"use client";

import { useActionState, useId } from "react";
import { saveOrder, type OrderEditState } from "@/app/admin/actions";
import type { OrderStatus } from "@/lib/server/orders";
import { ADMIN_STATUS_LABEL } from "./status-badge";

const initial: OrderEditState = {};
const STATUSES = Object.entries(ADMIN_STATUS_LABEL) as [OrderStatus, string][];

/** Status select + internal note for one order. */
export function OrderEditor({
  id,
  status,
  adminNote,
  version,
}: {
  id: string;
  status: OrderStatus;
  adminNote?: string;
  /** updatedAt — remounts the fields with fresh defaults after any change. */
  version: string;
}) {
  const [state, action, pending] = useActionState(saveOrder, initial);
  const uid = useId();

  return (
    <form key={version} action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <div>
        <label htmlFor={`${uid}-status`} className="eyebrow block text-stone">
          Status
        </label>
        <select
          id={`${uid}-status`}
          name="status"
          defaultValue={status}
          className="mt-2 block w-full rounded-none border border-line bg-ivory px-3 py-3 text-[15px] text-ink outline-none focus:border-maroon"
        >
          {STATUSES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${uid}-note`} className="eyebrow block text-stone">
          Internal note <span className="normal-case tracking-normal">(only admins see this)</span>
        </label>
        <textarea
          id={`${uid}-note`}
          name="adminNote"
          rows={3}
          maxLength={1000}
          defaultValue={adminNote ?? ""}
          placeholder="e.g. Payment seen in HDFC app 16 Nov · Courier: Delhivery AWB 1234…"
          className="mt-2 block w-full resize-y rounded-none border border-line bg-ivory px-3 py-2.5 text-[15px] text-ink outline-none placeholder:text-stone/70 focus:border-maroon"
        />
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-ink min-h-11 px-6 disabled:cursor-wait disabled:opacity-70">
          {pending ? "Saving…" : "Save changes"}
        </button>
        <p role="status" aria-live="polite" className={state.ok ? "text-sm text-emerald-800" : "text-sm text-maroon"}>
          {pending ? "" : state.message}
        </p>
      </div>
    </form>
  );
}
