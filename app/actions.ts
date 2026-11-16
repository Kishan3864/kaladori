"use server";

import { saveMessage } from "@/lib/server/contacts";
import { createOrder, submitPaymentReference, type OrderInput } from "@/lib/server/orders";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  order?: string;
  message: string;
  /** Honeypot — must stay empty. */
  website?: string;
};

/** Save a contact-form message. */
export async function submitContact(payload: ContactPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    if (clean(payload?.website, 200)) return { ok: true }; // bot: pretend success, store nothing
    const name = clean(payload?.name, 80);
    const email = clean(payload?.email, 120);
    const message = clean(payload?.message, 2000);
    const topic = clean(payload?.topic, 60) || "Something else";
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 5) {
      return { ok: false, error: "Please check your details and try again." };
    }
    await saveMessage({
      name,
      email,
      phone: clean(payload?.phone, 20) || undefined,
      topic,
      orderNumber: clean(payload?.order, 30) || undefined,
      message,
    });
    return { ok: true };
  } catch (error) {
    console.error("[contact] save failed", error);
    return { ok: false, error: "We couldn't send your message just now. Please try again, or write to us on WhatsApp." };
  }
}

/** Create an order from the bag. Prices are recalculated on the server. */
export async function placeOrder(input: OrderInput) {
  try {
    const result = await createOrder(input);
    if (!result.ok) return { ok: false as const, errors: result.errors };
    return { ok: true as const, id: result.order.id, number: result.order.number };
  } catch (error) {
    console.error("[order] create failed", error);
    return { ok: false as const, errors: { items: "We couldn't place your order just now. Please try again, or order on WhatsApp." } };
  }
}

/** Customer submits their UPI transaction reference (UTR) after paying. */
export async function submitPayment(orderId: string, utr: string) {
  try {
    const result = await submitPaymentReference(clean(orderId, 40), clean(utr, 60));
    return result.ok ? { ok: true as const } : { ok: false as const, error: result.error };
  } catch (error) {
    console.error("[order] payment ref failed", error);
    return { ok: false as const, error: "Something went wrong. Please send the reference on WhatsApp instead." };
  }
}
