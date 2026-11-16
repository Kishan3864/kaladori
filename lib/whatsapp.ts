import { site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

/** wa.me deep link to the KalaDori WhatsApp line, with an optional prefilled message. */
export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Prefilled enquiry for a single product. */
export function productEnquiryText(p: { name: string; colour: string; price: number; slug: string }, size?: string) {
  return [
    `Hello KalaDori, I'd like to order:`,
    `• ${p.name} — ${p.colour}${size ? `, size ${size}` : ""} (${formatPrice(p.price)})`,
    `${site.url}/product/${p.slug}`,
  ].join("\n");
}

export type WhatsAppOrderSummary = {
  number: string;
  customerName: string;
  items: { name: string; size: string; quantity: number; price: number }[];
  total: number;
  url: string;
  utr?: string;
};

/** Prefilled message that confirms a placed order (and payment reference, if any). */
export function orderWhatsappText(o: WhatsAppOrderSummary) {
  const lines = [
    `Hello KalaDori, this is ${o.customerName}.`,
    `Order ${o.number}:`,
    ...o.items.map((i) => `• ${i.name} (${i.size}) × ${i.quantity} — ${formatPrice(i.price * i.quantity)}`),
    `Total: ${formatPrice(o.total)}`,
  ];
  if (o.utr) lines.push(`UPI payment reference (UTR): ${o.utr}`);
  else lines.push(`I'll share the payment screenshot here.`);
  lines.push(o.url);
  return lines.join("\n");
}
