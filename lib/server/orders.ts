/** Orders: creation (server-side pricing), lookup, status updates. SERVER ONLY. */
import { randomBytes, randomInt } from "node:crypto";
import { getProduct } from "@/lib/catalog";
import { getCatalog } from "@/lib/server/catalog";
import { policies, site } from "@/lib/site";
import { readCollection, updateCollection } from "@/lib/server/store";

const FILE = "orders.json";

export const ORDER_STATUSES = [
  "pending_payment",
  "payment_submitted",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  payment_submitted: "Payment submitted — verifying",
  paid: "Payment confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export type OrderLine = {
  slug: string;
  name: string;
  colour: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
};

export type Customer = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
};

export type Order = {
  /** Unguessable id used in the order URL. */
  id: string;
  /** Human-friendly order number, e.g. KD261116-4821. */
  number: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  customer: Customer;
  items: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: { method: "upi"; utr?: string; submittedAt?: string };
  adminNote?: string;
};

export type OrderInput = {
  items: { slug: string; size: string; quantity: number }[];
  customer: Customer;
};

export type FieldErrors = Partial<Record<keyof Customer | "items", string>>;

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

/** Validate customer details; returns normalised data or field errors. */
export function validateCustomer(raw: Partial<Record<keyof Customer, unknown>>) {
  const c: Customer = {
    name: clean(raw.name, 80),
    phone: clean(raw.phone, 20).replace(/[^\d+]/g, ""),
    email: clean(raw.email, 120) || undefined,
    address: clean(raw.address, 300),
    city: clean(raw.city, 60),
    state: clean(raw.state, 60),
    pincode: clean(raw.pincode, 10).replace(/\D/g, ""),
    notes: clean(raw.notes, 500) || undefined,
  };
  const errors: FieldErrors = {};
  if (c.name.length < 2) errors.name = "Please enter your full name.";
  const digits = c.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) errors.phone = "Please enter a valid mobile number.";
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email)) errors.email = "Please enter a valid email address.";
  if (c.address.length < 8) errors.address = "Please enter your full delivery address.";
  if (c.city.length < 2) errors.city = "Please enter your city.";
  if (c.state.length < 2) errors.state = "Please enter your state.";
  if (!/^\d{6}$/.test(c.pincode)) errors.pincode = "Please enter a 6-digit PIN code.";
  return { customer: c, errors };
}

/** Price the cart from the live catalogue: never trust client prices. Hidden or deleted pieces drop out. */
export async function priceItems(items: OrderInput["items"]) {
  const catalog = await getCatalog();
  const lines: OrderLine[] = [];
  for (const raw of items.slice(0, 30)) {
    const product = getProduct(catalog, String(raw.slug));
    if (!product) continue;
    const size = product.sizes.includes(String(raw.size)) ? String(raw.size) : null;
    if (!size) continue;
    const quantity = Math.min(10, Math.max(1, Math.floor(Number(raw.quantity) || 1)));
    const existing = lines.find((l) => l.slug === product.slug && l.size === size);
    if (existing) {
      existing.quantity = Math.min(10, existing.quantity + quantity);
      continue;
    }
    lines.push({
      slug: product.slug,
      name: product.name,
      colour: product.colour,
      size,
      price: product.price,
      quantity,
      image: product.images[0],
    });
  }
  const subtotal = lines.reduce((t, l) => t + l.price * l.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= site.freeShippingThreshold ? 0 : policies.flatShipping;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}

function orderNumber(now: Date) {
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, "");
  return `KD${ymd}-${randomInt(1000, 10000)}`;
}

export async function createOrder(input: OrderInput) {
  const { customer, errors } = validateCustomer(input.customer ?? {});
  const priced = await priceItems(Array.isArray(input.items) ? input.items : []);
  if (priced.lines.length === 0) errors.items = "Your bag is empty.";
  if (Object.keys(errors).length > 0) return { ok: false as const, errors };

  const now = new Date();
  const order: Order = {
    id: randomBytes(12).toString("hex"),
    number: orderNumber(now),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    status: "pending_payment",
    customer,
    items: priced.lines,
    subtotal: priced.subtotal,
    shipping: priced.shipping,
    total: priced.total,
    payment: { method: "upi" },
  };
  await updateCollection<Order, null>(FILE, (items) => ({ items: [order, ...items], result: null }));
  return { ok: true as const, order };
}

export async function getOrder(id: string) {
  if (!/^[a-f0-9]{24}$/.test(id)) return null;
  const orders = await readCollection<Order>(FILE);
  return orders.find((o) => o.id === id) ?? null;
}

export function listOrders() {
  return readCollection<Order>(FILE);
}

/** Customer submits their UPI transaction reference (UTR). */
export async function submitPaymentReference(id: string, utr: string) {
  const ref = utr.trim().replace(/\s+/g, "").slice(0, 40);
  if (!/^[A-Za-z0-9]{6,40}$/.test(ref)) {
    return { ok: false as const, error: "Please enter the 12-digit UTR / transaction ID from your UPI app." };
  }
  return updateCollection<Order, { ok: true; order: Order } | { ok: false; error: string }>(FILE, (items) => {
    const order = items.find((o) => o.id === id);
    if (!order) return { items, result: { ok: false, error: "Order not found." } };
    if (order.status !== "pending_payment" && order.status !== "payment_submitted") {
      return { items, result: { ok: false, error: "This order is already being processed." } };
    }
    const now = new Date().toISOString();
    order.payment = { method: "upi", utr: ref, submittedAt: now };
    order.status = "payment_submitted";
    order.updatedAt = now;
    return { items, result: { ok: true, order } };
  });
}

export async function updateOrder(id: string, patch: { status?: OrderStatus; adminNote?: string }) {
  return updateCollection<Order, boolean>(FILE, (items) => {
    const order = items.find((o) => o.id === id);
    if (!order) return { items, result: false };
    if (patch.status && ORDER_STATUSES.includes(patch.status)) order.status = patch.status;
    if (typeof patch.adminNote === "string") order.adminNote = patch.adminNote.slice(0, 1000);
    order.updatedAt = new Date().toISOString();
    return { items, result: true };
  });
}
