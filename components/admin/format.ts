/** Pure formatting helpers for the admin panel (safe on server and client). */
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

const dateTime = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const dateOnly = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Stored ISO timestamp → "16 Nov 2026, 4:05 pm" (IST). */
export function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateTime.format(d);
}

export function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateOnly.format(d);
}

/** Customer phone → international digits for wa.me / tel: (assumes India for 10-digit numbers). */
export function phoneDigits(phone?: string) {
  let d = (phone ?? "").replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length === 10) d = `91${d}`;
  return d;
}

export function telHref(phone: string) {
  const d = phoneDigits(phone);
  return d ? `tel:+${d}` : `tel:${phone}`;
}

export function customerWhatsapp(phone: string, text: string) {
  return `https://wa.me/${phoneDigits(phone)}?text=${encodeURIComponent(text)}`;
}

type OrderLike = {
  id: string;
  number: string;
  status: string;
  total: number;
  customer: { name: string };
  payment: { utr?: string };
};

/** Prefilled WhatsApp message to the customer for the order's current status. */
export function statusMessage(o: OrderLike) {
  const first = o.customer.name.split(" ")[0] || o.customer.name;
  const hello = `Hello ${first}, this is ${site.name} about your order ${o.number} (${formatPrice(o.total)}).`;
  const link = `${site.url}/order/${o.id}`;
  switch (o.status) {
    case "pending_payment":
      return `${hello}\n\nWe haven't received your UPI payment yet. You can complete it here: ${link}\nOnce paid, please share the UTR / transaction ID so we can confirm it.`;
    case "payment_submitted":
      return `${hello}\n\nThank you — we've received your payment reference${o.payment.utr ? ` (UTR ${o.payment.utr})` : ""} and are verifying it with our bank. We'll confirm shortly.`;
    case "paid":
      return `${hello}\n\nYour payment is confirmed — thank you! We're preparing your order now and will share the tracking details as soon as it ships.\n${link}`;
    case "shipped":
      return `${hello}\n\nGood news — your order has been shipped! Tracking details: \n${link}`;
    case "delivered":
      return `${hello}\n\nYour order has been delivered. We hope you love your pieces — we'd be grateful for a photo or a few words about them!`;
    case "cancelled":
      return `${hello}\n\nYour order has been cancelled. If you have paid, any amount will be refunded to the same UPI account. Please reply here if you have any questions.`;
    default:
      return hello;
  }
}
