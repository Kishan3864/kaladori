import { NewsletterForm } from "@/components/home/newsletter-form";
import { Reveal } from "@/components/motion/reveal";

/** A quiet, centred sign-up to close the page. */
export function Newsletter() {
  return (
    <section aria-labelledby="newsletter-title" className="shell pb-24 pt-20 md:pb-36 md:pt-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 id="newsletter-title" className="text-[clamp(1.625rem,1.2rem+1.5vw,2.5rem)] leading-[1.1]">
          Letters from the <em className="italic text-maroon">loom</em>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-stone md:text-base">
          New collections and early access to small runs, once a month.
        </p>
        <div className="mx-auto mt-10 max-w-xl text-left">
          <NewsletterForm />
        </div>
      </Reveal>
    </section>
  );
}
