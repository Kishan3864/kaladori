import Image from "next/image";
import Link from "next/link";
import { WhatsAppGlyph } from "@/components/checkout/whatsapp-glyph";
import { ORDER_STATUS_LABEL, type Order } from "@/lib/server/orders";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";
import { orderWhatsappText, whatsappLink } from "@/lib/whatsapp";
import { PaymentPanel, type PaymentInfo } from "./payment-panel";
import { StatusTracker } from "./status-tracker";

export type { PaymentInfo };

const placedAt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

function formatPlacedAt(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : `${placedAt.format(date)} IST`;
}

const HEADLINES: Record<Order["status"], { title: React.ReactNode; lede: string }> = {
  pending_payment: {
    title: <>One last step.</>,
    lede: "Your order is placed and your pieces are reserved. Pay by UPI below, then share the reference so we can confirm.",
  },
  payment_submitted: {
    title: (
      <>
        We&rsquo;re verifying your <em className="italic">payment</em>.
      </>
    ),
    lede: "Thank you. We check every payment by hand and confirm on WhatsApp within a few working hours.",
  },
  paid: {
    title: (
      <>
        Payment <em className="italic">confirmed</em>.
      </>
    ),
    lede: "Your order is being prepared at the atelier. We’ll message you on WhatsApp with tracking once it ships.",
  },
  shipped: {
    title: (
      <>
        Your order is on its <em className="italic">way</em>.
      </>
    ),
    lede: "It has left the atelier. Tracking details have been shared on WhatsApp.",
  },
  delivered: {
    title: (
      <>
        Delivered, with <em className="italic">care</em>.
      </>
    ),
    lede: "We hope you love it. Tell us how it drapes — we always enjoy hearing from you.",
  },
  cancelled: {
    title: <>This order was cancelled.</>,
    lede: "If this is unexpected, message us on WhatsApp and we’ll sort it out.",
  },
};

