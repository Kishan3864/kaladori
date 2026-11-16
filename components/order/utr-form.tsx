"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { submitPayment } from "@/app/actions";
import { WhatsAppGlyph } from "@/components/checkout/whatsapp-glyph";
import { cn } from "@/lib/utils";
import { orderWhatsappText, whatsappLink, type WhatsAppOrderSummary } from "@/lib/whatsapp";

const EASE = [0.22, 1, 0.36, 1] as const;
const UTR_PATTERN = /^[A-Za-z0-9]{6,40}$/;

type UtrFormProps = {
  orderId: string;
  /** Reference already on the order (status: payment_submitted). */
  submittedUtr?: string;
  /** Everything the WhatsApp message needs except the UTR. */
  summary: Omit<WhatsAppOrderSummary, "utr">;
};

/**
 * After paying, the customer enters the UPI transaction reference (UTR). It is
 * saved on the order, the owner verifies it against the bank statement, and
 * the page refreshes to show the new status.
 */
export function UtrForm({ orderId, submittedUtr, summary }: UtrFormProps) {
  const router = useRouter();
  const uid = useId();
  const inputId = `${uid}-utr`;
  const hintId = `${uid}-utr-hint`;
  const errorId = `${uid}-utr-error`;

  const [utr, setUtr] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  /** The reference just saved here (survives the refresh below). */
  const [saved, setSaved] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const headingRef = useRef<HTMLParagraphElement>(null);

  const confirmedUtr = saved ?? submittedUtr ?? null;
  const showForm = !confirmedUtr || editing;

  useEffect(() => {
    if (saved && !editing) headingRef.current?.focus();
  }, [saved, editing]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const ref = utr.replace(/\s+/g, "");
    if (!UTR_PATTERN.test(ref)) {
      setError("Please enter the 12-digit UTR / transaction ID from your UPI app.");
      document.getElementById(inputId)?.focus();
      return;
    }
    setError("");
    setSending(true);
    const result = await submitPayment(orderId, ref);
    setSending(false);
    if (!result.ok) {
      setError(result.error);
      document.getElementById(inputId)?.focus();
      return;
    }
    setSaved(ref);
    setEditing(false);
    setUtr("");
    router.refresh();
  }

  const whatsappHref = whatsappLink(orderWhatsappText({ ...summary, utr: confirmedUtr ?? undefined }));

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {showForm ? (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            aria-busy={sending}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <label htmlFor={inputId} className="eyebrow block text-stone">
              {confirmedUtr ? "Update payment reference" : "Paid? Enter your UTR"}
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
              <input
                id={inputId}
                name="utr"
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={40}
                placeholder="e.g. 412345678901"
                value={utr}
                disabled={sending}
                onChange={(e) => {
                  setUtr(e.target.value);
                  if (error) setError("");
                }}
                aria-required="true"
                aria-invalid={error ? true : undefined}
                aria-describedby={cn(hintId, error && errorId)}
                className={cn(
                  "block w-full min-w-0 flex-1 rounded-none border-0 border-b bg-transparent px-0 pb-3 pt-3 text-[17px] tracking-wide text-ink outline-none transition-[border-color,box-shadow] duration-500 ease-editorial placeholder:text-stone/70 focus:border-maroon focus:shadow-[0_1px_0_0_var(--color-maroon)] disabled:opacity-60",
                  error ? "border-maroon" : "border-ink/25 hover:border-ink/45",
                )}
              />
              <button
                type="submit"
                aria-disabled={sending || undefined}
                className={cn("btn btn-ink w-full shrink-0 sm:w-auto", sending && "cursor-progress")}
              >
                {sending ? "Sending" : "Submit reference"}
              </button>
            </div>
            <p id={hintId} className="mt-3 text-[12.5px] leading-relaxed text-stone">
              The 12-digit UTR (also called UPI reference or transaction ID) is shown in your UPI app once the payment
              succeeds. A screenshot on WhatsApp works just as well.
            </p>
            {error ? (
              <p id={errorId} className="mt-2 text-[13px] leading-snug text-maroon">
                {error}
              </p>
            ) : null}
            {confirmedUtr ? (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="eyebrow mt-2 inline-flex min-h-11 items-center text-stone hover:text-ink"
              >
                <span className="link-draw py-1">Cancel</span>
              </button>
            ) : null}
          </motion.form>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="border-l-2 border-maroon bg-sand/60 px-5 py-5"
          >
            <p ref={headingRef} tabIndex={-1} className="font-display text-[1.375rem] leading-snug outline-none">
              Thank you &mdash; we&rsquo;re verifying your payment.
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink/75">
              Reference <span className="font-medium tracking-wide text-ink">{confirmedUtr}</span> is saved with your
              order. We match it with our bank statement and confirm on WhatsApp within a few working hours.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-maroon bg-maroon text-ivory hover:border-maroon-deep hover:bg-maroon-deep"
              >
                <WhatsAppGlyph size={16} />
                Send reference on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setUtr(confirmedUtr ?? "");
                }}
                className="eyebrow inline-flex min-h-11 items-center px-1 text-stone hover:text-ink"
              >
                <span className="link-draw py-1">Entered it wrongly? Update</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
