"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { selectCount, useCart } from "@/lib/cart-store";
import { useEscapeKey, useLockBodyScroll } from "@/lib/hooks";
import { navigation, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  const count = useCart(selectCount);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const openCart = useCart((s) => s.openCart);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - (scrollY.getPrevious() ?? 0);
    setScrolled(latest > 8);
    if (latest < 160) return setHidden(false);
    // Hide on scroll down, reveal on scroll up — never while the menu is open.
    if (Math.abs(delta) < 4) return;
    setHidden(delta > 0 && !menuOpen);
  });

  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeMenuAndRefocus = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus({ preventScroll: true });
  }, []);
  useLockBodyScroll(menuOpen);
  useEscapeKey(menuOpen, closeMenuAndRefocus);

  // Let sticky elements below the header (e.g. the shop filter bar) follow it.
  useEffect(() => {
    document.documentElement.dataset.header = hidden ? "hidden" : "shown";
  }, [hidden]);

  // While the menu is open: close it if the viewport reaches the desktop
  // layout (the menu and its toggle are hidden there, which would otherwise
  // leave the page scroll-locked) or on back / forward navigation, and make
  // the page behind it inert so focus and screen readers stay in the menu.
  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onBreakpoint = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    onBreakpoint();
    desktop.addEventListener("change", onBreakpoint);
    window.addEventListener("popstate", closeMenu);

    const behind = [document.getElementById("main"), document.getElementById("site-footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    behind.forEach((el) => (el.inert = true));

    return () => {
      desktop.removeEventListener("change", onBreakpoint);
      window.removeEventListener("popstate", closeMenu);
      behind.forEach((el) => (el.inert = false));
    };
  }, [menuOpen, closeMenu]);

  const bagLabel = hasHydrated && count > 0 ? `Bag, ${count} item${count === 1 ? "" : "s"}` : "Bag";

  return (
    <>
      {/* Announcement */}
      <div className="bg-ink text-ivory">
        <p className="shell eyebrow py-2.5 text-center text-[10px] text-ivory/85 sm:text-[11px]">
          Complimentary shipping across India on orders of ₹{site.freeShippingThreshold.toLocaleString("en-IN")} and above
        </p>
      </div>

      <motion.header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors duration-500",
          scrolled || menuOpen
            ? "border-line bg-ivory/95 backdrop-blur-sm"
            : "border-transparent bg-ivory",
        )}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* Tall enough for the full lock-up, so "TEXTILE" under the wordmark stays legible. */}
        <div className="shell grid h-[68px] grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 md:h-[88px]">
          {/* Left: menu button (mobile) / primary nav (desktop) */}
          <div className="flex items-center">
            <button
              ref={toggleRef}
              type="button"
              className="-ml-2 flex h-11 items-center gap-3 px-2 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="relative block h-3 w-6" aria-hidden="true">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-6 bg-ink transition-transform duration-500 ease-editorial",
                    menuOpen && "translate-y-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-6 bg-ink transition-transform duration-500 ease-editorial",
                    menuOpen && "-translate-y-1.5 -rotate-45",
                  )}
                />
              </span>
              <span className="eyebrow hidden sm:inline">{menuOpen ? "Close" : "Menu"}</span>
              <span className="sr-only sm:hidden">{menuOpen ? "Close menu" : "Open menu"}</span>
            </button>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {navigation.primary.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={closeMenu} className="eyebrow link-draw py-1">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Centre: logo */}
          <Logo priority className="w-[140px] sm:w-[156px] md:w-[196px] xl:w-[212px]" onClick={closeMenu} />

          {/* Right: secondary nav + bag */}
          <div className="flex items-center justify-end gap-8">
            <nav aria-label="Secondary" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {navigation.secondary.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={closeMenu} className="eyebrow link-draw py-1">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openCart();
              }}
              className="eyebrow -mr-2 flex h-11 items-center gap-2 px-2"
              aria-label={bagLabel}
            >
              <span>Bag</span>
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] tracking-normal transition-colors duration-300",
                  hasHydrated && count > 0 ? "bg-maroon text-ivory" : "border border-ink/30 text-ink/60",
                )}
                aria-hidden="true"
              >
                {hasHydrated ? count : 0}
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}

/**
 * Full-screen menu below lg. A disclosure, not a modal: its toggle stays
 * visible in the header above it (z-50 vs z-[45]), and while it is open the
 * page behind is made inert (see Header), so Tab and screen readers move only
 * between the header controls and these links. z-[45] also keeps it above
 * fixed page chrome such as the product page's buy bar (z-40).
 */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const links = [...navigation.primary, ...navigation.secondary];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          key="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-0 z-[45] flex flex-col overflow-y-auto bg-ivory pt-[108px] md:pt-[128px] lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <nav aria-label="Mobile" className="shell flex-1 pt-8">
            <motion.ul
              className="flex flex-col"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
            >
              {links.map((item, i) => (
                <motion.li
                  key={item.href}
                  className="overflow-hidden border-b border-line"
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex min-h-14 items-baseline justify-between py-5 font-display text-[2rem] leading-none tracking-[-0.02em] transition-colors duration-500 ease-editorial hover:text-maroon"
                  >
                    <span>{item.label}</span>
                    <span className="eyebrow text-stone">{String(i + 1).padStart(2, "0")}</span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
          <div className="shell flex flex-col gap-2 py-10 text-sm text-stone">
            <p className="eyebrow text-ink">{site.name}</p>
            <a href={`mailto:${site.email}`} className="link-draw w-fit">
              {site.email}
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
