import { policies, site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export type BagLine = {
  /** Product link slug (the message links to each piece). */
  slug: string;
  name: string;
  colour: string;
  size: string;
  price: number;
  quantity: number;
};

/** Shipping shown to the shopper: mirrors the server's pricing in lib/server/orders.ts. */
export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= site.freeShippingThreshold ? 0 : policies.flatShipping;
}

/**
 * The complete WhatsApp order message: every piece with its link, colour,
 * size, quantity and price, then subtotal, shipping and total, delivery
 * timing, the details we need from the customer, and how payment works.
 * WhatsApp shows *text* in bold.
 */
export function bagWhatsappText(lines: BagLine[]) {
  const subtotal = lines.reduce((total, line) => total + line.price * line.quantity, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const pieces = lines.reduce((n, l) => n + l.quantity, 0);

  const items = lines.flatMap((line, i) => [
    `*${i + 1}. ${line.name}*`,
    `Colour: ${line.colour}`,
    `Size: ${line.size}`,
    `Quantity: ${line.quantity}`,
    `Price: ${formatPrice(line.price)}${line.quantity > 1 ? ` × ${line.quantity} = ${formatPrice(line.price * line.quantity)}` : ""}`,
    `Link: ${site.url}/product/${line.slug}`,
    "",
  ]);

  return [
    `Hello ${site.shortName}! I would like to place an order.`,
    "",
    `*ORDER (${pieces} ${pieces === 1 ? "piece" : "pieces"})*`,
    "",
    ...items,
    `Subtotal: ${formatPrice(subtotal)}`,
    shipping > 0
      ? `Shipping: ${formatPrice(shipping)} (free on orders over ${formatPrice(site.freeShippingThreshold)})`
      : "Shipping: FREE",
    `*Total: ${formatPrice(total)}*`,
    "",
    `Delivery: dispatched within ${policies.dispatchDays} working days, ${policies.deliveryMetroDays.join("-")} days to metro cities, ${policies.deliveryElsewhereDays.join("-")} days elsewhere in India.`,
    "",
    "*My details*",
    "Name: ",
    "Phone: ",
    "Full address: ",
    "City, State, PIN: ",
    "",
    "I will pay by UPI once you confirm availability. Thank you!",
  ].join("\n");
}
