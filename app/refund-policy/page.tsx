import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { legalMetadata, mailHref, telHref, whatsappHref } from "@/components/legal/policy-data";
import { Facts, List, Note, Sub, TextLink } from "@/components/legal/prose";
import { policies, site } from "@/lib/site";

const path = "/refund-policy";

export const metadata = legalMetadata({
  title: "Returns, Exchanges & Refunds",
  description: `Return or exchange unworn KalaDori pieces with tags within ${policies.returnDays} days of delivery. Refunds to your original UPI account within 5–7 working days of inspection. Cancel free of charge before dispatch.`,
  path,
});

const sections: LegalSection[] = [
  {
    id: "eligibility",
    title: "What you can return or exchange",
    body: (
      <>
        <p>
          You may return or exchange a piece within <strong>{policies.returnDays} days of delivery</strong>, provided
          that it is:
        </p>
        <List
          items={[
            "unworn, unwashed and unaltered, and free of perfume, make-up or other marks;",
            "returned with all its original tags attached and in its original packaging; and",
            "for sarees, returned with the blouse piece uncut and without a fall or pico added.",
          ]}
        />
        <p>
          We inspect every return when it reaches us. Pieces that do not meet these conditions cannot be accepted and
          will be sent back to you.
        </p>
      </>
    ),
  },
  {
    id: "exclusions",
    title: "What cannot be returned",
    body: (
      <>
        <p>The following are final sale and cannot be returned or exchanged, unless they arrive damaged or incorrect:</p>
        <List
          items={[
            "pieces bought on sale or at a discount;",
            "stitched-to-measure pieces and custom blouse stitching, including blouse pieces that have been cut for stitching;",
            "intimate fittings, for reasons of hygiene; and",
            "any piece that has been worn, washed, altered or damaged after delivery, or has had its tags removed.",
          ]}
        />
      </>
    ),
  },
  {
    id: "handwoven-character",
    title: "Handwoven character and colour",
    body: (
      <p>
        Every KalaDori piece is woven by hand, so small irregularities in the weave, slight variations in colour and
        motif placement, and the occasional slub are part of its character. They are a feature of the handloom, not a
        defect. Colours may also look slightly different on your screen than in daylight. These are not treated as faults,
        but if a piece is simply not what you hoped for, you are welcome to return it within {policies.returnDays} days
        under the conditions above.
      </p>
    ),
  },
  {
    id: "how-to-return",
    title: "How to request a return or exchange",
    body: (
      <>
        <List
          ordered
          items={[
            <>
              Message us on <TextLink href={whatsappHref}>WhatsApp</TextLink> at {site.phone} within{" "}
              {policies.returnDays} days of delivery, with your order number, the piece you would like to return, and
              whether you would prefer a refund or an exchange.
            </>,
            "We confirm that the piece is eligible and send you the return address and instructions. Where reverse pickup is available at your PIN code, we will arrange it; otherwise we will ask you to send the parcel with a trackable courier.",
            "Pack the piece securely with its tags and original packaging, and include a note with your order number.",
            "When the parcel reaches us, we inspect it and let you know the outcome on WhatsApp.",
          ]}
        />
        <p>
          Please do not send a return without contacting us first, as we may not be able to match it to your order.
          Original shipping charges are not refundable for change-of-mind returns.
        </p>
      </>
    ),
  },
  {
    id: "exchanges",
    title: "Exchanges",
    body: (
      <p>
        You can exchange a piece for a different size or colour, subject to availability. As our pieces are made in small
        batches, the size or colour you want may not always be in stock; if it is not, we will offer you a refund
        instead. We dispatch the replacement once the original has reached us and passed inspection. If the new piece
        costs more, we will share the difference to pay by UPI before dispatch; if it costs less, we refund the
        difference to your original UPI account.
      </p>
    ),
  },
  {
    id: "damaged-or-incorrect",
    title: "Damaged, defective or incorrect pieces",
    body: (
      <>
        <p>
          We check every piece before it leaves us, but if something arrives damaged, has a manufacturing defect, or is
          not what you ordered, please tell us on WhatsApp <strong>within 48 hours of delivery</strong>, with
          photographs and, if you have one, your unboxing video.
        </p>
        <p>
          We will collect the piece at our cost and send you a replacement or, if you prefer or a replacement is not
          available, refund you in full, including any shipping you paid. This applies to sale and final-sale pieces
          too.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    body: (
      <>
        <Facts
          items={[
            { term: "Where it goes", detail: "Back to the original UPI account the payment came from" },
            {
              term: "When",
              detail: "Within 5–7 working days of receiving and inspecting your return",
            },
            {
              term: "How much",
              detail: "The price paid for the returned pieces, plus shipping where the return is due to our error",
            },
          ]}
        />
        <p>
          We will send you the UPI reference for your refund on WhatsApp. Banks occasionally take a little longer to show
          a credit; if you cannot see it after a couple of days, share the reference with your bank or with us and we
          will help. If the original account can no longer receive payments, we may refund to another UPI account in
          your name once we have verified it with you.
        </p>
        <Note>
          We will never ask for your UPI PIN or an OTP to send you a refund. A refund does not require you to approve a
          payment request.
        </Note>
      </>
    ),
  },
  {
    id: "cancellations",
    title: "Cancellations",
    body: (
      <>
        <Sub>Before dispatch</Sub>
        <p>
          You may cancel any order before it is dispatched by messaging us on WhatsApp with your order number. If you
          have already paid, we refund the full amount to your original UPI account within 5–7 working days.
        </p>
        <Sub>After dispatch</Sub>
        <p>
          Once an order has been dispatched it can no longer be cancelled. You can return eligible pieces after delivery
          under this policy.
        </p>
        <Sub>Unpaid orders</Sub>
        <p>
          If we have not received payment within 48 hours of an order being placed, it is cancelled automatically and the
          pieces are released. If we ever have to cancel a paid order ourselves, for example because a piece is
          unavailable, we refund you in full. See our <TextLink href="/terms#cancellations">Terms &amp; Conditions</TextLink>{" "}
          for details.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Need help with a return?",
    body: (
      <>
        <p>Contact us with your order number and we will take it from there:</p>
        <List
          items={[
            <>
              <TextLink href={whatsappHref}>WhatsApp us</TextLink> or call{" "}
              <TextLink href={telHref}>{site.phone}</TextLink>
            </>,
            <>
              Email <TextLink href={mailHref}>{site.email}</TextLink>
            </>,
            <>Hours: {site.hours}</>,
          ]}
        />
      </>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPage
      path={path}
      eyebrow="Client care · Returns"
      title={
        <>
          Returns, Exchanges <span className="whitespace-nowrap">&amp; Refunds</span>
        </>
      }
      intro="We want every piece to be one you keep for years. If something is not right, here is how returns, exchanges, refunds and cancellations work."
      summary={[
        `Return or exchange within ${policies.returnDays} days of delivery, provided the piece is unworn, unwashed and has its tags attached.`,
        "Sale pieces, stitched-to-measure pieces and custom blouse stitching, and intimate fittings are final sale.",
        "Refunds go back to your original UPI account within 5–7 working days of our receiving and inspecting the return.",
        "You can cancel free of charge at any time before dispatch, with a full refund if you have paid.",
        "If a piece arrives damaged or incorrect, tell us within 48 hours of delivery and we will make it right.",
      ]}
      sections={sections}
    />
  );
}
