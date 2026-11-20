import Link from "next/link";
import { WhatsAppGlyph } from "@/components/checkout/whatsapp-glyph";
import { Reveal } from "@/components/motion/reveal";
import { policies, site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

const STEPS = [
  {
    title: "Pick your piece",
    body: "Open any saree, kurti or scarf and choose your size.",
  },
  {
    title: "Send on WhatsApp",
    body: "Tap Order on WhatsApp: the message with every detail is ready. Just press send.",
  },
  {
    title: "Pay by UPI, we ship",
    body: `We confirm on WhatsApp, you pay by UPI, and it ships within ${policies.dispatchDays} working days.`,
  },
];

/** Three plain steps so a first-time visitor (often from Instagram) knows exactly how to order. */
export function HowToOrder() {
  return (
    <section aria-labelledby="how-title" className="shell pt-14 md:pt-20">
      <Reveal y={16} className="border border-line bg-sand/40 p-6 md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-maroon">Ordering is simple</p>
            <h2 id="how-title" className="mt-3 text-[clamp(1.625rem,1.2rem+1.5vw,2.5rem)] leading-[1.1]">
              Order on WhatsApp in 3 steps
            </h2>
          </div>
          <a href={whatsappLink(`Hello ${site.shortName}! I'd like help choosing a piece.`)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp gap-2.5">
            <WhatsAppGlyph size={16} />
            Chat on WhatsApp
          </a>
        </div>
        <ol className="mt-8 grid gap-6 md:mt-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon font-display text-lg text-ivory">
                {i + 1}
              </span>
              <span>
                <span className="block font-display text-xl leading-tight">{step.title}</span>
                <span className="mt-1.5 block text-[14px] leading-relaxed text-stone">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-8 border-t border-line pt-5 text-[13px] text-stone">
          Free shipping across India on orders over {formatPrice(site.freeShippingThreshold)} · Easy{" "}
          {policies.returnDays}-day returns ·{" "}
          <Link href="/contact#faq-ordering" className="link-draw text-ink">
            Questions? Read the FAQ
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
