import { GrievanceOfficer } from "@/components/legal/legal-contact";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { addressText, legalMetadata, telHref, whatsappHref } from "@/components/legal/policy-data";
import { List, Note, Sub, TextLink } from "@/components/legal/prose";
import { policies, site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

const path = "/terms";

export const metadata = legalMetadata({
  title: "Terms & Conditions",
  description:
    "The terms for buying from KalaDori Textile on our website or on WhatsApp: pricing in INR, UPI payment and manual verification, cancellations, shipping, returns and governing law.",
  path,
});

const host = site.url.replace(/^https?:\/\//, "");
const freeShipping = formatPrice(site.freeShippingThreshold);
const flatShipping = formatPrice(policies.flatShipping);

const sections: LegalSection[] = [
  {
    id: "about-these-terms",
    title: "About these terms",
    body: (
      <>
        <p>
          These terms apply to your use of {host} and to every purchase from {site.name}, whether you order through our
          website or on WhatsApp. {site.name} is a proprietorship owned by {site.owner} and based in {site.city}.
          Registered address: {addressText}.
        </p>
        <p>
          By using our website or placing an order, you agree to these terms and to our{" "}
          <TextLink href="/privacy-policy">Privacy Policy</TextLink>,{" "}
          <TextLink href="/shipping-policy">Shipping Policy</TextLink> and{" "}
          <TextLink href="/refund-policy">Returns &amp; Refunds Policy</TextLink>, which form part of these terms. If
          you do not agree, please do not place an order.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility",
    body: (
      <p>
        To place an order you must be at least 18 years old and able to enter into a binding contract under the Indian
        Contract Act, 1872. If you are under 18, a parent or guardian must place the order for you. You agree that the
        details you give us, including your name, phone number and delivery address, are accurate and your own, and
        that the delivery address is in India.
      </p>
    ),
  },
  {
    id: "products",
    title: "Our products and handwoven variation",
    body: (
      <>
        <p>
          Our sarees, kurtis and pants are made in small batches with handloom weavers and craftspeople. Because every
          piece is woven and finished by hand, no two are exactly alike. Slubs, slight variations in the density of the
          weave, small differences in colour and in the placement of motifs, and the occasional knot are the signature of
          the handloom. They are a feature of the craft, not a defect, and are not treated as a fault under our returns
          policy.
        </p>
        <p>
          We photograph our pieces in natural light and describe them as accurately as we can, but colours may look
          slightly different on different screens. Measurements given on the website are approximate and may vary within
          a small tolerance. Unless a listing says otherwise, sarees come with an unstitched blouse piece.
        </p>
        <p>
          Showing a piece on the website does not guarantee that it is available. Many pieces exist in very small
          numbers, and availability is confirmed only when we confirm your order.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    title: "Pricing",
    body: (
      <>
        <p>
          All prices are in Indian rupees (INR) and include applicable taxes, including GST, unless stated otherwise.
          Shipping is shown separately: it is free on orders of {freeShipping} and above, and a flat {flatShipping}{" "}
          below that, as set out in our <TextLink href="/shipping-policy">Shipping Policy</TextLink>.
        </p>
        <p>
          We may change prices at any time, but the price shown when you place your order is the price you pay. If a
          piece is listed at a clearly incorrect price because of an error, we will tell you before confirming the order,
          and you may either proceed at the correct price or cancel with a full refund of anything you have paid.
        </p>
      </>
    ),
  },
  {
    id: "orders",
    title: "Placing an order",
    body: (
      <>
        <p>You can order in either of two ways:</p>
        <List
          items={[
            <>
              <strong>On our website.</strong> Add pieces to your bag and complete checkout. You will receive an order
              number and a page showing our UPI QR code and UPI ID, with the exact amount to pay.
            </>,
            <>
              <strong>On WhatsApp.</strong> Message us on <TextLink href={whatsappHref}>{site.phone}</TextLink> with the
              pieces and sizes you would like. We will reply with an order summary, the total and the same UPI payment
              details.
            </>,
          ]}
        />
        <p>
          Placing an order is an offer to buy. It becomes a binding contract only when we have verified your payment and
          confirmed the order to you. We may decline an order before confirmation, for example if a piece is no longer
          available, a price was listed in error, the delivery address cannot be served, or we have reason to suspect
          fraud. If you have already paid, we will refund you in full.
        </p>
      </>
    ),
  },
  {
    id: "payment",
    title: "Payment and verification",
    body: (
      <>
        <p>
          We accept payment by UPI only. We do not use a payment gateway, we do not offer cash on delivery, and we never
          collect card details. Payment works like this:
        </p>
        <List
          ordered
          items={[
            "Scan our UPI QR code, or pay to the UPI ID shown after you place your order, for the exact order total.",
            "Share the UPI transaction reference number (UTR) or a screenshot of the completed payment, either on your order page or on WhatsApp.",
            <>
              Our team checks the payment against our bank account by hand during business hours ({site.hours}).
              Payments made outside these hours are verified on the next working day.
            </>,
            "Once the payment is verified, we confirm your order on WhatsApp or by email and prepare it for dispatch.",
          ]}
        />
        <p>
          If the amount received is different from the order total, we will contact you to settle the difference or
          refund the excess before we dispatch.
        </p>
        <Note>
          Pay only to the UPI ID shown on our website or sent from our official number, {site.phone}. We will never ask
          for your UPI PIN or an OTP, and we cannot be responsible for payments made to any other account.
        </Note>
      </>
    ),
  },
  {
    id: "cancellations",
    title: "Cancellations",
    body: (
      <>
        <Sub>Cancellation by us</Sub>
        <p>
          We hold the pieces in your order while we wait for payment. If we have not received your payment within 48
          hours of the order being placed, the order is cancelled automatically and the pieces are released for other
          customers. We may also cancel an order before dispatch if a piece turns out to be unavailable or fails our
          final quality check, if it was listed at an incorrect price, if the delivery address cannot be served, or if a
          payment reference cannot be verified. Wherever you have paid, we refund the full amount to your original UPI
          account within 5–7 working days.
        </p>
        <Sub>Cancellation by you</Sub>
        <p>
          You may cancel any order before it is dispatched by messaging us on WhatsApp with your order number. If you
          have already paid, we refund you in full. Once an order has been dispatched it can no longer be cancelled, but
          you may return eligible pieces after delivery under our{" "}
          <TextLink href="/refund-policy">Returns &amp; Refunds Policy</TextLink>.
        </p>
      </>
    ),
  },
  {
    id: "shipping",
    title: "Shipping and delivery",
    body: (
      <p>
        We ship within India. Orders are dispatched within {policies.dispatchDays} working days of payment confirmation
        and usually arrive within {policies.deliveryMetroDays.join("–")} working days in metro cities and{" "}
        {policies.deliveryElsewhereDays.join("–")} working days elsewhere. Delivery times are estimates, not guarantees.
        Ownership of and responsibility for the pieces pass to you on delivery. Full details are in our{" "}
        <TextLink href="/shipping-policy">Shipping Policy</TextLink>.
      </p>
    ),
  },
  {
    id: "returns",
    title: "Returns, exchanges and refunds",
    body: (
      <p>
        You may return or exchange unworn pieces with their tags attached within {policies.returnDays} days of delivery.
        Sale pieces, stitched-to-measure pieces and custom blouse stitching, and intimate fittings cannot be returned.
        Refunds are made to your original UPI account within 5–7 working days of our receiving and inspecting the
        return. Full details are in our <TextLink href="/refund-policy">Returns &amp; Refunds Policy</TextLink>.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <p>
        The KalaDori name and logo, our photographs, product designs, patterns, text and the design of this website are
        owned by or licensed to {site.name}. You may not copy, reproduce, sell or use them for any commercial purpose
        without our written permission. You are welcome to share links to our pages and to post photographs of pieces
        you have bought for your own, non-commercial use.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>When you use our website or contact us, you agree not to:</p>
        <List
          items={[
            "place orders in someone else’s name or with false contact or address details;",
            "submit a payment reference or screenshot that is false, altered or belongs to another transaction;",
            "copy or scrape the website or its content by automated means;",
            "attempt to gain unauthorised access to the website, its admin area or its data, or upload anything harmful; or",
            "harass, threaten or abuse our team or our craftspeople.",
          ]}
        />
        <p>
          We may cancel orders and refuse service where these terms are broken, and we may report fraudulent payment
          claims to the appropriate authorities.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <>
        <p>
          To the fullest extent permitted by law, our total liability for any claim arising from an order is limited to
          the amount you paid for that order. We are not liable for indirect or consequential loss, or for delays or
          failures caused by events beyond our reasonable control, such as courier disruption, extreme weather, natural
          disasters, strikes, or government action.
        </p>
        <p>
          Nothing in these terms limits any right you have as a consumer under the Consumer Protection Act, 2019 or any
          other law that cannot be excluded by agreement.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    body: (
      <p>
        These terms are governed by the laws of India. If something goes wrong, please contact us first. Most problems
        can be resolved quickly and fairly by talking to us. Subject to your rights to approach a consumer commission
        under consumer protection law, the courts of Gujarat have exclusive jurisdiction over any dispute arising from
        these terms or your orders.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The date at the top of this page shows when they were last revised.
        The terms in force when you place an order apply to that order.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact and grievances",
    body: (
      <>
        <p>
          For questions about an order, call or WhatsApp us on <TextLink href={telHref}>{site.phone}</TextLink>. For
          complaints, the Grievance Officer under the Consumer Protection (E-Commerce) Rules, 2020 is:
        </p>
        <GrievanceOfficer />
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      path={path}
      eyebrow="Client care · Terms"
      title="Terms & Conditions"
      intro="The terms that apply when you browse our website and buy from KalaDori Textile, whether you order online or on WhatsApp. Please read them before you place an order."
      summary={[
        "Placing an order is an offer to buy. It becomes a contract once we have verified your UPI payment and confirmed the order.",
        "Prices are in Indian rupees and include applicable taxes. Shipping is shown separately.",
        "If payment is not received within 48 hours of an order being placed, the order is cancelled and the pieces are released.",
        "Handwoven cloth carries small irregularities by nature. These are part of the craft, not defects.",
        "These terms are governed by Indian law, and the courts of Gujarat have jurisdiction.",
      ]}
      sections={sections}
    />
  );
}
