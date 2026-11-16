"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { WhatsAppGlyph } from "@/components/checkout/whatsapp-glyph";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

/** Routes with their own WhatsApp actions (or none wanted). */
const HIDDEN_PREFIXES = ["/admin", "/checkout", "/order"];

/**
 * Floating "Chat with us on WhatsApp" button, bottom-right. Sits below the
 * mobile menu (z-45) and the bag drawer (z-60), and lifts above the product
 * page's mobile buy bar while it is showing (ProductInfo sets
 * `data-buy-bar` on <html>).
 */
export function WhatsAppButton() {
  return (
    <Suspense fallback={null}>
      <FloatingWhatsApp />
    </Suspense>
  );
}

function FloatingWhatsApp() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return null;

  return (
    <a
      href={whatsappLink(`Hello ${site.shortName}, I have a question.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group pointer-events-none fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[41] flex items-center transition-[bottom] duration-500 ease-editorial motion-safe:animate-page-in max-lg:[:root[data-buy-bar]_&]:bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:right-6 md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
    >
      {/* Desktop hover label */}
      <span
        aria-hidden="true"
        className="eyebrow pointer-events-none mr-3 hidden translate-x-2 bg-ivory px-4 py-2.5 text-[10px] text-ink opacity-0 shadow-[0_10px_30px_-18px_rgba(26,26,26,0.5)] ring-1 ring-line transition-[opacity,transform] duration-500 ease-editorial group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block"
      >
        Chat with us
      </span>
      <span className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-maroon text-ivory shadow-[0_14px_34px_-14px_rgba(132,31,63,0.75)] ring-1 ring-ivory/30 transition-colors duration-500 ease-editorial group-hover:bg-ink">
        <WhatsAppGlyph size={26} />
      </span>
    </a>
  );
}
