import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { formatDate, formatDateTime } from "@/components/admin/format";
import { gate } from "@/components/admin/gate";
import { ADMIN_STATUS_LABEL, StatusBadge } from "@/components/admin/status-badge";
import { listMessages } from "@/lib/server/contacts";
import { listOrders, ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/server/orders";
import { cn, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="shell py-8 md:py-12">
      <AdminHeader active="orders" />
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const REVENUE: OrderStatus[] = ["paid", "shipped", "delivered"];
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const itemCount = (o: Order) => o.items.reduce((t, i) => t + i.quantity, 0);

async function Dashboard({ searchParams }: { searchParams: SearchParams }) {
  await gate();
  const [orders, messages, sp] = await Promise.all([listOrders(), listMessages(), searchParams]);

  const statusParam = first(sp.status);
  const status = (ORDER_STATUSES as readonly string[]).includes(statusParam) ? (statusParam as OrderStatus) : null;
  const q = first(sp.q).trim().slice(0, 60);

  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;
  const revenueOrders = orders.filter((o) => REVENUE.includes(o.status));
  const revenue = revenueOrders.reduce((t, o) => t + o.total, 0);
  const unread = messages.filter((m) => !m.read).length;

  const needle = q.toLowerCase();
  const needleDigits = q.replace(/\D/g, "");
  const visible = orders.filter((o) => {
    if (status && o.status !== status) return false;
    if (!needle) return true;
    return (
      o.number.toLowerCase().includes(needle) ||
      o.customer.name.toLowerCase().includes(needle) ||
      (o.payment.utr ?? "").toLowerCase().includes(needle) ||
      (needleDigits.length >= 4 && o.customer.phone.replace(/\D/g, "").includes(needleDigits))
    );
  });

  const href = (s: OrderStatus | null) => {
    const p = new URLSearchParams();
    if (s) p.set("status", s);
    if (q) p.set("q", q);
    const qs = p.toString();
    return qs ? `/admin?${qs}` : "/admin";
  };

  return (
    <div className="mt-8 space-y-10">
      {/* Summary */}
      <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Awaiting payment" value={count("pending_payment")} href="/admin?status=pending_payment" />
        <StatCard
          label="Payment to verify"
          value={count("payment_submitted")}
          href="/admin?status=payment_submitted"
          highlight={count("payment_submitted") > 0}
        />
        <StatCard label="Paid · ready to ship" value={count("paid")} href="/admin?status=paid" />
        <StatCard
          label="Revenue (paid → delivered)"
          value={formatPrice(revenue)}
          note={`${revenueOrders.length} order${revenueOrders.length === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Unread messages"
          value={unread}
          href="/admin/messages"
          highlight={unread > 0}
          className="col-span-2 lg:col-span-1"
        />
      </section>

      {/* Orders */}
      <section aria-labelledby="orders-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="orders-heading" className="font-display text-2xl">
            Orders <span className="text-base text-stone">({orders.length})</span>
          </h2>
          <form action="/admin" role="search" className="flex w-full max-w-sm items-center gap-2 sm:w-auto">
            {status ? <input type="hidden" name="status" value={status} /> : null}
            <label htmlFor="order-search" className="sr-only">
              Search orders
            </label>
            <input
              id="order-search"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Order no., name, phone or UTR"
              className="min-w-0 flex-1 rounded-none border border-line bg-ivory px-3 py-2.5 text-sm outline-none placeholder:text-stone/70 focus:border-maroon sm:w-64"
            />
            <button type="submit" className="btn btn-outline min-h-10 px-4">
              Search
            </button>
          </form>
        </div>

        <nav aria-label="Filter by status" className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          <FilterChip href={href(null)} active={!status} label="All" n={orders.length} />
          {ORDER_STATUSES.map((s) => (
            <FilterChip key={s} href={href(s)} active={status === s} label={ADMIN_STATUS_LABEL[s]} n={count(s)} />
          ))}
        </nav>

        {q ? (
          <p className="mt-4 text-sm text-stone">
            {visible.length} result{visible.length === 1 ? "" : "s"} for “{q}” ·{" "}
            <Link href={status ? `/admin?status=${status}` : "/admin"} className="link-draw text-ink">
              Clear search
            </Link>
          </p>
        ) : null}

        {visible.length === 0 ? (
          <p className="mt-8 border border-dashed border-line px-6 py-12 text-center text-stone">
            {orders.length === 0 ? "No orders yet." : "No orders match this filter."}
          </p>
        ) : (
          <>
            {/* Phone: cards */}
            <ul className="mt-6 space-y-3 md:hidden">
              {visible.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className={cn(
                      "block border bg-ivory p-4 transition-colors hover:border-ink",
                      o.status === "payment_submitted" ? "border-maroon" : "border-line",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">{o.number}</p>
                        <p className="mt-0.5 text-xs text-stone">{formatDateTime(o.createdAt)}</p>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate">{o.customer.name}</p>
                        <p className="text-stone">{o.customer.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(o.total)}</p>
                        <p className="text-xs text-stone">
                          {itemCount(o)} item{itemCount(o) === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    {o.payment.utr ? (
                      <p className="mt-3 border-t border-line pt-2 text-xs text-stone">
                        UTR <span className="font-mono text-ink">{o.payment.utr}</span>
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Tablet / desktop: table */}
            <div className="mt-6 hidden overflow-x-auto border border-line md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-sand/50">
                  <tr className="eyebrow text-stone">
                    <th scope="col" className="px-4 py-3 font-medium">Order</th>
                    <th scope="col" className="px-4 py-3 font-medium">Date</th>
                    <th scope="col" className="px-4 py-3 font-medium">Customer</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">Items</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">Total</th>
                    <th scope="col" className="px-4 py-3 font-medium">UTR</th>
                    <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((o) => (
                    <tr
                      key={o.id}
                      className={cn(
                        "border-t border-line align-top transition-colors hover:bg-sand/30",
                        o.status === "payment_submitted" && "bg-blush/10",
                      )}
                    >
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${o.id}`} className="link-draw font-medium text-ink">
                          {o.number}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-stone">
                        <span className="lg:hidden">{formatDate(o.createdAt)}</span>
                        <span className="hidden lg:inline">{formatDateTime(o.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p>{o.customer.name}</p>
                        <p className="text-stone">{o.customer.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{itemCount(o)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums">
                        {formatPrice(o.total)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{o.payment.utr ?? <span className="text-stone">—</span>}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
  href,
  highlight,
  className,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
  href?: string;
  highlight?: boolean;
  className?: string;
}) {
  const body = (
    <>
      <p className={cn("eyebrow", highlight ? "text-ivory/80" : "text-stone")}>{label}</p>
      <p className="mt-3 font-display text-3xl leading-none tabular-nums">{value}</p>
      {note ? <p className={cn("mt-2 text-xs", highlight ? "text-ivory/80" : "text-stone")}>{note}</p> : null}
    </>
  );
  const cls = cn(
    "block border p-4 transition-colors md:p-5",
    highlight ? "border-maroon bg-maroon text-ivory hover:bg-maroon-deep" : "border-line bg-ivory",
    href && !highlight && "hover:border-ink",
    className,
  );
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function FilterChip({ href, active, label, n }: { href: string; active: boolean; label: string; n: number }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 border px-3 py-2 text-xs transition-colors",
        active ? "border-ink bg-ink text-ivory" : "border-line text-ink hover:border-ink",
      )}
    >
      {label}
      <span className={cn("tabular-nums", active ? "text-ivory/70" : "text-stone")}>{n}</span>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mt-8 space-y-10" aria-busy="true" aria-label="Loading orders">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={cn("h-28 animate-pulse bg-sand/50", i === 4 && "col-span-2 lg:col-span-1")} />
        ))}
      </div>
      <div className="h-80 animate-pulse bg-sand/40" />
    </div>
  );
}
