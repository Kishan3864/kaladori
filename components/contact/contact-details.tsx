import { WhatsAppGlyph } from "@/components/checkout/whatsapp-glyph";
import { addressText, mailHref, telHref, whatsappHref } from "@/components/legal/policy-data";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { site } from "@/lib/site";

const row = "grid grid-cols-1 gap-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr] sm:gap-6";

/** Studio contact details as a hairline-ruled description list. */
export function ContactDetails() {
  return (
    <Stagger delay={0.5} stagger={0.08}>
      <dl className="border-t border-line">
        <StaggerItem className={row}>
          <dt className="eyebrow pt-1.5 text-stone">Call &amp; WhatsApp</dt>
          <dd>
            <a href={telHref} className="link-draw font-display text-2xl leading-tight md:text-[1.75rem]">
              {site.phone}
            </a>
            <span className="mt-1.5 block text-[14px] leading-relaxed text-stone">
              Our ordering line. Order, share your UPI payment reference or ask about a piece.
            </span>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
                <WhatsAppGlyph size={16} />
                WhatsApp us
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a href={telHref} className="btn btn-outline">
                Call now
              </a>
            </div>
          </dd>
        </StaggerItem>

        <StaggerItem className={row}>
          <dt className="eyebrow pt-1.5 text-stone">Write</dt>
          <dd>
            <a
              href={mailHref}
              className="link-draw break-all font-display text-2xl leading-tight md:text-[1.75rem]"
            >
              {site.email}
            </a>
          </dd>
        </StaggerItem>

        <StaggerItem className={row}>
          <dt className="eyebrow pt-1.5 text-stone">Hours</dt>
          <dd className="text-[15px] leading-relaxed">
            {site.hours}
            <span className="mt-1 block text-stone">
              Payments are verified and orders confirmed within these hours. Atelier visits by appointment.
            </span>
          </dd>
        </StaggerItem>

        <StaggerItem className={row}>
          <dt className="eyebrow pt-1.5 text-stone">Founder</dt>
          <dd className="text-[15px] leading-relaxed">
            {site.owner}
            <span className="mt-1 block text-stone">Founder &amp; Proprietor, {site.name}</span>
          </dd>
        </StaggerItem>

        <StaggerItem className={row}>
          <dt className="eyebrow pt-1.5 text-stone">Location</dt>
          <dd className="text-[15px] leading-relaxed">
            <address className="not-italic">
              {site.city}
              <span className="mt-1 block text-stone">{addressText}</span>
            </address>
          </dd>
        </StaggerItem>

        <StaggerItem className={row}>
          <dt className="eyebrow pt-1.5 text-stone">Follow</dt>
          <dd className="text-[15px]">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="-my-2.5 inline-flex min-h-[44px] items-center gap-2 hover:text-maroon"
            >
              <span className="link-draw">Instagram</span>
              <span aria-hidden="true">&#8599;</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </dd>
        </StaggerItem>
      </dl>
    </Stagger>
  );
}
