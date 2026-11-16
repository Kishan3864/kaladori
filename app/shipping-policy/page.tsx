import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { legalMetadata, mailHref, telHref, whatsappHref } from "@/components/legal/policy-data";
import { Facts, List, Note, TextLink } from "@/components/legal/prose";
import { policies, site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

const path = "/shipping-policy";

const freeShipping = formatPrice(site.freeShippingThreshold);
const flatShipping = formatPrice(policies.flatShipping);
const metro = policies.deliveryMetroDays.join("–");
const elsewhere = policies.deliveryElsewhereDays.join("–");

export const metadata = legalMetadata({
  title: "Shipping Policy",
  description: `KalaDori Textile ships across India. Orders leave within ${policies.dispatchDays} working days of payment confirmation and arrive in ${metro} working days in metro cities. Free shipping on orders of ${freeShipping} and above.`,
  path,
});

const sections: LegalSection[] = [
  {
    id: "where-we-ship",
    title: "Where we ship",
    body: (
      <>
        <p>
          We ship to all serviceable PIN codes in India through trusted courier partners. Parcels to remote areas,
          including parts of the North-East, Jammu &amp; Kashmir, Ladakh, the Andaman &amp; Nicobar Islands and
          Lakshadweep, may take longer than the times below.
        </p>
        <p>
          At present we do not ship outside India. If you live abroad and would like a piece delivered to family or
          friends in India, we are happy to arrange it. Simply give their address at checkout.
        </p>
      </>
    ),
  },
  {
    id: "dispatch",
    title: "Order processing and dispatch",
    body: (
      <>
        <p>
          Your order is dispatched within <strong>{policies.dispatchDays} working days of payment confirmation</strong>.
          Because we verify every UPI payment by hand, the clock starts once your payment has been checked and your order
          confirmed, not when the order is placed. Working days are Monday to Saturday, excluding public holidays.
        </p>
        <p>
          We verify payments during business hours ({site.hours}). A payment made in the evening or on a Sunday is
          verified on the next working day. Share your UTR or payment screenshot promptly, on your order page or on
          WhatsApp, so that we can confirm your order quickly.
        </p>
        <p>
          Before it leaves us, every piece is inspected, pressed, folded and wrapped. Orders that include blouse
          stitching or other made-to-measure work take longer; we will confirm a dispatch date with you when you order.
          During festive seasons dispatch may take a day or two longer, and we will tell you if it does.
        </p>
      </>
    ),
  },
  {
    id: "delivery-times",
    title: "Delivery timelines",
    body: (
      <>
        <p>Once dispatched, parcels usually arrive within:</p>
        <Facts
          items={[
            {
              term: "Metro cities",
              detail: (
                <>
                  {metro} working days
                  <span className="block text-[14px] text-stone">
                    Delhi NCR, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad, Pune and Ahmedabad
                  </span>
                </>
              ),
            },
            { term: "Rest of India", detail: `${elsewhere} working days` },
            { term: "Remote areas", detail: "May take a few days longer, depending on the courier’s network" },
          ]}
        />
        <p>
          These are estimates from our courier partners rather than guarantees. If anything changes after dispatch, we
          will keep you informed.
        </p>
      </>
    ),
  },
  {
    id: "charges",
    title: "Shipping charges",
    body: (
      <>
        <Facts
          items={[
            { term: `Orders of ${freeShipping} and above`, detail: "Free shipping anywhere in India" },
            { term: `Orders below ${freeShipping}`, detail: `A flat ${flatShipping} per order` },
          ]}
        />
        <p>
          Shipping is shown in your bag, at checkout and in the order summary we send on WhatsApp, so you always see the
          full amount before you pay. All orders are prepaid by UPI; we do not offer cash on delivery.
        </p>
      </>
    ),
  },
  {
    id: "tracking",
    title: "Tracking your order",
    body: (
      <p>
        As soon as your parcel is handed to the courier, we send you the courier’s name and a tracking number or link on
        WhatsApp, and by email if you gave us one. The courier may call you before delivery, so please keep the phone
        number on your order reachable.
      </p>
    ),
  },
  {
    id: "receiving",
    title: "Receiving your parcel",
    body: (
      <>
        <p>
          Please check that the outer packaging is intact when your parcel arrives. If it looks damaged or tampered
          with, note this with the courier or decline the delivery, and take photographs.
        </p>
        <p>
          We recommend recording a short video as you open the parcel. If a piece arrives damaged, or is not what you
          ordered, tell us on WhatsApp within 48 hours of delivery with photographs or the video, and we will put it
          right as described in our <TextLink href="/refund-policy">Returns &amp; Refunds Policy</TextLink>.
        </p>
        <p>
          If a parcel comes back to us because the address was incomplete, the phone number was unreachable or the
          delivery was refused, we will contact you to arrange a fresh dispatch. A further shipping charge of{" "}
          {flatShipping} may apply. If you would rather cancel at that point, we refund the order value less the
          shipping costs already incurred.
        </p>
      </>
    ),
  },
  {
    id: "delays",
    title: "Delays and lost parcels",
    body: (
      <>
        <p>
          Occasionally parcels are held up by weather, strikes, local restrictions or courier backlogs, all of which are
          beyond our control. We will follow up with the courier on your behalf and keep you updated.
        </p>
        <p>
          If your parcel has not arrived within 10 working days of dispatch, message us and we will open an
          investigation with the courier. If it is confirmed lost in transit, we will send a replacement or, if the piece
          is no longer available, refund you in full to your original UPI account.
        </p>
      </>
    ),
  },
  {
    id: "address-changes",
    title: "Changing your delivery address",
    body: (
      <>
        <p>
          You can change your delivery address at any time before dispatch by messaging us on WhatsApp with your order
          number. After dispatch, we will ask the courier to redirect the parcel where possible, but we cannot guarantee
          it.
        </p>
        <Note>Please double-check your PIN code, landmark and phone number at checkout. It is the simplest way to avoid delays.</Note>
      </>
    ),
  },
  {
    id: "contact",
    title: "Questions about delivery",
    body: (
      <>
        <p>For anything to do with dispatch or delivery, contact us with your order number:</p>
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

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      path={path}
      eyebrow="Client care · Shipping"
      title="Shipping Policy"
      intro="Where we ship, how long it takes and what it costs, from our atelier in Gujarat to your door."
      summary={[
        "We ship to serviceable PIN codes across India.",
        `Orders leave us within ${policies.dispatchDays} working days of payment confirmation.`,
        `Delivery takes ${metro} working days to metro cities and ${elsewhere} working days elsewhere in India.`,
        `Shipping is free on orders of ${freeShipping} and above, and a flat ${flatShipping} below that.`,
        "Every parcel is tracked, and we send the tracking details on WhatsApp.",
      ]}
      sections={sections}
    />
  );
}
