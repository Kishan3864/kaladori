"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { placeOrder } from "@/app/actions";
import { selectCount, selectSubtotal, useCart, type CartItem } from "@/lib/cart-store";
import { site } from "@/lib/site";
import { cn, formatPrice } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { bagWhatsappText, shippingFor } from "./bag-whatsapp";
import { INDIAN_STATES } from "./indian-states";
import { WhatsAppGlyph } from "./whatsapp-glyph";

const EASE = [0.22, 1, 0.36, 1] as const;

type Field = "name" | "phone" | "email" | "address" | "city" | "state" | "pincode" | "notes";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field | "items", string>>;

const EMPTY: Values = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "", notes: "" };
const FIELD_ORDER: readonly Field[] = ["name", "phone", "email", "address", "city", "state", "pincode", "notes"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NOTES_MAX = 500;

/** Mirrors validateCustomer() on the server, so most mistakes are caught before submitting. */
function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your full name.";
  const digits = values.phone.replace(/\D/g, "");
  if (!digits) errors.phone = "Please enter your mobile number.";
  else if (digits.length < 10 || digits.length > 13) errors.phone = "Please enter a valid 10-digit mobile number.";
  const email = values.email.trim();
  if (email && !EMAIL_PATTERN.test(email)) errors.email = "That email address doesn’t look quite right.";
  if (values.address.trim().length < 8) errors.address = "Please enter your full delivery address.";
  if (values.city.trim().length < 2) errors.city = "Please enter your city.";
  if (!values.state) errors.state = "Please choose your state.";
  if (!/^\d{6}$/.test(values.pincode.trim())) errors.pincode = "Please enter a 6-digit PIN code.";
  if (values.notes.length > NOTES_MAX) errors.notes = `Please keep notes under ${NOTES_MAX} characters.`;
  return errors;
}

const labelClass = "eyebrow block text-stone";
const controlClass =
  "block w-full rounded-none border-0 border-b bg-transparent px-0 pb-3 pt-3 text-[17px] text-ink outline-none transition-[border-color,box-shadow] duration-500 ease-editorial placeholder:text-stone/70 focus:border-maroon focus:shadow-[0_1px_0_0_var(--color-maroon)] disabled:opacity-60";

function controlState(hasError: boolean) {
  return hasError ? "border-maroon" : "border-ink/20 hover:border-ink/45";
}

