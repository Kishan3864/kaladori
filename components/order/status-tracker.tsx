import type { OrderStatus } from "@/lib/server/orders";
import { cn } from "@/lib/utils";

type Status = OrderStatus;

/** How many steps are complete for each status. */
const DONE: Record<Exclude<Status, "cancelled">, number> = {
  pending_payment: 1,
  payment_submitted: 1,
  paid: 2,
  shipped: 3,
  delivered: 4,
};

/** Placed → Payment verified → Shipped → Delivered, with the current step highlighted. */
export function StatusTracker({ status, statusLabel }: { status: Status; statusLabel: string }) {
  if (status === "cancelled") {
    return (
      <div className="border-l-2 border-maroon bg-blush/10 px-5 py-4">
        <p className="eyebrow text-maroon">Status · {statusLabel}</p>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink/80">
          This order has been cancelled. If you have already paid, your refund is returned to the same UPI account.
          Write to us on WhatsApp with any questions.
        </p>
      </div>
    );
  }

  const done = DONE[status];
  const steps = [
    { label: "Order placed", note: "Received" },
    {
      label: "Payment verified",
      note: status === "pending_payment" ? "Awaiting payment" : status === "payment_submitted" ? "Verifying" : "Confirmed",
    },
    { label: "Shipped", note: done >= 3 ? "On its way" : "Being prepared" },
    { label: "Delivered", note: done >= 4 ? "Arrived" : "" },
  ];

  return (
    <div>
      <p className="eyebrow text-stone">
        Status <span className="text-ink">· {statusLabel}</span>
      </p>
      <ol className="mt-6 grid grid-cols-4">
        {steps.map((step, i) => {
          const complete = i < done;
          const current = i === done;
          return (
            <li key={step.label} aria-current={current ? "step" : undefined} className="relative pr-2">
              {/* Connector to the next step */}
              {i < steps.length - 1 ? (
                <span aria-hidden="true" className="absolute left-3 right-0 top-[11px] h-px bg-line">
                  <span className={cn("block h-px bg-maroon", i < done - 1 ? "w-full" : i === done - 1 ? "w-1/2" : "w-0")} />
                </span>
              ) : null}
              <span
                aria-hidden="true"
                className={cn(
                  "relative flex h-[23px] w-[23px] items-center justify-center rounded-full border",
                  complete && "border-maroon bg-maroon text-ivory",
                  current && "border-maroon bg-ivory",
                  !complete && !current && "border-ink/20 bg-ivory",
                )}
              >
                {complete ? (
                  <svg width="10" height="8" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5.2 4.3 8.5 11 1.5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                ) : current ? (
                  <span className="h-[7px] w-[7px] rounded-full bg-maroon motion-safe:animate-pulse" />
                ) : null}
              </span>
              <p className={cn("mt-3 text-[13px] leading-tight sm:text-[14px]", !complete && !current && "text-stone")}>
                {step.label}
                <span className="sr-only">{complete ? " — complete" : current ? " — in progress" : " — upcoming"}</span>
              </p>
              {step.note && (complete || current) ? (
                <p className={cn("mt-1 text-[11.5px] leading-snug sm:text-[12.5px]", current ? "text-maroon" : "text-stone")}>
                  {step.note}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
