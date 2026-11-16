import type { OrderStatus } from "@/lib/server/orders";
import { cn } from "@/lib/utils";

/** Short labels for compact UI (the full ORDER_STATUS_LABEL is customer-facing). */
export const ADMIN_STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  payment_submitted: "Verify payment",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const TONE: Record<OrderStatus, string> = {
  pending_payment: "border-line bg-sand/60 text-stone",
  payment_submitted: "border-maroon bg-maroon text-ivory",
  paid: "border-emerald-700/30 bg-emerald-50 text-emerald-800",
  shipped: "border-ink/30 bg-ivory text-ink",
  delivered: "border-ink bg-ink text-ivory",
  cancelled: "border-line bg-transparent text-stone line-through",
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap border px-2 py-1 text-[10px] font-medium uppercase leading-none tracking-[0.16em]",
        TONE[status] ?? TONE.pending_payment,
        className,
      )}
    >
      {ADMIN_STATUS_LABEL[status] ?? status}
    </span>
  );
}
