import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { Product } from "@/lib/catalog";

export type CartItem = {
  /** Unique line id: `${slug}__${size}` */
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  colour: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  /** True once localStorage has been read on the client. */
  hasHydrated: boolean;
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

export const MAX_QUANTITY = 10;

/** In-memory fallback so the bag still works (for the visit) when storage is unavailable. */
const memory = new Map<string, string>();
const memoryStorage: StateStorage = {
  getItem: (name) => memory.get(name) ?? null,
  setItem: (name, value) => {
    memory.set(name, value);
  },
  removeItem: (name) => {
    memory.delete(name);
  },
};

/**
 * localStorage when it is usable, otherwise memory. Reading
 * `window.localStorage` throws when site data is blocked or inside sandboxed
 * frames, and zustand would then skip `persist` entirely, which crashes
 * `useCart.persist.rehydrate()`. This factory never throws.
 */
function safeStorage(): StateStorage {
  try {
    const storage = window.localStorage;
    const probe = "__kaladori_probe__";
    storage.setItem(probe, probe);
    storage.removeItem(probe);
    return storage;
  } catch {
    return memoryStorage;
  }
}

/**
 * Rebuild persisted lines: drops malformed entries, clamps quantities and
 * folds duplicate lines together. Name, price and image are the snapshot
 * taken when the piece was added; checkout re-prices everything on the
 * server from the live catalogue, so a stale snapshot can never be charged.
 */
function reviveItems(raw: unknown[]): CartItem[] {
  const lines = new Map<string, CartItem>();
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const { slug, size, quantity, name, price, image, colour } = entry as Partial<Record<keyof CartItem, unknown>>;
    if (typeof slug !== "string" || typeof size !== "string") continue;
    if (typeof name !== "string" || typeof price !== "number" || !Number.isFinite(price)) continue;
    if (typeof image !== "string") continue;
    const id = `${slug}__${size}`;
    const count = typeof quantity === "number" && Number.isFinite(quantity) ? Math.floor(quantity) : 1;
    const total = Math.min(MAX_QUANTITY, Math.max(1, count) + (lines.get(id)?.quantity ?? 0));
    lines.set(id, {
      id,
      slug,
      size,
      name,
      price,
      image,
      colour: typeof colour === "string" ? colour : "",
      quantity: total,
    });
  }
  return [...lines.values()];
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      addItem: (product, size, quantity = 1) =>
        set((state) => {
          const id = `${product.slug}__${size}`;
          const existing = state.items.find((item) => item.id === id);
          const items = existing
            ? state.items.map((item) =>
                item.id === id
                  ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + quantity) }
                  : item,
              )
            : [
                ...state.items,
                {
                  id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.images[0],
                  size,
                  colour: product.colour,
                  quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity)),
                },
              ];
          return { items, isOpen: true };
        }),

      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id ? { ...item, quantity: Math.min(MAX_QUANTITY, quantity) } : item,
                ),
        })),

      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "kaladori-cart",
      version: 1,
      storage: createJSONStorage(safeStorage),
      // Only the line items are persisted; drawer state is per-visit.
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => {
        const raw = (persisted as { items?: unknown } | null | undefined)?.items;
        // Nothing usable stored: keep whatever is in memory.
        return { ...current, items: Array.isArray(raw) ? reviveItems(raw) : current.items };
      },
      // Rehydrate manually after mount (see components/providers.tsx) so the first
      // client render matches the server-rendered HTML.
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useCart.setState({ hasHydrated: true });
      },
    },
  ),
);

export const selectCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectSubtotal = (state: CartState) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);
