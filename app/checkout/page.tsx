import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your bag, add delivery details and place your KalaDori order. Payment is by UPI.",
  robots: { index: false, follow: false },
};

/**
 * Checkout. The shell is static; the form reads the bag from local storage
 * on the client (it shows a skeleton until the bag has rehydrated).
 */
export default function CheckoutPage() {
  return (
    <section className="shell pb-24 pt-10 md:pb-32 md:pt-16">
      <header className="mb-10 max-w-2xl md:mb-14">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-maroon" aria-hidden="true" />
          <p className="eyebrow text-maroon">Checkout</p>
        </div>
        <h1 className="text-title mt-6 md:mt-8">
          Complete your <em className="italic">order</em>
        </h1>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-stone md:text-base">
          Add your delivery details and place the order. You&rsquo;ll pay by UPI on the next page, and we confirm
          every order personally on WhatsApp.
        </p>
      </header>
      <CheckoutForm />
    </section>
  );
}
