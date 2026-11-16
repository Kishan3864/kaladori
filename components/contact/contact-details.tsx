import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { site } from "@/lib/site";

const telHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;

/** Studio contact details as a hairline-ruled description list. */
export function ContactDetails() {
  return (
    <Stagger delay={0.5} stagger={0.08}>
      <dl className="border-t border-line">
        <StaggerItem className="grid grid-cols-1 gap-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
          <dt className="eyebrow pt-1.5 text-stone">Write</dt>
          <dd>
            <a href={`mailto:${site.email}`} className="link-draw font-display text-2xl leading-tight md:text-[1.75rem]">
              {site.email}
            </a>
          </dd>
        </StaggerItem>

        {site.phone ? (
          <StaggerItem className="grid grid-cols-1 gap-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <dt className="eyebrow pt-1.5 text-stone">Call</dt>
            <dd>
              <a href={telHref} className="link-draw font-display text-2xl leading-tight md:text-[1.75rem]">
                {site.phone}
              </a>
            </dd>
          </StaggerItem>
        ) : null}

        <StaggerItem className="grid grid-cols-1 gap-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
          <dt className="eyebrow pt-1.5 text-stone">Studio hours</dt>
          <dd className="text-[15px] leading-relaxed">
            Monday–Saturday, 10am–7pm IST
            <span className="mt-1 block text-stone">Atelier visits by appointment</span>
          </dd>
        </StaggerItem>

        <StaggerItem className="grid grid-cols-1 gap-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
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
