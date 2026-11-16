import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { setOrderStatus } from "@/app/admin/actions";
import { AdminHeader } from "@/components/admin/admin-header";
import { CopyButton } from "@/components/admin/copy-button";
import { customerWhatsapp, formatDateTime, statusMessage, telHref } from "@/components/admin/format";
import { gate } from "@/components/admin/gate";
import { OrderEditor } from "@/components/admin/order-editor";
import { StatusBadge } from "@/components/admin/status-badge";
import { SubmitButton } from "@/components/admin/submit-button";
import { getOrder, ORDER_STATUS_LABEL, type Order, type OrderStatus } from "@/lib/server/orders";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

type Params = Promise<{ id: string }>;

export default function AdminOrderPage({ params }: { params: Params }) {
  return (
    <div className="shell py-8 md:py-12">
      <AdminHeader active="orders" />
      <Link href="/admin" className="eyebrow link-draw mt-6 inline-block text-stone hover:text-ink">
        ← All orders
      </Link>
      <Suspense fallback={<div className="mt-6 h-[28rem] animate-pulse bg-sand/40" aria-busy="true" />}>
        <OrderDetail params={params} />
      </Suspense>
    </div>
  );
}

async function OrderDetail({ params }: { params: Params }) {
  await gate();
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <p className="mt-8 border border-dashed border-line px-6 py-12 text-center text-stone">
        Order not found. It may have been removed, or the link is wrong.
      </p>
    );
  }

  const c = order.customer;
  const itemCount = order.items.reduce((t, i) => t + i.quantity, 0);

  return (
    <div className="mt-6">
      {/* Title row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl md:text-4xl">{order.number}</h2>
          <p className="mt-2 text-sm text-stone">
            Placed {formatDateTime(order.createdAt)} · {itemCount} item{itemCount === 1 ? "" : "s"} ·{" "}
            <span className="font-medium text-ink">{formatPrice(order.total)}</span>
          </p>
        </div>
        <div className="text-right">
          <StatusBadge status={order.status} className="px-3 py-1.5 text-[11px]" />
          <p className="mt-2 text-xs text-stone">Customer sees: “{ORDER_STATUS_LABEL[order.status]}”</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_26rem]">
        {/* Left: order contents */}
        <div className="space-y-8">
          <Panel title="Payment (UPI)">
            {order.payment.utr ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-lg tracking-wide">{order.payment.utr}</span>
                <CopyButton value={order.payment.utr} label="Copy UTR" />
              </div>
            ) : (
              <p className="text-stone">No UTR submitted yet.</p>
            )}
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
              <dt className="text-stone">Amount due</dt>
              <dd className="font-medium">{formatPrice(order.total)}</dd>
              <dt className="text-stone">UTR submitted</dt>
              <dd>{formatDateTime(order.payment.submittedAt)}</dd>
            </dl>
            {order.status === "payment_submitted" ? (
              <p className="mt-4 border-l-2 border-maroon bg-blush/10 px-3 py-2 text-sm">
                Check your bank / UPI app for {formatPrice(order.total)} with this UTR, then mark the payment as
                verified.
              </p>
            ) : null}
          </Panel>

          <Panel title={`Items (${itemCount})`}>
            <ul className="divide-y divide-line">
              {order.items.map((item) => (
                <li key={`${item.slug}-${item.size}`} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-sand">
                    {item.image ? (
                      <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <Link href={`/product/${item.slug}`} target="_blank" className="link-draw font-medium">
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-stone">
                      {item.colour} · Size {item.size}
                    </p>
                    <p className="mt-1 text-stone">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotal)} />
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatPrice(order.shipping)} />
              <Row label="Total" value={formatPrice(order.total)} strong />
            </dl>
          </Panel>

          <Panel title="Customer & delivery">
            <div className="grid gap-6 text-sm sm:grid-cols-2">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="mt-1">
                  <a href={telHref(c.phone)} className="link-draw">
                    {c.phone}
                  </a>
                </p>
                {c.email ? (
                  <p className="mt-1 break-all">
                    <a href={`mailto:${c.email}`} className="link-draw">
                      {c.email}
                    </a>
                  </p>
                ) : null}
              </div>
              <address className="not-italic leading-relaxed">
                {c.address}
                <br />
                {c.city}, {c.state} {c.pincode}
              </address>
            </div>
            {c.notes ? (
              <div className="mt-5 border-t border-line pt-4 text-sm">
                <p className="eyebrow text-stone">Customer notes</p>
                <p className="mt-2 whitespace-pre-line">{c.notes}</p>
              </div>
            ) : null}
          </Panel>

          <Panel title="Timeline">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
              <dt className="text-stone">Placed</dt>
              <dd>{formatDateTime(order.createdAt)}</dd>
              <dt className="text-stone">UTR submitted</dt>
              <dd>{formatDateTime(order.payment.submittedAt)}</dd>
              <dt className="text-stone">Last updated</dt>
              <dd>{formatDateTime(order.updatedAt)}</dd>
              <dt className="text-stone">Order ID</dt>
              <dd className="break-all font-mono text-xs leading-5">{order.id}</dd>
            </dl>
          </Panel>
        </div>

        {/* Right: actions */}
        <div className="space-y-8 lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)] lg:self-start">
          <Panel title="Quick actions">
            <QuickActions order={order} />
          </Panel>

          <Panel title="Contact customer">
            <div className="flex flex-col gap-2">
              <a
                href={customerWhatsapp(c.phone, statusMessage(order))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ink min-h-11 px-4"
              >
                WhatsApp customer
              </a>
              <a href={telHref(c.phone)} className="btn btn-outline min-h-11 px-4">
                Call {c.phone}
              </a>
              {c.email ? (
                <a
                  href={`mailto:${c.email}?subject=${encodeURIComponent(`Your KalaDori order ${order.number}`)}`}
                  className="btn btn-outline min-h-11 px-4"
                >
                  Email
                </a>
              ) : null}
            </div>
            <p className="mt-3 text-xs text-stone">The WhatsApp message is prefilled for the current status — edit before sending.</p>
          </Panel>

          <Panel title="Status & note">
            <OrderEditor id={order.id} status={order.status} adminNote={order.adminNote} version={order.updatedAt} />
          </Panel>
        </div>
      </div>
    </div>
  );
}

const NEXT_STEP: Partial<Record<OrderStatus, { status: OrderStatus; label: string; confirm?: (o: Order) => string }>> = {
  pending_payment: {
    status: "paid",
    label: "Mark payment verified",
    confirm: (o) => `No UTR has been submitted. Mark ${o.number} as paid anyway? Only do this if you have received ${formatPrice(o.total)}.`,
  },
  payment_submitted: {
    status: "paid",
    label: "Mark payment verified",
    confirm: (o) => `Confirm you have received ${formatPrice(o.total)} for ${o.number} (UTR ${o.payment.utr ?? "—"})?`,
  },
  paid: { status: "shipped", label: "Mark shipped" },
  shipped: { status: "delivered", label: "Mark delivered" },
};

function QuickActions({ order }: { order: Order }) {
  const next = NEXT_STEP[order.status];
  const canCancel = order.status !== "cancelled" && order.status !== "delivered";

  if (!next && !canCancel) {
    return (
      <p className="text-sm text-stone">
        {order.status === "cancelled" ? "This order is cancelled." : "This order is complete."} Use “Status & note” below
        to change it if needed.
      </p>
    );
  }

  return (
    <form action={setOrderStatus} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={order.id} />
      {next ? (
        <SubmitButton
          name="status"
          value={next.status}
          pendingLabel="Updating…"
          confirm={next.confirm?.(order)}
          className="btn btn-ink min-h-11 px-4"
        >
          {next.label}
        </SubmitButton>
      ) : null}
      {canCancel ? (
        <SubmitButton
          name="status"
          value="cancelled"
          pendingLabel="Cancelling…"
          confirm={`Cancel order ${order.number}? The customer will see it as cancelled.`}
          className="btn min-h-11 border border-maroon/50 px-4 text-maroon hover:border-maroon hover:bg-maroon hover:text-ivory"
        >
          Cancel order
        </SubmitButton>
      ) : null}
    </form>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-ivory p-4 md:p-6">
      <h3 className="eyebrow mb-4 text-stone">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={strong ? "flex justify-between pt-1 text-base font-medium" : "flex justify-between"}>
      <dt className={strong ? "" : "text-stone"}>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
