import { policies, site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export type FaqItem = {
  /** Stable slug, used for element ids. */
  id: string;
  question: string;
  /** Plain-text paragraphs (also used for FAQPage structured data). */
  answer: string[];
};

const freeShipping = formatPrice(site.freeShippingThreshold);

/** Client-care questions shown on /contact#faq. Sample policy copy. */
export const faqs: FaqItem[] = [
  {
    id: "shipping",
    question: "How long does delivery take, and what does it cost?",
    answer: [
      `Ready-to-ship pieces leave the atelier within ${policies.dispatchDays} working days. Delivery then takes ${policies.deliveryMetroDays.join("–")} working days to metro cities and ${policies.deliveryElsewhereDays.join("–")} elsewhere in India.`,
      `Shipping within India is complimentary on orders over ${freeShipping}; below that, a flat ${formatPrice(policies.flatShipping)} applies. A tracking link follows as soon as your parcel is collected.`,
    ],
  },
  {
    id: "international",
    question: "Do you ship internationally?",
    answer: [
      "Yes — to most countries, by express courier, usually within five to nine working days of dispatch. Shipping is calculated at checkout by weight and destination.",
      "Import duties and taxes are set by the destination country and are payable on delivery unless stated otherwise at checkout.",
    ],
  },
  {
    id: "returns",
    question: "What is your returns and exchange policy?",
    answer: [
      `You may return or exchange any full-price piece within ${policies.returnDays} days of delivery, provided it is unworn, unwashed and has its tags attached. Write to us with your order number and we will arrange a complimentary pickup within India.`,
      "Sale pieces and anything stitched to measure — including saree blouses — are final sale. Refunds are made to the original payment method within seven working days of the parcel reaching us.",
    ],
  },
  {
    id: "sizing",
    question: "How do I find my size?",
    answer: [
      "Kurtis and pants are cut in sizes XS to XXL, with an easy, unfussy fit through the body. Our model is 5′8″ (173 cm) and wears a size S. Sarees are one size and come with an unstitched blouse piece.",
      "Between sizes, or unsure how a piece will fall? Write to us with your measurements and the piece you have in mind, or book a styling appointment by video or at the atelier.",
    ],
  },
  {
    id: "blouse",
    question: "Can you stitch a blouse for my saree?",
    answer: [
      "Yes. Our tailors can stitch your blouse piece to your measurements, in one of our house cuts or to a design of your own, from ₹2,500. Please allow ten to twelve working days.",
      "Choose “Bespoke & blouse stitching” in the form above and we will send you a measurement guide. Stitched-to-measure pieces cannot be returned, so we confirm every detail with you first.",
    ],
  },
  {
    id: "care",
    question: "How should I care for handwoven fabric?",
    answer: [
      "Dry clean silk and zari pieces only, and store them folded in muslin, never plastic. Refold along new lines every few months so the zari does not crease permanently.",
      "Cotton and linen can be hand-washed cold with a mild detergent, dried in the shade and pressed while slightly damp. Small irregularities in the weave are the signature of a handloom, not a flaw.",
    ],
  },
  {
    id: "atelier",
    question: "Can I visit the atelier?",
    answer: [
      "Of course — by appointment, Monday to Saturday, 10am to 7pm IST. Choose “Styling appointment” in the form above and suggest a few times that suit you; we will confirm by email.",
    ],
  },
];
