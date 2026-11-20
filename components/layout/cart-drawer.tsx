"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { bagWhatsappText } from "@/components/checkout/bag-whatsapp";
import { WhatsAppGlyph } from "@/components/checkout/whatsapp-glyph";
import { MAX_QUANTITY, selectCount, selectSubtotal, useCart, type CartItem } from "@/lib/cart-store";
import { useEscapeKey, useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import { site } from "@/lib/site";
import { cn, formatPrice } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

const EASE = [0.76, 0, 0.24, 1] as const;

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const closeCart = useCart((s) => s.closeCart);

  useLockBodyScroll(isOpen);
  useEscapeKey(isOpen, closeCart);

  // The panel only mounts while the bag is open, so it always reflects the
  // current bag when the drawer opens.
  return (
    <AnimatePresence>{isOpen ? <CartPanel key="cart" closeCart={closeCart} /> : null}</AnimatePresence>
  );
}

function CartPanel({ closeCart }: { closeCart: () => void }) {
  const items = useCart((s) => s.items);
  const count = useCart(selectCount);
  const subtotal = useCart(selectSubtotal);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus moves to Close on open, Tab stays inside the bag, and focus returns
  // to whatever opened it (the Bag button, Add to bag) once it closes.
  useFocusTrap(panelRef, closeRef);

  const remaining = Math.max(0, site.freeShippingThreshold - subtotal);
  const progress = Math.min(1, subtotal / site.freeShippingThreshold);

  return (
    <div className="fixed inset-0 z-[60]">
      <motion.div
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={closeCart}
        aria-hidden="true"
      />
      <motion.aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-ivory outline-none shadow-[-24px_0_60px_-30px_rgba(26,26,26,0.35)] sm:max-w-[460px]"
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5 sm:px-8">
          <h2 id="cart-title" className="font-display text-2xl">
            Your bag <span className="font-sans text-sm tracking-normal text-stone">({count})</span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="eyebrow -mr-2 flex h-11 items-center gap-2 px-2"
          >
            Close
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyBag onClose={closeCart} />
        ) : (
          <>
            {/* Where they are, and what to do next */}
            <div className="border-b border-line bg-sand/50 px-6 py-4 sm:px-8">
              <ol className="flex items-center gap-1.5 text-[11.5px]" aria-label="How to order">
                {["In your bag", "Send on WhatsApp", "Pay by UPI"].map((label, i) => (
                  <li key={label} className="flex min-w-0 flex-1 items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className={
                        i === 0
                          ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[10px] text-ivory"
                          : i === 1
                            ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0e7a6d] text-[10px] text-white ring-4 ring-[#0e7a6d]/15"
                            : "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink/25 text-[10px] text-stone"
                      }
                    >
                      {i === 0 ? "✓" : i + 1}
                    </span>
                    <span className={i === 1 ? "leading-tight font-medium text-ink" : "leading-tight text-stone"}>
                      {label}
                      {i === 1 ? <span className="sr-only"> (next step)</span> : null}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-[13px] text-ink/80">
                Next: tap <strong className="font-medium text-ink">Send order on WhatsApp</strong> below. Your message is
                ready with every detail, just press send. We confirm, then you pay by UPI.
              </p>
            </div>

            {/* Free shipping progress */}
            <div className="border-b border-line px-6 py-5 sm:px-8">
              <p className="text-[13px] text-stone">
                {remaining > 0 ? (
                  <>
                    You are <span className="text-ink">{formatPrice(remaining)}</span> away from
                    complimentary shipping.
                  </>
                ) : (
                  <>Your order ships complimentary.</>
                )}
              </p>
              <div className="mt-3 h-px w-full bg-line">
                <motion.div
                  className="h-px origin-left bg-maroon"
                  initial={false}
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* Line items */}
            {/* layoutScroll: lets the lines' layout animations account for this list's scroll offset. */}
            <motion.ul layoutScroll className="flex-1 overflow-y-auto px-6 sm:px-8">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <CartLine key={item.id} item={item} onNavigate={closeCart} />
                ))}
              </AnimatePresence>
            </motion.ul>

            {/* Summary */}
            <div className="border-t border-line px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-8 sm:pb-8">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">Subtotal</span>
                <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-[13px] text-stone">
                {remaining > 0
                  ? "Taxes included. Shipping calculated at checkout."
                  : "Taxes included · Complimentary shipping."}
              </p>
              <a
                href={whatsappLink(bagWhatsappText(items))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp next-step-pulse-wa mt-6 w-full"
              >
                <WhatsAppGlyph size={16} />
                Send order on WhatsApp
              </a>
              <p className="mt-2.5 text-center text-[12.5px] text-stone">
                Recommended: fastest, and every order is confirmed personally.
              </p>
              <Link href="/checkout" onClick={closeCart} className="btn btn-outline mt-3 w-full">
                Or check out on the website
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="eyebrow group mx-auto mt-3 flex min-h-11 w-fit items-center px-2 text-stone"
              >
                <span className="link-draw py-1">Continue shopping</span>
              </button>
            </div>
          </>
        )}
      </motion.aside>
    </div>
  );
}

function CartLine({ item, onNavigate }: { item: CartItem; onNavigate: () => void }) {
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-5 border-b border-line py-6 last:border-b-0"
    >
      <Link
        href={`/product/${item.slug}`}
        onClick={onNavigate}
        className="relative block aspect-[3/4] w-24 shrink-0 overflow-hidden bg-sand"
      >
        <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/product/${item.slug}`} onClick={onNavigate} className="link-draw text-[15px] leading-snug">
              {item.name}
            </Link>
            <p className="mt-1 text-[13px] text-stone">
              {item.colour} · {item.size}
            </p>
          </div>
          <p className="shrink-0 text-[15px]">{formatPrice(item.price * item.quantity)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center border border-line" role="group" aria-label={`Quantity for ${item.name}`}>
            <QtyButton
              label="Decrease quantity"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M0 5h10" stroke="currentColor" strokeWidth="1.1" />
              </svg>
            </QtyButton>
            <span className="w-7 text-center text-[13px] tabular-nums" aria-live="polite" aria-atomic="true">
              <span className="sr-only">Quantity </span>
              {item.quantity}
            </span>
            <QtyButton
              label="Increase quantity"
              disabled={item.quantity >= MAX_QUANTITY}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M0 5h10M5 0v10" stroke="currentColor" strokeWidth="1.1" />
              </svg>
            </QtyButton>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name}, ${item.size}`}
            className="eyebrow -mr-2 inline-flex min-h-11 items-center px-2 text-[10px] text-stone transition-colors duration-300 hover:text-maroon"
          >
            <span className="link-draw py-0.5">Remove</span>
          </button>
        </div>
      </div>
    </motion.li>
  );
}

function QtyButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-maroon",
        disabled && "cursor-not-allowed text-ink/25 hover:text-ink/25",
      )}
    >
      {children}
    </button>
  );
}

function EmptyBag({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <p className="eyebrow text-maroon">Your bag is empty</p>
      <p className="mt-5 max-w-[16ch] font-display text-4xl leading-[1.05]">Begin with something woven.</p>
      <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
        <Link href="/shop" onClick={onClose} className="btn btn-ink">
          Explore the collection
        </Link>
        <Link href="/shop?category=sarees" onClick={onClose} className="btn btn-outline">
          Shop sarees
        </Link>
      </div>
    </div>
  );
}
