import Image from "next/image";
import { WhatsAppGlyph } from "@/components/checkout/whatsapp-glyph";
import type { WhatsAppOrderSummary } from "@/lib/whatsapp";
import { whatsappLink, orderWhatsappText } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import { CopyButton } from "./copy-button";
import { UtrForm } from "./utr-form";

export type PaymentInfo = {
  /** Dynamic UPI QR (SVG markup) when UPI_ID is configured. */
  qrSvg: string | null;
  /** Public path of a static QR image, used when there is no dynamic QR. */
  staticQr: string | null;
  upiId: string | null;
  /** upi://pay deep link (amount and note prefilled). */
  upiHref: string | null;
};

type PaymentPanelProps = {
  orderId: string;
  orderNumber: string;
  total: number;
  submittedUtr?: string;
  payment: PaymentInfo;
  summary: Omit<WhatsAppOrderSummary, "utr">;
};

/** Amount, UPI QR, UPI ID and the UTR form for an order awaiting payment. */
export function PaymentPanel({ orderId, orderNumber, total, submittedUtr, payment, summary }: PaymentPanelProps) {
  const { qrSvg, staticQr, upiId, upiHref } = payment;
  const hasQr = Boolean(qrSvg || staticQr);

  return (
    <section aria-labelledby="payment-heading" className="border border-ink/15 bg-ivory">
      <div className="border-b border-ink/10 px-5 py-6 sm:px-8 sm:py-7">
        <p className="eyebrow text-maroon">{submittedUtr ? "Verifying your payment" : "Complete your payment"}</p>
        <h2 id="payment-heading" className="mt-4 text-[1.75rem] leading-tight sm:text-[2.125rem]">
          Pay <span className="tabular-nums">{formatPrice(total)}</span> by UPI
        </h2>
        <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-stone">
          {submittedUtr
            ? "Your reference is with us. If you haven’t paid yet, you can still use the details below."
            : "Use any UPI app: Google Pay, PhonePe, Paytm, BHIM or your bank’s app. Your pieces are reserved while we wait."}
        </p>
      </div>

      <div className="grid gap-8 px-5 py-7 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10 sm:px-8 sm:py-8">
        {/* QR */}
        {hasQr ? (
          <figure className="mx-auto w-full max-w-[15rem] sm:mx-0 sm:w-56">
            <div className="aspect-square w-full bg-white p-4 shadow-[0_1px_0_rgba(26,26,26,0.06),0_18px_40px_-24px_rgba(26,26,26,0.35)] ring-1 ring-ink/10">
              {qrSvg ? (
                <div
                  role="img"
                  aria-label={`UPI QR code to pay ${formatPrice(total)} to KalaDori for order ${orderNumber}`}
                  className="h-full w-full [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : staticQr ? (
                <div className="relative h-full w-full">
                  <Image
                    src={staticQr}
                    alt="KalaDori UPI payment QR code"
                    fill
                    sizes="(min-width: 640px) 224px, 240px"
                    className="object-contain"
                  />
                </div>
              ) : null}
            </div>
            <figcaption className="mt-3 text-center text-[12.5px] text-stone">Scan with any UPI app</figcaption>
          </figure>
        ) : (
          <div className="bg-sand/60 px-5 py-6 sm:w-60">
            <p className="font-display text-[1.375rem] leading-snug">Our payment QR will be shared on WhatsApp.</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-stone">
              Send us your order and we&rsquo;ll reply with the QR and payment details.
            </p>
            <a
              href={whatsappLink(orderWhatsappText(summary))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-5 w-full border border-maroon bg-maroon px-5! text-ivory hover:border-maroon-deep hover:bg-maroon-deep"
            >
              <WhatsAppGlyph size={16} />
              Get the QR
            </a>
          </div>
        )}

        {/* Details */}
        <div className="min-w-0">
          <dl className="divide-y divide-ink/10 border-y border-ink/10 text-[14px]">
            <div className="flex items-center justify-between gap-4 py-3.5">
              <dt className="eyebrow text-stone">Amount</dt>
              <dd className="font-display text-2xl tabular-nums">{formatPrice(total)}</dd>
            </div>
            {upiId ? (
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
                <dt className="eyebrow w-full text-stone min-[420px]:w-auto">UPI ID</dt>
                <dd className="flex min-w-0 flex-1 items-center justify-end gap-3 max-[419px]:justify-between">
                  <span className="min-w-0 break-all text-[15px]">{upiId}</span>
                  <CopyButton value={upiId} label="UPI ID" />
                </dd>
              </div>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
              <dt className="eyebrow w-full text-stone min-[420px]:w-auto">Payment note</dt>
              <dd className="flex min-w-0 flex-1 items-center justify-end gap-3 max-[419px]:justify-between">
                <span className="text-[15px] tracking-wide">{orderNumber}</span>
                <CopyButton value={orderNumber} label="order number" />
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-[13px] leading-relaxed text-stone">
            Please add your order number <span className="text-ink">{orderNumber}</span> as the payment note or
            remark, so we can match your payment quickly.
          </p>

          {upiHref ? (
            <div className="mt-6 md:hidden">
              <a href={upiHref} className="btn btn-ink w-full">
                Pay with a UPI app
              </a>
              <p className="mt-3 text-[12.5px] leading-relaxed text-stone">
                Opens your UPI app with the amount and note filled in. On this phone, you can also save the QR as a
                screenshot and upload it in your app&rsquo;s scanner.
              </p>
            </div>
          ) : hasQr ? (
            <p className="mt-6 text-[12.5px] leading-relaxed text-stone md:hidden">
              Paying from this phone? Save the QR as a screenshot, then upload it in your UPI app&rsquo;s scanner.
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-ink/10 px-5 py-7 sm:px-8 sm:py-8">
        <UtrForm orderId={orderId} submittedUtr={submittedUtr} summary={summary} />
      </div>
    </section>
  );
}
