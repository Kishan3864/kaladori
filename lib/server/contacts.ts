/** Contact-form messages. SERVER ONLY. */
import { randomBytes } from "node:crypto";
import { readCollection, updateCollection } from "@/lib/server/store";

const FILE = "messages.json";

export type ContactMessage = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  topic: string;
  orderNumber?: string;
  message: string;
  read: boolean;
};

export type ContactInput = Omit<ContactMessage, "id" | "createdAt" | "read">;

export async function saveMessage(input: ContactInput) {
  const message: ContactMessage = {
    ...input,
    id: randomBytes(8).toString("hex"),
    createdAt: new Date().toISOString(),
    read: false,
  };
  await updateCollection<ContactMessage, null>(FILE, (items) => ({ items: [message, ...items].slice(0, 5000), result: null }));
  return message;
}

export function listMessages() {
  return readCollection<ContactMessage>(FILE);
}

export function setMessageRead(id: string, read: boolean) {
  return updateCollection<ContactMessage, boolean>(FILE, (items) => {
    const m = items.find((x) => x.id === id);
    if (m) m.read = read;
    return { items, result: Boolean(m) };
  });
}

export function deleteMessage(id: string) {
  return updateCollection<ContactMessage, boolean>(FILE, (items) => {
    const next = items.filter((x) => x.id !== id);
    return { items: next, result: next.length !== items.length };
  });
}
