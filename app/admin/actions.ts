"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminConfigured,
  createSession,
  destroySession,
  passwordMatches,
  requireAdmin,
} from "@/lib/server/auth";
import { deleteMessage, setMessageRead } from "@/lib/server/contacts";
import { ORDER_STATUSES, updateOrder, type OrderStatus } from "@/lib/server/orders";

/* Every action authorises itself — never trust the page that rendered the form. */

const str = (v: FormDataEntryValue | null, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");
const isStatus = (v: string): v is OrderStatus => (ORDER_STATUSES as readonly string[]).includes(v);
const ORDER_ID = /^[a-f0-9]{24}$/;
const MESSAGE_ID = /^[a-f0-9]{16}$/;

function refreshAdmin(orderId?: string) {
  revalidatePath("/admin", "layout");
  if (orderId) revalidatePath(`/order/${orderId}`);
}

/* ---------------- Auth ---------------- */

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  // Fixed delay on every attempt slows down password guessing.
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!adminConfigured()) {
    return { error: "Admin access is not configured — set ADMIN_PASSWORD on the server." };
  }
  const password = str(formData.get("password"), 500);
  if (!password || !passwordMatches(password)) {
    return { error: "That password isn’t right. Please try again." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------- Orders ---------------- */

export type OrderEditState = { ok?: boolean; message?: string };

/** Status + internal note form on the order detail page. */
export async function saveOrder(_prev: OrderEditState, formData: FormData): Promise<OrderEditState> {
  await requireAdmin();
  const id = str(formData.get("id"), 40);
  const status = str(formData.get("status"), 40);
  const note = str(formData.get("adminNote"), 1000).trim();
  if (!ORDER_ID.test(id)) return { ok: false, message: "Unknown order." };
  if (!isStatus(status)) return { ok: false, message: "Please choose a valid status." };

  const updated = await updateOrder(id, { status, adminNote: note });
  if (!updated) return { ok: false, message: "Order not found — it may have been removed." };
  refreshAdmin(id);
  return { ok: true, message: "Saved." };
}

/** One-click status buttons (payment verified, shipped, cancel …). */
export async function setOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"), 40);
  const status = str(formData.get("status"), 40);
  if (!ORDER_ID.test(id) || !isStatus(status)) return;
  await updateOrder(id, { status });
  refreshAdmin(id);
}

/* ---------------- Messages ---------------- */

export async function toggleMessageRead(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"), 40);
  if (!MESSAGE_ID.test(id)) return;
  await setMessageRead(id, str(formData.get("read"), 5) === "true");
  refreshAdmin();
}

export async function removeMessage(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"), 40);
  if (!MESSAGE_ID.test(id)) return;
  await deleteMessage(id);
  refreshAdmin();
}
