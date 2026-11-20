import { GrievanceOfficer } from "@/components/legal/legal-contact";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { addressText, legalMetadata, mailHref, whatsappHref } from "@/components/legal/policy-data";
import { List, Note, Sub, TextLink } from "@/components/legal/prose";
import { site } from "@/lib/site";

const path = "/privacy-policy";

export const metadata = legalMetadata({
  title: "Privacy Policy",
  description:
    "How KalaDori Textile collects, uses, stores and protects your personal information when you order on our website or on WhatsApp, and your rights under India’s DPDP Act, 2023.",
  path,
});

const host = site.url.replace(/^https?:\/\//, "");

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          {site.name} is a handloom label based in {site.city}, making handwoven sarees, kurtis and scarves. The business is
          owned and run by its founder and proprietor, {site.owner}. In this policy, “KalaDori”, “we”, “us” and “our”
          refer to {site.name}.
        </p>
        <p>
          This policy explains how we handle your personal information when you visit {host}, place an order through
          our website or on WhatsApp, or contact us by phone, email or the contact form. For the purposes of the Digital
          Personal Data Protection Act, 2023, we are the data fiduciary responsible for that information.
        </p>
        <p>
          <strong>Registered address:</strong> {addressText}.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>We collect only what we need to take, make, deliver and support your order.</p>
        <Sub>Information you give us</Sub>
        <List
          items={[
            <>
              <strong>Contact details</strong>: your name, phone number and email address.
            </>,
            <>
              <strong>Delivery details</strong>: your address, city, state and PIN code, and any delivery instructions
              you add.
            </>,
            <>
              <strong>Order details</strong>: the pieces, sizes and quantities you choose, prices, order notes, and
              measurements if you ask us to stitch a blouse.
            </>,
            <>
              <strong>Payment reference</strong>: the UPI transaction reference number (UTR) you enter on your order
              page or send us, and any payment screenshot you share. A screenshot may show the amount, date and time,
              and the name or UPI ID of the paying account.
            </>,
            <>
              <strong>Messages</strong>: what you write to us through the contact form, on WhatsApp, by email or over
              the phone.
            </>,
          ]}
        />
        <Sub>Information we never collect</Sub>
        <p>
          We do not use a payment gateway, so we never ask for, see or store your debit or credit card number, CVV,
          net-banking password, UPI PIN or one-time passwords. You complete every payment inside your own UPI app.
        </p>
        <Note>
          We will never ask for your UPI PIN or an OTP, on WhatsApp or anywhere else. If anyone does so in our name,
          please do not share it, and tell us on {site.phone}.
        </Note>
        <Sub>Information collected automatically</Sub>
        <p>
          Like most websites, our hosting provider records standard technical information when pages are requested,
          such as IP address, browser type, the page visited and the time of the visit. We use it only to keep the
          website secure and working. We do not use advertising pixels, retargeting tags or any tracker that builds a
          profile of you for marketing.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and browser storage",
    body: (
      <>
        <p>
          <strong>Your bag.</strong> The pieces you add to your bag are saved in your own browser’s local storage, on
          your device, so they are still there when you come back. That information is not sent to us until you place
          an order. You can clear it at any time by emptying your bag or clearing your browser’s site data.
        </p>
        <p>
          <strong>Cookies.</strong> We use a single essential cookie, and only to keep members of our own team signed
          in to the store’s admin area. Shoppers are not given cookies for analytics, advertising or tracking.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    body: (
      <>
        <p>We use your personal information only to:</p>
        <List
          items={[
            "process your order, check availability, and pack and dispatch your pieces;",
            "verify your UPI payment, by matching the reference you share against the payments received in our bank account;",
            "talk to you about your order, including confirmations, payment and dispatch updates, tracking details and replies to your questions, by WhatsApp, phone or email;",
            "arrange returns, exchanges, cancellations and refunds to your original UPI account;",
            "keep accurate accounts and meet our obligations under Indian tax, consumer protection and other applicable law; and",
            "protect our customers and our business against fraud and misuse of the website.",
          ]}
        />
        <p>
          We process this information because you have given your consent by placing an order or contacting us, and
          because it is necessary to complete the purchase you asked for and to comply with the law. We do not send
          marketing messages unless you have asked us to, and you can ask us to stop at any time.
        </p>
      </>
    ),
  },
  {
    id: "whatsapp-and-upi",
    title: "WhatsApp and UPI",
    body: (
      <>
        <p>
          Many of our customers order and share payment references on WhatsApp. Messages you send us there are also
          handled by WhatsApp under its own terms and privacy policy. We use our WhatsApp line only to talk to you about
          your enquiries and orders, and we do not add you to broadcast lists or groups without your agreement.
        </p>
        <p>
          UPI payments are processed by your bank, your UPI app and the National Payments Corporation of India under
          their own terms. We receive only what any payee receives: the amount, the transaction reference, and the name
          or UPI ID attached to the payment.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>We never sell, rent or trade your personal information. We share it only where we must:</p>
        <List
          items={[
            <>
              <strong>Courier partners</strong> receive your name, phone number, delivery address and parcel details,
              so they can deliver your order or collect a return.
            </>,
            <>
              <strong>Authorities</strong> receive information when we are required to provide it by law, by a court or
              government order, or to prevent fraud or protect the rights of our customers and our business.
            </>,
          ]}
        />
        <p>
          Our website and order records are stored with hosting providers that process data on our behalf, under
          confidentiality obligations, and may not use it for any purpose of their own.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <p>
          We keep order and payment records, including the details on your invoice, for as long as we need them to
          fulfil your order, handle any return or refund, and meet the record-keeping periods required by Indian tax and
          accounting law.
        </p>
        <p>
          Messages that are not linked to an order are kept for as long as we need them to answer you, and are then
          deleted in our periodic clean-ups. Your bag stays in your browser until you clear it. When information is no
          longer needed, we delete it or remove anything that identifies you.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <>
        <p>
          Our website is served over an encrypted (HTTPS) connection. Access to order records is limited to the small
          team that handles orders, through a password-protected admin area. Because we never collect card or banking
          credentials, the most sensitive payment information never reaches us at all.
        </p>
        <p>
          No system is perfectly secure. If a personal data breach ever affects your information, we will inform you
          and the Data Protection Board of India as the law requires, and tell you what we are doing about it.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>
          Under the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000, you have the
          right to:
        </p>
        <List
          items={[
            "ask for a summary of the personal information we hold about you and how we use it;",
            "have inaccurate or incomplete information corrected and updated;",
            "have your information erased once it is no longer needed, subject to the records we are legally required to keep;",
            "withdraw your consent at any time, which does not affect anything done before you withdraw it but may mean we cannot complete an order that is still open;",
            "nominate another person to exercise these rights on your behalf in the event of death or incapacity; and",
            "have any grievance about the handling of your information addressed by our Grievance Officer.",
          ]}
        />
        <p>
          To exercise any of these rights, contact our Grievance Officer using the details below. To protect your
          information, we may ask you to write from the phone number or email address used on your order. If you are
          not satisfied with our response, you may complain to the Data Protection Board of India.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Our website is meant for adults. If you are under 18, please ask a parent or guardian to place your order for
        you. We do not knowingly collect personal information from children without verifiable consent from a parent or
        guardian, and we will delete it if we learn that we have.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as our business or the law changes. The date at the top of this page shows when it
        was last revised, and significant changes will be highlighted on the website. Orders are always handled under
        the version in force when they were placed.
      </p>
    ),
  },
  {
    id: "grievance-officer",
    title: "Grievance Officer and contact",
    body: (
      <>
        <p>
          In accordance with the Information Technology Act, 2000, the Digital Personal Data Protection Act, 2023 and the
          Consumer Protection (E-Commerce) Rules, 2020, our Grievance Officer is:
        </p>
        <GrievanceOfficer />
        <p>
          The quickest route is <TextLink href={whatsappHref}>WhatsApp</TextLink>, or you can write to{" "}
          <TextLink href={mailHref}>{site.email}</TextLink> with “Privacy” in the subject line.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      path={path}
      eyebrow="Client care · Privacy"
      title="Privacy Policy"
      intro="How we collect, use and protect your personal information when you browse our website, place an order or talk to us on WhatsApp, and the choices you have about it."
      summary={[
        "We collect only what we need to make, deliver and support your order: your name, contact details, delivery address, order details and the UPI reference you share.",
        "We never collect card or bank details, and we will never ask for your UPI PIN or an OTP.",
        "We do not use advertising trackers, and we never sell or rent your information.",
        "Your bag lives only in your browser. Our one cookie is for our own team’s admin sign-in.",
        <>
          You can ask to see, correct or erase your information at any time through our{" "}
          <TextLink href="#grievance-officer">Grievance Officer</TextLink>.
        </>,
      ]}
      sections={sections}
    />
  );
}
