import { bagWhatsappText } from "@/components/checkout/bag-whatsapp";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

/** wa.me deep link to the kaladori WhatsApp line, with an optional prefilled message. */
export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * The full order message for one product (same layout as the bag message:
 * link, colour, size, quantity, price, shipping, total, details, payment).
 */
export function productEnquiryText(
  p: { name: string; colour: string; price: number; slug: string },
  size?: string,
  quantity = 1,
) {
  return bagWhatsappText([
    { slug: p.slug, name: p.name, colour: p.colour, size: size ?? "One Size", price: p.price, quantity },
  ]);
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
    `Hello ${site.shortName}, this is ${o.customerName}.`,
    `*Order ${o.number}*`,
    ...o.items.map((i) => `• ${i.name} (${i.size}) × ${i.quantity}: ${formatPrice(i.price * i.quantity)}`),
    `*Total: ${formatPrice(o.total)}*`,
  ];
  if (o.utr) lines.push(`UPI payment reference (UTR): ${o.utr}`);
  else lines.push(`I'll share the payment screenshot here.`);
  lines.push(`Order page: ${o.url}`);
  return lines.join("\n");
}
