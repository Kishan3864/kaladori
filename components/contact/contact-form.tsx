"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export const contactTopics = [
  "An order",
  "Styling appointment",
  "Bespoke & blouse stitching",
  "Wholesale",
  "Press",
  "Something else",
] as const;

type Field = "name" | "email" | "topic" | "order" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent";

const EMPTY: Values = { name: "", email: "", topic: "", order: "", message: "" };
const FIELD_ORDER: readonly Field[] = ["name", "email", "topic", "order", "message"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ORDER_PATTERN = /^[A-Za-z0-9-]{4,20}$/;
const MESSAGE_MIN = 20;
const MESSAGE_MAX = 2000;
/** Simulated network delay for the sample confirmation. */
const SEND_DELAY_MS = 1400;

function validate(values: Values): Errors {
  const errors: Errors = {};

  const name = values.name.trim();
  if (!name) errors.name = "Please tell us your name.";
  else if (name.length < 2) errors.name = "Please enter your full name.";

  const email = values.email.trim();
  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "That email address doesn’t look quite right.";

  if (!values.topic) errors.topic = "Please choose what your message is about.";

  const order = values.order.trim();
  if (order && !ORDER_PATTERN.test(order)) {
    errors.order = "Order numbers use letters, numbers and hyphens — for example, KD-10482.";
  }

  const message = values.message.trim();
  if (!message) errors.message = "Please write us a short message.";
  else if (message.length < MESSAGE_MIN) {
    errors.message = `A little more detail helps us reply properly — at least ${MESSAGE_MIN} characters.`;
  }

  return errors;
}

const labelClass = "eyebrow block text-stone";
const controlClass =
  "block w-full rounded-none border-0 border-b bg-transparent px-0 pb-3 pt-3 text-[17px] text-ink outline-none transition-[border-color,box-shadow] duration-500 ease-editorial placeholder:text-stone/80 focus:border-maroon focus:shadow-[0_1px_0_0_var(--color-maroon)] disabled:opacity-60";

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
 * Contact form with inline validation and a sample confirmation.
 * There is no backend yet: submitting simulates a short send and then shows
 * the thank-you panel. Nothing is transmitted anywhere.
 */
export function ContactForm() {
  const uid = useId();
  const fieldId = (field: Field) => `${uid}-${field}`;
  const errorId = (field: Field) => `${uid}-${field}-error`;
  const hintId = (field: Field) => `${uid}-${field}-hint`;

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [firstName, setFirstName] = useState("");
  /** Screen-reader status, set only on submit events so typing never triggers it. */
  const [announcement, setAnnouncement] = useState("");

  const focusNameOnReturn = useRef(false);

  const sending = status === "sending";

  // After "Send another message", return focus to the first field of the fresh form.
  useEffect(() => {
    if (status === "idle" && focusNameOnReturn.current) {
      focusNameOnReturn.current = false;
      document.getElementById(`${uid}-name`)?.focus();
    }
  }, [status, uid]);

  function focusField(field: Field) {
    document.getElementById(fieldId(field))?.focus();
  }

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
    // Once an error is showing (or after a submit attempt), let it clear as soon as the field is fixed.
    if (errors[field] || attempted) revalidate(field, next);
  }

  function handleBlur(field: Field) {
    if (values[field].trim() || attempted) revalidate(field, values);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    setAttempted(true);
    const found = validate(values);
    setErrors(found);

    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      const count = FIELD_ORDER.filter((field) => found[field]).length;
      setAnnouncement(`Please check ${count === 1 ? "one field" : `${count} fields`} before sending.`);
      focusField(firstInvalid);
      return;
    }

    setAnnouncement("Sending your message.");
    setStatus("sending");
    // Sample only: no backend is connected, so we simulate a short send.
    await new Promise((resolve) => setTimeout(resolve, SEND_DELAY_MS));
    setFirstName(values.name.trim().split(/\s+/)[0] ?? "");
    setAnnouncement("");
    setStatus("sent");
  }

  function reset() {
    focusNameOnReturn.current = true;
    setValues(EMPTY);
    setErrors({});
    setAttempted(false);
    setFirstName("");
    setAnnouncement("");
    setStatus("idle");
  }

  return (
    <div className="grid">
      {/* Polite status for screen readers while the form is visible. */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <AnimatePresence initial={false}>
        {status !== "sent" ? (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            aria-busy={sending}
            className="[grid-area:1/1]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.45, ease: EASE } }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          >
            <fieldset disabled={sending} className="min-w-0 space-y-10 md:space-y-12">
              <legend className="sr-only">Your message</legend>

              <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label htmlFor={fieldId("name")} className={labelClass}>
                    Name
                  </label>
                  <input
                    id={fieldId("name")}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={values.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    aria-required="true"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy(errors.name && errorId("name"))}
                    className={cn(controlClass, controlState(Boolean(errors.name)))}
                  />
                  <FieldError id={errorId("name")} message={errors.name} />
                </div>

                <div>
                  <label htmlFor={fieldId("email")} className={labelClass}>
                    Email
                  </label>
                  <input
                    id={fieldId("email")}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="name@example.com"
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    aria-required="true"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy(errors.email && errorId("email"))}
                    className={cn(controlClass, controlState(Boolean(errors.email)))}
                  />
                  <FieldError id={errorId("email")} message={errors.email} />
                </div>
              </div>

              <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label htmlFor={fieldId("topic")} className={labelClass}>
                    Topic
                  </label>
                  <div className="relative">
                    <select
                      id={fieldId("topic")}
                      name="topic"
                      value={values.topic}
                      onChange={(e) => handleChange("topic", e.target.value)}
                      onBlur={() => handleBlur("topic")}
                      aria-required="true"
                      aria-invalid={errors.topic ? true : undefined}
                      aria-describedby={describedBy(errors.topic && errorId("topic"))}
                      className={cn(
                        controlClass,
                        controlState(Boolean(errors.topic)),
                        "cursor-pointer appearance-none pr-8",
                        !values.topic && "text-stone",
                      )}
                    >
                      <option value="" disabled>
                        Choose a topic
                      </option>
                      {contactTopics.map((topic) => (
                        <option key={topic} value={topic} className="text-ink">
                          {topic}
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
                  <FieldError id={errorId("topic")} message={errors.topic} />
                </div>

                <div>
                  <label htmlFor={fieldId("order")} className={labelClass}>
                    Order number <span className="normal-case tracking-normal text-stone">(optional)</span>
                  </label>
                  <input
                    id={fieldId("order")}
                    name="order"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder="KD-10482"
                    value={values.order}
                    onChange={(e) => handleChange("order", e.target.value)}
                    onBlur={() => handleBlur("order")}
                    aria-invalid={errors.order ? true : undefined}
                    aria-describedby={describedBy(hintId("order"), errors.order && errorId("order"))}
                    className={cn(controlClass, controlState(Boolean(errors.order)))}
                  />
                  <p id={hintId("order")} className="mt-2.5 text-[12px] text-stone">
                    You&rsquo;ll find it in your order confirmation.
                  </p>
                  <FieldError id={errorId("order")} message={errors.order} />
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={fieldId("message")} className={labelClass}>
                    Message
                  </label>
                  <span id={hintId("message")} className="text-[12px] tabular-nums text-stone">
                    <span className="sr-only">Maximum {MESSAGE_MAX} characters. </span>
                    <span aria-hidden="true">
                      {values.message.length.toLocaleString("en-IN")} / {MESSAGE_MAX.toLocaleString("en-IN")}
                    </span>
                  </span>
                </div>
                <textarea
                  id={fieldId("message")}
                  name="message"
                  rows={6}
                  maxLength={MESSAGE_MAX}
                  placeholder="Tell us how we can help — the piece, the occasion, the date you need it by."
                  value={values.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  aria-required="true"
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={describedBy(hintId("message"), errors.message && errorId("message"))}
                  className={cn(controlClass, controlState(Boolean(errors.message)), "min-h-40 resize-y leading-relaxed")}
                />
                <FieldError id={errorId("message")} message={errors.message} />
              </div>
            </fieldset>

            <div className="mt-12 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-[13px] leading-relaxed text-stone">
                We use your details only to reply to you. All fields are required unless marked optional.
              </p>
              <button
                type="submit"
                aria-disabled={sending}
                className={cn("btn btn-ink relative w-full overflow-hidden sm:w-auto sm:min-w-[15rem]", sending && "cursor-progress")}
              >
                {sending ? (
                  <>
                    Sending
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-blush"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: SEND_DELAY_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
                    />
                  </>
                ) : (
                  <>
                    Send message <span aria-hidden="true">&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        ) : null}
      </AnimatePresence>

      <div aria-live="polite" className="self-start [grid-area:1/1]">
        <AnimatePresence>
          {status === "sent" ? <SuccessPanel key="sent" firstName={firstName} onReset={reset} /> : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SuccessPanel({ firstName, onReset }: { firstName: string; onReset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasFocused = useRef(false);

  // Move focus to the confirmation once. The guard matters because hidden
  // routes are kept alive (Activity) and effects re-run when they are shown again.
  useEffect(() => {
    if (hasFocused.current) return;
    hasFocused.current = true;
    headingRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.35 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="border-t border-maroon pt-10 md:pt-14"
    >
      <p className="eyebrow text-maroon">Message received</p>
      <h3 ref={headingRef} tabIndex={-1} className="mt-6 text-title outline-none">
        Thank you{firstName ? <>, <em className="italic">{firstName}</em></> : null}.
      </h3>
      <p className="mt-6 max-w-md text-lede text-ink/80">We&rsquo;ll reply within two working days.</p>
      <button type="button" onClick={onReset} className="btn btn-outline mt-12">
        Send another message
      </button>
    </motion.div>
  );
}
