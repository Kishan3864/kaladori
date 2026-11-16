"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { WhatsAppGlyph } from "@/components/checkout/whatsapp-glyph";
import type { Product } from "@/data/products";
import { MAX_QUANTITY, useCart } from "@/lib/cart-store";
import { policies, site } from "@/lib/site";
import { cn, formatPrice } from "@/lib/utils";
import { productEnquiryText, whatsappLink } from "@/lib/whatsapp";
import { Accordion, type AccordionItem } from "./accordion";
import { SizeGuide } from "./size-guide";
import { SizeSelector } from "./size-selector";
import { groupUnderline } from "./underline";

const EASE = [0.22, 1, 0.36, 1] as const;
/** Sticky offset that clears the header (px). */
const STICKY_TOP = 112;
const STICKY_GAP = 32;

type ProductInfoProps = {
  product: Product;
  categoryName: string;
};

/**
 * Purchase panel: title, price, colour, size selection, quantity and
 * Add to bag, followed by the product accordions. Sticky beside the gallery
 * on large screens; a compact buy bar takes over on mobile once the main
 * button has scrolled away.
 */
export function ProductInfo({ product, categoryName }: ProductInfoProps) {
  const addItem = useCart((s) => s.addItem);
  const reduceMotion = useReducedMotion();
  const single = product.sizes.length === 1;

  const [size, setSize] = useState<string | null>(single ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [barVisible, setBarVisible] = useState(false);

  // What is already in the bag for the selected size (0 until the bag has
  // rehydrated, so server and first client render agree). The bag caps each
  // line at MAX_QUANTITY, so the stepper offers only what can still be added.
  const inBag = useCart((s) =>
    s.hasHydrated && size ? (s.items.find((item) => item.id === `${product.slug}__${size}`)?.quantity ?? 0) : 0,
  );
  const available = Math.max(0, MAX_QUANTITY - inBag);
  const atLimit = size !== null && available === 0;
  const qty = Math.min(quantity, Math.max(1, available));
  const finalSale = Boolean(product.compareAtPrice);

  const panelRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const buyRowRef = useRef<HTMLDivElement>(null);

  const uid = useId();
  const sizeLabelId = `${uid}-size-label`;
  const errorId = `${uid}-size-error`;
  const limitId = `${uid}-bag-limit`;

  // "Added to bag" confirmation reverts after a moment.
  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 2400);
    return () => window.clearTimeout(timer);
  }, [added]);

  // Sticky panel: stick below the header, or — if the panel is taller than
  // the viewport — let it scroll naturally and stick by its bottom edge.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const update = () => {
      const height = panel.offsetHeight;
      const viewport = window.innerHeight;
      const top = height + STICKY_TOP + STICKY_GAP > viewport ? Math.min(STICKY_TOP, viewport - height - STICKY_GAP) : STICKY_TOP;
      panel.style.setProperty("--pdp-sticky-top", `${Math.round(top)}px`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(panel);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Mobile buy bar: visible once the main button has scrolled above the
  // viewport, hidden again when the end of the page (footer) approaches.
  useEffect(() => {
    const buyRow = buyRowRef.current;
    if (!buyRow) return;
    const end = buyRow.closest("[data-pdp]")?.querySelector("[data-pdp-end]");
    let pastButton = false;
    let atEnd = false;
    const sync = () => setBarVisible(pastButton && !atEnd);

    const buttonObserver = new IntersectionObserver(([entry]) => {
      pastButton = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      sync();
    });
    buttonObserver.observe(buyRow);

    const endObserver = new IntersectionObserver(([entry]) => {
      atEnd = entry.isIntersecting || entry.boundingClientRect.top < 0;
      sync();
    });
    if (end) endObserver.observe(end);

    return () => {
      buttonObserver.disconnect();
      endObserver.disconnect();
    };
  }, []);

  // Tell fixed page chrome (the floating WhatsApp button) that the buy bar
  // is showing, so it can lift clear of it.
  useEffect(() => {
    const root = document.documentElement;
    if (barVisible) root.setAttribute("data-buy-bar", "");
    else root.removeAttribute("data-buy-bar");
    return () => root.removeAttribute("data-buy-bar");
  }, [barVisible]);

  const focusSizes = () => {
    const group = groupRef.current;
    if (!group) return;
    const rect = group.getBoundingClientRect();
    if (rect.top < 120 || rect.bottom > window.innerHeight - 96) {
      group.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }
    group.querySelector<HTMLElement>('[role="radio"][tabindex="0"]')?.focus({ preventScroll: true });
  };

  const handleAdd = () => {
    if (!size) {
      setError(true);
      focusSizes();
      return;
    }
    setError(false);
    // Nothing can be added; the limit note beside the button already says why.
    if (available === 0) return;
    addItem(product, size, qty);
    setQuantity(1);
    setAdded(true);
  };

  const handleSizeChange = (next: string) => {
    setSize(next);
    setError(false);
  };

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const accordionItems: AccordionItem[] = [
    {
      id: "description",
      title: "Description",
      content: <p>{product.description}</p>,
    },
    {
      id: "details",
      title: "Details & fabric",
      content: (
        <>
          <DashList items={product.details} />
          <p className="mt-5">
            <span className="eyebrow mr-3 text-stone">Fabric</span>
            {product.fabric}
          </p>
        </>
      ),
    },
    {
      id: "care",
      title: "Care",
      content: (
        <>
          <DashList items={product.care} />
          <p className="mt-5 text-stone">Handcrafted textiles reward gentle care — they soften and deepen with time.</p>
        </>
      ),
    },
    {
      id: "shipping",
      title: "Shipping & returns",
      content: (
        <div className="space-y-4">
          <p>
            Orders leave the atelier within {policies.dispatchDays} working days and arrive in{" "}
            {policies.deliveryMetroDays.join("–")} working days to metro cities and{" "}
            {policies.deliveryElsewhereDays.join("–")} elsewhere in India, packed in recycled card and muslin.
            Shipping is complimentary on orders of {formatPrice(site.freeShippingThreshold)} and above; below that, a flat{" "}
            {formatPrice(policies.flatShipping)} applies.
          </p>
          {finalSale ? (
            <p>
              This is a sale piece and is final sale: it cannot be returned or exchanged. If you are unsure of the
              fit or drape, write to us before you order.
            </p>
          ) : (
            <p>
              Unworn pieces with their tags attached may be returned or exchanged within {policies.returnDays} days
              of delivery. Sarees should be returned unstitched, in their original muslin.
            </p>
          )}
          <p className="text-stone">
            Questions? Write to{" "}
            <a href={`mailto:${site.email}`} className="link-draw text-ink">
              {site.email}
            </a>
            .
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <div
        ref={panelRef}
        className="lg:sticky lg:top-[var(--pdp-sticky-top,7rem)] lg:pb-4"
      >
        {/* Eyebrow + title */}
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow text-maroon">{categoryName}</p>
          {product.isNew ? (
            <span className="eyebrow border border-line px-2 py-1 text-stone">New</span>
          ) : null}
          {product.badge && !(product.isNew && /\bnew\b/i.test(product.badge)) ? (
            <span className="eyebrow border border-line px-2 py-1 text-stone">{product.badge}</span>
          ) : null}
        </div>

        <h1 id={`title-${product.slug}`} className="text-title mt-5">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
            >
              {product.name}
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
        >
          {/* Price */}
          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-[20px] md:text-[19px] tabular-nums">
              <span className="sr-only">Price: </span>
              {formatPrice(product.price)}
            </p>
            {product.compareAtPrice ? (
              <>
                <p className="text-[14px] tabular-nums text-stone">
                  <span className="sr-only">Original price: </span>
                  <del>{formatPrice(product.compareAtPrice)}</del>
                </p>
                <p className="eyebrow text-maroon">{discount}% off</p>
              </>
            ) : null}
          </div>
          <p className="mt-1.5 text-[12.5px] md:text-[12px] text-stone">Inclusive of all taxes</p>

          {/* Summary + attributes */}
          <p className="text-lede mt-6 md:mt-7 max-w-[34rem] text-ink/85">{product.summary}</p>

          <dl className="mt-6 border-t border-line text-[15px] md:mt-7 md:text-[14px]">
            <div className="flex items-center gap-4 border-b border-line py-3.5">
              <dt className="eyebrow w-16 shrink-0 text-stone">Colour</dt>
              <dd className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-ink/15"
                  style={{ backgroundColor: product.colourHex }}
                />
                {product.colour}
              </dd>
            </div>
            <div className="flex items-baseline gap-4 border-b border-line py-3.5">
              <dt className="eyebrow w-16 shrink-0 text-stone">Fabric</dt>
              <dd>{product.fabric}</dd>
            </div>
          </dl>

          {/* Size */}
          <div className="mt-8">
            <div className="mb-3 flex min-h-11 items-center justify-between gap-4">
              <p id={sizeLabelId} className="eyebrow">
                {single ? "Size" : "Select size"}
                {size && !single ? (
                  <span aria-hidden="true" className="ml-2 text-stone">
                    — {size}
                  </span>
                ) : null}
              </p>
              {!single ? (
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setGuideOpen(true)}
                  className="eyebrow group -mr-1 inline-flex min-h-11 items-center px-1 text-stone transition-colors hover:text-ink"
                >
                  <span className={groupUnderline}>Size guide</span>
                </button>
              ) : null}
            </div>

            <SizeSelector
              sizes={product.sizes}
              value={size}
              onChange={handleSizeChange}
              labelledBy={sizeLabelId}
              errorId={errorId}
              invalid={error}
              groupRef={groupRef}
            />

            <p
              id={errorId}
              aria-live="polite"
              className={cn("text-[13px] text-maroon", single ? "mt-3 empty:hidden" : "mt-2 min-h-5")}
            >
              {error ? "Please select a size" : ""}
            </p>
            {single ? (
              <p className="text-[13px] leading-relaxed text-stone">
                One size, made to drape. Includes an unstitched blouse piece to tailor to your measurements.
              </p>
            ) : null}
          </div>

          {/* Quantity + Add to bag */}
          <div ref={buyRowRef} className="mt-5 flex gap-2">
            <QuantityStepper value={qty} max={Math.max(1, available)} onChange={setQuantity} />
            <button
              type="button"
              onClick={handleAdd}
              aria-disabled={atLimit || undefined}
              aria-describedby={atLimit ? limitId : undefined}
              className={cn(
                "btn btn-ink min-w-0 flex-1 justify-between! gap-3 px-5! sm:px-7!",
                added && "border-maroon! bg-maroon!",
                atLimit && !added && "cursor-not-allowed opacity-45 hover:border-ink! hover:bg-ink!",
              )}
            >
              <span className="relative block overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={added ? "added" : "add"}
                    className="flex items-center gap-2 whitespace-nowrap"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {added ? (
                      <>
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                          <path d="M1 5.2 4.3 8.5 11 1.5" stroke="currentColor" strokeWidth="1.3" />
                        </svg>
                        Added to bag
                      </>
                    ) : (
                      "Add to bag"
                    )}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="hidden tabular-nums tracking-[0.14em] min-[400px]:inline">{formatPrice(product.price * qty)}</span>
            </button>
          </div>
          {/* Bag status for the selected size (always rendered so changes are announced). */}
          <div aria-live="polite">
            {atLimit ? (
              <p id={limitId} className="mt-3 text-[13px] text-maroon">
                The maximum of {MAX_QUANTITY} in this size is already in your bag.
              </p>
            ) : inBag > 0 ? (
              <p className="mt-3 text-[13px] text-stone">
                {inBag} already in your bag · up to {available} more
              </p>
            ) : null}
          </div>
          <p className="sr-only" aria-live="polite">
            {added && size ? `${product.name}, ${size}, added to your bag.` : ""}
          </p>

          {/* Order on WhatsApp (size included once chosen) */}
          <a
            href={whatsappLink(productEnquiryText(product, single ? undefined : (size ?? undefined)))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline mt-3 w-full px-5!"
          >
            <WhatsAppGlyph size={16} />
            Order on WhatsApp
          </a>
          <p className="mt-2.5 text-center text-[12.5px] leading-relaxed text-stone">
            Questions on fit or fabric? We reply on WhatsApp, {site.hours.replace(" IST", "")}.
          </p>

          {/* Reassurance */}
          <ul className="mt-7 space-y-3 text-[13.5px] leading-relaxed text-stone sm:space-y-2.5 sm:text-[13px]">
            {[
              `Complimentary shipping on orders of ${formatPrice(site.freeShippingThreshold)} and above`,
              finalSale
                ? "Sale piece — final sale, not eligible for return or exchange"
                : `Returns and exchanges within ${policies.returnDays} days`,
              "Handcrafted in India — small irregularities are the mark of the hand",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-maroon" />
                {line}
              </li>
            ))}
          </ul>

          <Accordion items={accordionItems} defaultOpen={["description"]} className="mt-10" />
        </motion.div>
      </div>

      <SizeGuide
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        category={product.category}
        selectedSize={size}
      />

      {/* Mobile buy bar */}
      <AnimatePresence>
        {barVisible ? (
          <motion.div
            key="buy-bar"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory pb-[env(safe-area-inset-bottom)] lg:hidden"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="shell flex items-center gap-3 py-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] leading-snug">{product.name}</p>
                <p className="mt-0.5 text-[12.5px] tabular-nums text-stone">
                  {formatPrice(product.price)}
                  {size ? ` · ${size}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                aria-disabled={atLimit || undefined}
                className={cn(
                  "btn btn-ink shrink-0",
                  added && "border-maroon! bg-maroon!",
                  atLimit && !added && "cursor-not-allowed opacity-45 hover:border-ink! hover:bg-ink!",
                )}
              >
                {added ? "Added" : atLimit ? "In your bag" : size ? "Add to bag" : "Select size"}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function QuantityStepper({
  value,
  max = MAX_QUANTITY,
  onChange,
}: {
  value: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div role="group" aria-label="Quantity" className="flex h-[3.25rem] shrink-0 items-center border border-line">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-full w-11 items-center justify-center text-ink transition-colors hover:text-maroon disabled:cursor-not-allowed disabled:text-ink/25"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M0 5h10" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      </button>
      <span className="w-7 text-center text-[14px] tabular-nums" aria-live="polite" aria-atomic="true">
        <span className="sr-only">Quantity </span>
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-full w-11 items-center justify-center text-ink transition-colors hover:text-maroon disabled:cursor-not-allowed disabled:text-ink/25"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M0 5h10M5 0v10" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      </button>
    </div>
  );
}

function DashList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.85em] h-px w-3 shrink-0 bg-ink/35" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
