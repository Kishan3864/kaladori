import { policies, site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export type BagLine = {
  name: string;
  colour: string;
  size: string;
  price: number;
  quantity: number;
};

/** Shipping shown to the shopper — mirrors the server's pricing in lib/server/orders.ts. */
export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= site.freeShippingThreshold ? 0 : policies.flatShipping;
}

/** Prefilled WhatsApp message listing the bag, for ordering without the checkout form. */
export function bagWhatsappText(lines: BagLine[]) {
  const subtotal = lines.reduce((total, line) => total + line.price * line.quantity, 0);
  const shipping = shippingFor(subtotal);
  return [
    "Hello KalaDori, I'd like to order:",
    ...lines.map(
      (line) =>
        `• ${line.name} — ${line.colour}, ${line.size} × ${line.quantity} (${formatPrice(line.price * line.quantity)})`,
    ),
    `Subtotal: ${formatPrice(subtotal)}`,
    shipping > 0 ? `Shipping: ${formatPrice(shipping)}` : "Shipping: complimentary",
    `Total: ${formatPrice(subtotal + shipping)}`,
  ].join("\n");
}
