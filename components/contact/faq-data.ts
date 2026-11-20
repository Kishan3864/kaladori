import { policies, site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

export type FaqItem = {
  /** Stable slug, used for element ids (`#faq-<id>` on /contact). */
  id: string;
  question: string;
  /** Plain-text paragraphs (also used for FAQPage structured data). */
  answer: string[];
  /** Optional follow-on links shown under the answer (not part of structured data). */
  links?: { label: string; href: string }[];
};

const freeShipping = formatPrice(site.freeShippingThreshold);
const hours = site.hours.replace("–", " to ");

/** Client-care questions shown on /contact#faq. */
export const faqs: FaqItem[] = [
  {
    id: "ordering",
    question: "How do I place an order?",
    answer: [
      "You can order in two ways. On the website, add pieces to your bag and complete checkout; you will receive an order number and our UPI payment details straight away. Or message us on WhatsApp at " +
        `${site.phone} with the pieces and sizes you would like, and we will send you an order summary and the same payment details.`,
      "Either way, your order is confirmed once we have verified your payment, and we keep you updated on WhatsApp until it reaches you.",
    ],
    links: [
      { label: "Order on WhatsApp", href: whatsappLink() },
      { label: "Terms & Conditions", href: "/terms#orders" },
    ],
  },
  {
    id: "payment",
    question: "How do I pay, and how is my payment confirmed?",
    answer: [
      "We accept UPI only. After you place an order, scan our UPI QR code or pay to the UPI ID shown, for the exact order total, from any UPI app. Then share the UPI transaction reference (UTR) or a screenshot of the payment, on your order page or on WhatsApp.",
      `There is no payment gateway, so our team checks every payment against our bank account by hand, ${hours}, and then confirms your order on WhatsApp. We never collect card details and will never ask for your UPI PIN or an OTP. Orders that are not paid within 48 hours are cancelled automatically.`,
    ],
    links: [{ label: "Payment terms", href: "/terms#payment" }],
  },
  {
    id: "shipping",
    question: "How long does delivery take, and what does it cost?",
    answer: [
      `Orders leave us within ${policies.dispatchDays} working days of payment confirmation. Delivery then takes ${policies.deliveryMetroDays.join("–")} working days to metro cities and ${policies.deliveryElsewhereDays.join("–")} working days elsewhere in India.`,
      `Shipping is free on orders of ${freeShipping} and above; below that, a flat ${formatPrice(policies.flatShipping)} applies. We send the courier’s tracking details on WhatsApp as soon as your parcel is collected.`,
    ],
    links: [{ label: "Shipping Policy", href: "/shipping-policy" }],
  },
  {
    id: "international",
    question: "Do you ship outside India?",
    answer: [
      "Not at present; we deliver to serviceable PIN codes across India. If you live abroad and would like to send a piece to family or friends in India, simply give their address at checkout.",
    ],
  },
  {
    id: "returns",
    question: "What is your returns and exchange policy?",
    answer: [
      `You may return or exchange a piece within ${policies.returnDays} days of delivery, provided it is unworn, unwashed and has its tags attached. Message us on WhatsApp with your order number and we will share the return instructions.`,
      "Sale pieces, stitched-to-measure pieces and custom blouse stitching, and intimate fittings are final sale. Refunds are made to your original UPI account within 5–7 working days of our receiving and inspecting the return.",
    ],
    links: [{ label: "Returns & Refunds", href: "/refund-policy" }],
  },
  {
    id: "cancellations",
    question: "Can I cancel or change my order?",
    answer: [
      "Yes, at any time before it is dispatched. Message us on WhatsApp with your order number to cancel or to change a size or the delivery address. If you have already paid for a cancelled order, we refund the full amount to your original UPI account.",
    ],
    links: [{ label: "Cancellation policy", href: "/refund-policy#cancellations" }],
  },
  {
    id: "sizing",
    question: "How do I find my size?",
    answer: [
      "Kurtis are cut in sizes XS to XXL, with an easy, unfussy fit through the body. Our model is 5′8″ (173 cm) and wears a size S. Sarees are one size and come with an unstitched blouse piece.",
      "Between sizes, or unsure how a piece will fall? Send us your measurements and the piece you have in mind on WhatsApp or through the form above, and we will advise you before you order.",
    ],
  },
  {
    id: "blouse",
    question: "Can you stitch a blouse for my saree?",
    answer: [
      "Yes. Our tailors can stitch your blouse piece to your measurements, in one of our house cuts or to a design of your own, from ₹2,500. Please allow ten to twelve working days.",
      "Message us on WhatsApp, or choose “Bespoke & blouse stitching” in the form above, and we will send you a measurement guide. Stitched-to-measure pieces cannot be returned, so we confirm every detail with you first.",
    ],
  },
  {
    id: "handwoven",
    question: "Why does my piece look slightly different from the photograph?",
    answer: [
      "Every piece is woven by hand, so small irregularities in the weave, slight variations in colour and the occasional slub are the signature of a handloom, not a flaw. Colours can also look a little different on different screens.",
    ],
    links: [{ label: "Terms & Conditions", href: "/terms#products" }],
  },
  {
    id: "care",
    question: "How should I care for handwoven fabric?",
    answer: [
      "Dry clean silk and zari pieces only, and store them folded in muslin, never plastic. Refold along new lines every few months so the zari does not crease permanently.",
      "Cotton and linen can be hand-washed cold with a mild detergent, dried in the shade and pressed while slightly damp.",
    ],
  },
  {
    id: "privacy",
    question: "What do you do with my personal information?",
    answer: [
      "We use your name, contact details and address only to fulfil your order, verify your payment and keep in touch about it. We share them only with our courier partners, never sell them, and use no advertising trackers.",
    ],
    links: [{ label: "Privacy Policy", href: "/privacy-policy" }],
  },
  {
    id: "atelier",
    question: "Can I visit the atelier?",
    answer: [
      `Of course, by appointment, ${hours}. Message us on WhatsApp or choose “Styling appointment” in the form above, suggest a few times that suit you, and we will confirm.`,
    ],
  },
];
