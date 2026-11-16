import type { Metadata } from "next";
import Image from "next/image";
import { ContactDetails } from "@/components/contact/contact-details";
import { ContactForm } from "@/components/contact/contact-form";
import { FaqAccordion } from "@/components/contact/faq-accordion";
import { faqs } from "@/components/contact/faq-data";
import { ImageReveal } from "@/components/motion/image-reveal";
import { MaskedLines, Reveal } from "@/components/motion/reveal";
import { ThreadDraw, ThreadLine } from "@/components/motion/thread-line";
import { editorial } from "@/lib/images";
import { site } from "@/lib/site";

const title = "Contact";
const description =
  "Contact KalaDori Textile about an order, a styling appointment, saree blouse stitching or wholesale. Studio hours Monday–Saturday, 10am–7pm IST; atelier visits by appointment.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/contact",
    siteName: site.name,
    title: `${title} — ${site.name}`,
    description,
    images: [{ url: editorial.contact.src, alt: editorial.contact.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — ${site.name}`,
    description,
    images: [{ url: editorial.contact.src, alt: editorial.contact.alt }],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer.join(" ") },
  })),
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="shell pb-24 pt-14 md:pb-36 md:pt-24 lg:pt-32">
        <div className="grid grid-cols-1 gap-y-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-24">
          {/* Left: introduction and studio details */}
          <div className="lg:col-span-5 lg:row-start-1">
            <Reveal y={12} className="flex items-center gap-4">
              <span className="h-px w-10 bg-maroon" aria-hidden="true" />
              <p className="eyebrow text-maroon">Contact</p>
            </Reveal>

            <MaskedLines
              as="h1"
              animateOnMount
              delay={0.15}
              className="mt-10 text-hero md:mt-14"
              lines={[
                <span key="t1">Let&rsquo;s</span>,
                <span key="t2" className="inline-block pl-[0.6em]">
                  <em className="italic">talk</em>.
                </span>,
              ]}
            />
            <ThreadDraw
              preset="underline"
              delay={1.1}
              duration={1.4}
              className="ml-[0.6em] h-[0.14em] w-[2.1em] text-hero"
            />

            <Reveal delay={0.45}>
              <p className="mt-10 max-w-md text-lede text-ink/85">
                An order, a fitting, a saree you can&rsquo;t stop thinking about — write to us. Every message is
                read and answered by our client care team at the atelier.
              </p>
            </Reveal>

            <div className="mt-14 md:mt-16">
              <ContactDetails />
            </div>
          </div>

          {/* Right: the form, set lower for an asymmetric rhythm */}
          <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:pt-44">
            <Reveal delay={0.3}>
              <div className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-line pb-8 md:mb-14">
                <div>
                  <p className="eyebrow text-stone">Write to us</p>
                  <h2 className="mt-4 text-title">
                    Send a <em className="italic">message</em>
                  </h2>
                </div>
                <p className="text-[13px] text-stone">Replies within two working days</p>
              </div>
            </Reveal>
            <ContactForm />
          </div>

          {/* Left, second row: the studio */}
          <figure className="ml-auto w-[82%] sm:w-[60%] lg:col-span-4 lg:col-start-2 lg:row-start-2 lg:ml-0 lg:w-full">
            <ImageReveal className="aspect-[4/5]" from="left">
              <Image
                src={editorial.contact.src}
                alt={editorial.contact.alt}
                fill
                sizes="(min-width: 1600px) 480px, (min-width: 1024px) 30vw, (min-width: 640px) 60vw, 82vw"
                className="object-cover"
              />
            </ImageReveal>
            <figcaption className="mt-4 text-[13px] leading-relaxed text-stone">
              <span className="eyebrow mr-3 text-maroon">The atelier</span>
              Open by appointment, Monday to Saturday.
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="faq" aria-label="Frequently asked questions" className="relative scroll-mt-28 bg-sand">
        {/* The thread stitches the ivory and sand panels together as you scroll. */}
        <ThreadLine
          preset="loop"
          showTip
          offset={["start 95%", "end 45%"]}
          className="absolute inset-x-0 -top-12 h-24 md:-top-20 md:h-40"
        />

        <div className="shell py-24 md:py-36">
          <div className="grid grid-cols-12 gap-x-5 gap-y-14 md:gap-x-8">
            <div className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Reveal y={12}>
                  <p className="eyebrow text-ink/70">Client care</p>
                </Reveal>
                <MaskedLines
                  as="h2"
                  className="mt-8 text-display md:mt-10"
                  lines={[
                    <span key="f1">
                      Questions,
                    </span>,
                    <span key="f2">
                      <em className="italic">answered</em>.
                    </span>,
                  ]}
                />
                <Reveal delay={0.15}>
                  <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-ink/75">
                    Shipping, returns, sizing and the care of handwoven cloth. If your question isn&rsquo;t here,
                    write to{" "}
                    <a href={`mailto:${site.email}`} className="link-draw text-ink">
                      {site.email}
                    </a>
                    .
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