/** Order confirmation, status and (while unpaid) the UPI payment panel. */
export function OrderDetails({ order, payment }: { order: Order; payment: PaymentInfo | null }) {
  const firstName = order.customer.name.split(/\s+/)[0] ?? "";
  const summary = {
    number: order.number,
    customerName: order.customer.name,
    items: order.items,
    total: order.total,
    url: `${site.url}/order/${order.id}`,
  };
  const whatsappHref = whatsappLink(orderWhatsappText({ ...summary, utr: order.payment.utr }));
  const headline = HEADLINES[order.status];
  const placed = formatPlacedAt(order.createdAt);
  const count = order.items.reduce((total, item) => total + item.quantity, 0);
  const { customer } = order;

  return (
    <section className="shell pb-24 pt-10 md:pb-32 md:pt-16">
      {/* Heading */}
      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="h-px w-10 bg-maroon" aria-hidden="true" />
          <p className="eyebrow text-maroon">Order {order.number}</p>
        </div>
        <h1 className="text-title mt-6 md:mt-8">
          {order.status === "pending_payment" ? (
            <>
              Thank you{firstName ? <>, {firstName}</> : null}. <span className="block">{headline.title}</span>
            </>
          ) : (
            headline.title
          )}
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/75 md:text-base">{headline.lede}</p>
        {placed ? <p className="mt-3 text-[13px] text-stone">Placed on {placed}</p> : null}
      </header>

      <div className="mt-10 max-w-3xl border-y border-line py-7 md:mt-12">
        <StatusTracker status={order.status} statusLabel={ORDER_STATUS_LABEL[order.status]} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-y-10 md:mt-12 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-16">
        {/* Main column: payment, then the pieces */}
        <div className="min-w-0 space-y-10 lg:col-span-7">
          {payment ? (
            <PaymentPanel
              orderId={order.id}
              orderNumber={order.number}
              total={order.total}
              submittedUtr={order.payment.utr}
              payment={payment}
              summary={summary}
            />
          ) : null}

          <div className="bg-sand/60 px-5 py-6 sm:px-8 sm:py-7">
            <p className="text-[15px] leading-relaxed">
              {payment
                ? "After paying, send us your order details and payment screenshot on WhatsApp. It is the quickest way to get your order confirmed."
                : "Questions about your order? Message us on WhatsApp with your order number."}
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-5 w-full border border-maroon bg-maroon text-ivory hover:border-maroon-deep hover:bg-maroon-deep sm:w-auto"
            >
              <WhatsAppGlyph size={17} />
              Send order details on WhatsApp
            </a>
          </div>

          <section aria-labelledby="items-heading">
            <h2 id="items-heading" className="flex items-baseline gap-3 text-2xl">
              Your pieces <span className="font-sans text-sm tracking-normal text-stone">({count})</span>
            </h2>
            <ul className="mt-5 border-t border-line">
              {order.items.map((item) => (
                <li key={`${item.slug}-${item.size}`} className="flex gap-4 border-b border-line py-5 sm:gap-5">
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative block aspect-[3/4] w-20 shrink-0 overflow-hidden bg-sand sm:w-24"
                  >
                    <Image src={item.image} alt={item.name} fill sizes="(min-width: 640px) 96px, 80px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <Link href={`/product/${item.slug}`} className="link-draw text-[15px] leading-snug">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-[13px] text-stone">
                        {item.colour} · {item.size}
                      </p>
                      <p className="mt-1 text-[13px] tabular-nums text-stone">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="shrink-0 text-[15px] tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Side column: totals, address, contact */}
        <aside className="space-y-6 lg:col-span-5 xl:col-span-4 xl:col-start-9">
          <div className="border border-line px-5 py-6 sm:px-6">
            <h2 className="eyebrow font-sans tracking-[0.26em]">Order summary</h2>
            <dl className="mt-5 space-y-3 text-[14px]">
              <div className="flex justify-between gap-4">
                <dt className="text-stone">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone">Shipping</dt>
                <dd className="tabular-nums">{order.shipping > 0 ? formatPrice(order.shipping) : "Complimentary"}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
                <dt className="eyebrow">Total</dt>
                <dd className="font-display text-2xl tabular-nums">{formatPrice(order.total)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-[12.5px] text-stone">Taxes included · Paid by UPI</p>
            {order.payment.utr ? (
              <p className="mt-3 text-[12.5px] text-stone">
                Payment reference <span className="tracking-wide text-ink">{order.payment.utr}</span>
              </p>
            ) : null}
          </div>

          <div className="border border-line px-5 py-6 sm:px-6">
            <h2 className="eyebrow font-sans tracking-[0.26em]">Delivering to</h2>
            <address className="mt-5 text-[14.5px] not-italic leading-relaxed">
              {customer.name}
              <br />
              {customer.address}
              <br />
              {customer.city}, {customer.state} {customer.pincode}
            </address>
            <p className="mt-3 text-[13.5px] text-stone">{customer.phone}</p>
            {customer.email ? <p className="mt-1 break-all text-[13.5px] text-stone">{customer.email}</p> : null}
            {customer.notes ? (
              <p className="mt-4 border-t border-line pt-4 text-[13.5px] leading-relaxed text-stone">
                <span className="eyebrow mr-2 text-ink">Note</span>
                {customer.notes}
              </p>
            ) : null}
          </div>

          <div className="bg-ink px-5 py-7 text-ivory sm:px-6">
            <p className="eyebrow text-blush">Your order is in good hands</p>
            <p className="mt-4 font-display text-2xl leading-snug">{site.owner}</p>
            <p className="mt-1 text-[13.5px] text-ivory/65">Founder, {site.name}</p>
            <p className="mt-5 text-[14px] leading-relaxed text-ivory/80">
              Every order is confirmed personally. Call or WhatsApp us, {site.hours}.
            </p>
            <div className="mt-6 flex flex-col gap-1">
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-11 items-center text-[15px] tabular-nums"
              >
                <span className="link-draw py-0.5">{site.phone}</span>
              </a>
              <a
                href={whatsappLink(`Hello KalaDori, a question about order ${order.number}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2.5 text-[15px]"
              >
                <WhatsAppGlyph size={16} />
                <span className="link-draw py-0.5">Message on WhatsApp</span>
              </a>
            </div>
          </div>

          <p className="px-1 text-[12.5px] leading-relaxed text-stone">
            This page is your private order link. Bookmark it to check your order&rsquo;s status at any time.
          </p>
        </aside>
      </div>
    </section>
  );
}