function describedBy(...ids: Array<string | false | undefined>) {
  const value = ids.filter(Boolean).join(" ");
  return value || undefined;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          key="error"
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-2.5 text-[13px] leading-snug text-maroon"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Checkout: order summary from the bag, delivery details and the payment
 * explainer. Placing the order saves it on the server (prices are recalculated
 * there) and moves to /order/[id], where the UPI QR is shown.
 */
export function CheckoutForm() {
  const hasHydrated = useCart((s) => s.hasHydrated);
  const items = useCart((s) => s.items);
  const [placedId, setPlacedId] = useState<string | null>(null);

  if (!hasHydrated) return <CheckoutSkeleton />;
  // Placed: the bag has just been cleared and we are on the way to the order page.
  if (placedId && items.length === 0) return <PlacedNotice id={placedId} />;
  if (items.length === 0) return <EmptyCheckout />;
  return <CheckoutBody items={items} onPlaced={setPlacedId} />;
}

function CheckoutBody({ items, onPlaced }: { items: CartItem[]; onPlaced: (id: string) => void }) {
  const router = useRouter();
  const clear = useCart((s) => s.clear);
  const subtotal = useCart(selectSubtotal);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const uid = useId();
  const fieldId = (field: Field) => `${uid}-${field}`;
  const errorId = (field: Field | "items") => `${uid}-${field}-error`;
  const hintId = (field: Field) => `${uid}-${field}-hint`;

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const whatsappHref = whatsappLink(bagWhatsappText(items));

  function revalidate(field: Field, next: Values) {
    const message = validate(next)[field];
    setErrors((current) => {
      if (current[field] === message) return current;
      const updated = { ...current };
      if (message) updated[field] = message;
      else delete updated[field];
      return updated;
    });
  }

  function handleChange(field: Field, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field] || attempted) revalidate(field, next);
  }

  function handleBlur(field: Field) {
    if (values[field].trim() || attempted) revalidate(field, values);
  }

  function focusFirst(found: Errors) {
    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) document.getElementById(fieldId(first))?.focus();
    return first;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setAttempted(true);
    const found = validate(values);
    setErrors(found);
    if (focusFirst(found)) {
      const count = FIELD_ORDER.filter((field) => found[field]).length;
      setAnnouncement(`Please check ${count === 1 ? "one field" : `${count} fields`} before placing your order.`);
      return;
    }

    setSubmitting(true);
    setAnnouncement("Placing your order.");
    const result = await placeOrder({
      items: items.map((item) => ({ slug: item.slug, size: item.size, quantity: item.quantity })),
      customer: {
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        address: values.address,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        notes: values.notes || undefined,
      },
    });

    if (!result.ok) {
      setSubmitting(false);
      const serverErrors: Errors = { ...result.errors };
      setErrors(serverErrors);
      const first = focusFirst(serverErrors);
      setAnnouncement(
        serverErrors.items && !first ? serverErrors.items : "Please check the highlighted details and try again.",
      );
      return;
    }

    setAnnouncement(`Order ${result.number} placed. Taking you to payment.`);
    onPlaced(result.id);
    clear();
    router.push(`/order/${result.id}`);
  }

  const inputProps = (field: Field, extraDescribedBy?: string) => ({
    id: fieldId(field),
    name: field,
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      handleChange(field, e.target.value),
    onBlur: () => handleBlur(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": describedBy(extraDescribedBy, errors[field] && errorId(field)),
    className: cn(controlClass, controlState(Boolean(errors[field]))),
  });

  return (
    <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-16">
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      {/* Summary: first on mobile (collapsible), a sticky sidebar on large screens. */}
      <aside
        aria-labelledby={`${uid}-summary`}
        className="lg:col-span-5 lg:col-start-8 lg:row-start-1 xl:col-span-4 xl:col-start-9"
      >
        <OrderSummary
          headingId={`${uid}-summary`}
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
        />
      </aside>

      <form
        noValidate
        onSubmit={handleSubmit}
        aria-busy={submitting}
        className="lg:col-span-7 lg:row-start-1"
      >
        <fieldset disabled={submitting} className="min-w-0">
          <legend className="sr-only">Delivery details</legend>

          <Section index="01" title="Your details">
            <div className="grid gap-9 sm:grid-cols-2 sm:gap-x-8">
              <div>
                <label htmlFor={fieldId("name")} className={labelClass}>
                  Full name
                </label>
                <input
                  {...inputProps("name")}
                  type="text"
                  autoComplete="name"
                  autoCapitalize="words"
                  placeholder="As it should appear on the parcel"
                  aria-required="true"
                />
                <FieldError id={errorId("name")} message={errors.name} />
              </div>
              <div>
                <label htmlFor={fieldId("phone")} className={labelClass}>
                  Mobile / WhatsApp
                </label>
                <input
                  {...inputProps("phone", hintId("phone"))}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="98765 43210"
                  aria-required="true"
                />
                <p id={hintId("phone")} className="mt-2.5 text-[12.5px] leading-snug text-stone">
                  We confirm your order and share tracking on this number.
                </p>
                <FieldError id={errorId("phone")} message={errors.phone} />
              </div>
            </div>
            <div className="mt-9">
              <label htmlFor={fieldId("email")} className={labelClass}>
                Email <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <input
                {...inputProps("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="name@example.com"
              />
              <FieldError id={errorId("email")} message={errors.email} />
            </div>
          </Section>

          <Section index="02" title="Delivery address">
            <div>
              <label htmlFor={fieldId("address")} className={labelClass}>
                Address
              </label>
              <textarea
                {...inputProps("address")}
                rows={2}
                autoComplete="street-address"
                placeholder="House / flat, building, street, area, landmark"
                aria-required="true"
                className={cn(inputProps("address").className, "min-h-[5.5rem] resize-y leading-relaxed")}
              />
              <FieldError id={errorId("address")} message={errors.address} />
            </div>
            <div className="mt-9 grid gap-9 sm:grid-cols-2 sm:gap-x-8">
              <div>
                <label htmlFor={fieldId("city")} className={labelClass}>
                  City
                </label>
                <input
                  {...inputProps("city")}
                  type="text"
                  autoComplete="address-level2"
                  autoCapitalize="words"
                  placeholder="City or town"
                  aria-required="true"
                />
                <FieldError id={errorId("city")} message={errors.city} />
              </div>
              <div>
                <label htmlFor={fieldId("pincode")} className={labelClass}>
                  PIN code
                </label>
                <input
                  {...inputProps("pincode")}
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  pattern="[0-9]*"
                  placeholder="380001"
                  aria-required="true"
                  onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
                <FieldError id={errorId("pincode")} message={errors.pincode} />
              </div>
            </div>
            <div className="mt-9">
              <label htmlFor={fieldId("state")} className={labelClass}>
                State
              </label>
              <div className="relative">
                <select
                  {...inputProps("state")}
                  autoComplete="address-level1"
                  aria-required="true"
                  className={cn(
                    inputProps("state").className,
                    "cursor-pointer appearance-none pr-8",
                    !values.state && "text-stone",
                  )}
                >
                  <option value="" disabled>
                    Choose your state
                  </option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state} className="text-ink">
                      {state}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 8"
                  className="pointer-events-none absolute right-1 top-1/2 h-2 w-3 -translate-y-1/2 text-ink"
                  fill="none"
                >
                  <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <FieldError id={errorId("state")} message={errors.state} />
            </div>
            <div className="mt-9">
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={fieldId("notes")} className={labelClass}>
                  Order notes <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <span id={hintId("notes")} className="text-[12px] tabular-nums text-stone">
                  <span className="sr-only">Maximum {NOTES_MAX} characters. </span>
                  <span aria-hidden="true">
                    {values.notes.length} / {NOTES_MAX}
                  </span>
                </span>
              </div>
              <textarea
                {...inputProps("notes", hintId("notes"))}
                rows={3}
                maxLength={NOTES_MAX}
                placeholder="A date you need it by, a gift message, delivery instructions"
                className={cn(inputProps("notes").className, "min-h-24 resize-y leading-relaxed")}
              />
              <FieldError id={errorId("notes")} message={errors.notes} />
            </div>
          </Section>

          <Section index="03" title="Payment">
            <PaymentExplainer />
          </Section>
        </fieldset>

        {/* Totals beside the button (the summary may be collapsed on mobile). */}
        <div className="mt-10 border-t border-ink pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <span className="eyebrow">Total to pay</span>
            <span className="font-display text-3xl tabular-nums">{formatPrice(total)}</span>
          </div>
          <p className="mt-1.5 text-[13px] text-stone">
            {shipping > 0 ? `Includes ${formatPrice(shipping)} shipping. ` : "Complimentary shipping. "}
            Taxes included.
          </p>
        </div>

        <AnimatePresence initial={false}>
          {errors.items ? (
            <motion.p
              key="items-error"
              id={errorId("items")}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 border-l-2 border-maroon bg-blush/10 px-4 py-3 text-[14px] leading-snug text-maroon"
            >
              {errors.items}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <button
          type="submit"
          aria-disabled={submitting || undefined}
          aria-describedby={errors.items ? errorId("items") : undefined}
          className={cn("btn btn-ink relative mt-7 w-full overflow-hidden", submitting && "cursor-progress")}
        >
          {submitting ? (
            <>
              Placing your order
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-blush"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
              />
            </>
          ) : (
            <>
              Place order <span aria-hidden="true">&middot;</span>{" "}
              <span className="tabular-nums tracking-[0.14em]">{formatPrice(total)}</span>
            </>
          )}
        </button>
        <p className="mt-4 text-center text-[12.5px] leading-relaxed text-stone">
          No payment is taken on this page. You&rsquo;ll see the UPI QR next.
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px]">Prefer to order on WhatsApp?</p>
            <p className="mt-1 text-[13px] text-stone">We&rsquo;ll send your bag to {site.owner} and the team.</p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline w-full shrink-0 sm:w-auto"
          >
            <WhatsAppGlyph size={16} />
            Order on WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pb-12 pt-8 first-of-type:border-t-0 first-of-type:pt-0 md:pb-14">
      <h2 className="flex items-baseline gap-4 text-[1.625rem] leading-tight md:text-3xl">
        <span className="eyebrow text-maroon">{index}</span>
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function PaymentExplainer() {
  const steps = [
    { title: "Place your order", body: "We reserve your pieces and give you an order number." },
    {
      title: "Pay by UPI",
      body: "Scan the QR on the next page with Google Pay, PhonePe, Paytm or any UPI app.",
    },
    {
      title: "Share the reference",
      body: "Send the UTR or a screenshot on WhatsApp. We verify and confirm within a few working hours.",
    },
  ];
  return (
    <div className="bg-sand/60 px-5 py-6 sm:px-7 sm:py-7">
      <p className="eyebrow text-ink">How payment works</p>
      <ol className="mt-6 space-y-5">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-maroon/40 font-display text-[15px] text-maroon"
            >
              {i + 1}
            </span>
            <div className="pt-1">
              <p className="text-[15px] leading-snug">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-stone">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 border-t border-ink/10 pt-5 text-[13px] leading-relaxed text-stone">
        Every payment is checked by hand by {site.owner}, our founder. Questions at any point: WhatsApp{" "}
        <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="link-draw whitespace-nowrap text-ink">
          {site.phone}
        </a>
        , {site.hours}.
      </p>
    </div>
  );
}

function OrderSummary({
  headingId,
  items,
  subtotal,
  shipping,
  total,
}: {
  headingId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}) {
  const count = useCart(selectCount);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const remaining = Math.max(0, site.freeShippingThreshold - subtotal);

  return (
    <div className="border border-line bg-ivory lg:sticky lg:top-[calc(var(--header-offset)+2rem)] lg:transition-[top] lg:duration-500">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <h2 id={headingId} className="text-2xl">
          Your order <span className="font-sans text-sm tracking-normal text-stone">({count})</span>
        </h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          className="eyebrow -mr-2 inline-flex min-h-11 items-center gap-2 px-2 text-stone lg:hidden"
        >
          {open ? "Hide" : "Show"}
          <svg
            aria-hidden="true"
            viewBox="0 0 12 8"
            className={cn("h-2 w-3 transition-transform duration-500", open && "rotate-180")}
            fill="none"
          >
            <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>

      <ul id={listId} className={cn("px-5 sm:px-6 lg:block", open ? "block" : "hidden")}>
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 border-b border-line py-5 last:border-b-0">
            <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-sand">
              <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] tabular-nums text-ivory">
                <span className="sr-only">Quantity </span>
                {item.quantity}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] leading-snug">{item.name}</p>
                <p className="mt-1 text-[13px] text-stone">
                  {item.colour} · {item.size}
                  {item.quantity > 1 ? ` · ${item.quantity} × ${formatPrice(item.price)}` : ""}
                </p>
              </div>
              <p className="shrink-0 text-[15px] tabular-nums">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="space-y-3 border-t border-line px-5 py-5 text-[14px] sm:px-6">
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Shipping</dt>
          <dd className="tabular-nums">
            {shipping > 0 ? formatPrice(shipping) : "Complimentary"}
            {remaining > 0 ? (
              <span className="mt-1 block text-right text-[12.5px] leading-snug text-stone">
                Complimentary over {formatPrice(site.freeShippingThreshold)}
              </span>
            ) : null}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
          <dt className="eyebrow">Total</dt>
          <dd className="font-display text-2xl tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>

      <div className="border-t border-line px-5 py-4 sm:px-6">
        <Link href="/shop" className="eyebrow group inline-flex min-h-11 items-center text-stone hover:text-ink">
          <span className="link-draw py-1">Continue shopping</span>
        </Link>
      </div>
    </div>
  );
}

function EmptyCheckout() {
  return (
    <div className="mx-auto max-w-xl py-10 text-center md:py-16">
      <p className="eyebrow text-maroon">Your bag is empty</p>
      <p className="mt-6 font-display text-4xl leading-[1.05] md:text-5xl">Nothing to check out, yet.</p>
      <p className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-stone">
        Add a piece or two to your bag and come back here to place your order.
      </p>
      <div className="mx-auto mt-10 flex w-full max-w-xs flex-col gap-3">
        <Link href="/shop" className="btn btn-ink">
          Explore the collection
        </Link>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          <WhatsAppGlyph size={16} />
          Ask us on WhatsApp
        </a>
      </div>
    </div>
  );
}

function PlacedNotice({ id }: { id: string }) {
  return (
    <div className="mx-auto max-w-xl py-10 text-center md:py-16" role="status">
      <p className="eyebrow text-maroon">Order placed</p>
      <p className="mt-6 font-display text-4xl leading-[1.05] md:text-5xl">Taking you to payment.</p>
      <Link href={`/order/${id}`} className="btn btn-ink mx-auto mt-10 w-full max-w-xs">
        View your order
      </Link>
    </div>
  );
}

function Block({ className }: { className?: string }) {
  return <div className={cn("bg-sand motion-safe:animate-pulse", className)} />;
}

/** Shown until the bag has been read from storage. */
export function CheckoutSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-16" role="status" aria-busy="true">
      <span className="sr-only">Loading your bag</span>
      <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 xl:col-span-4 xl:col-start-9">
        <Block className="h-16 w-full lg:h-96" />
      </div>
      <div className="space-y-10 lg:col-span-7 lg:row-start-1">
        <Block className="h-8 w-48" />
        <div className="grid gap-9 sm:grid-cols-2 sm:gap-x-8">
          <Block className="h-12" />
          <Block className="h-12" />
        </div>
        <Block className="h-12" />
        <Block className="h-8 w-56" />
        <Block className="h-20" />
      </div>
    </div>
  );
}
