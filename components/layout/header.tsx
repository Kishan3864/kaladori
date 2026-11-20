"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { selectCount, useCart } from "@/lib/cart-store";
import { useEscapeKey, useLockBodyScroll } from "@/lib/hooks";
import { navigation, site, type NavLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** `primary`: "Shop all" + live categories (built in the root layout from the catalogue). */
export function Header({ primary = navigation.primary }: { primary?: readonly NavLink[] }) {
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
      <motion.header
        id="site-header"
        data-menu-open={menuOpen ? "true" : undefined}
        data-scrolled={scrolled ? "true" : undefined}
        className={cn(
          "sticky top-0 z-50 border-b transition-colors duration-500",
          scrolled || menuOpen ? "border-line bg-ivory/90 backdrop-blur-md" : "border-transparent bg-ivory",
        )}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
          {/* Logo (kept at 140px+ so "TEXTILE" stays legible) */}
          <Logo tone="auto" priority className="w-[140px] min-[360px]:w-[150px] md:w-[172px]" onClick={closeMenu} />

          {/* Desktop navigation, one line */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {[...primary, ...navigation.secondary].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="hdr-fg link-draw py-1 text-[13px] tracking-[0.04em] text-ink/80 transition-colors duration-300 hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="-mr-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openCart();
              }}
              className="hdr-fg flex h-11 items-center gap-2 px-2 text-[13px] tracking-[0.04em]"
              aria-label={bagLabel}
            >
              <BagIcon />
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] tabular-nums transition-colors duration-300",
                  hasHydrated && count > 0 ? "bg-maroon text-ivory" : "hdr-badge bg-sand text-ink/60",
                )}
                aria-hidden="true"
              >
                {hasHydrated ? count : 0}
              </span>
            </button>

            <button
              ref={toggleRef}
              type="button"
              className="flex h-11 w-11 items-center justify-center lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="relative block h-2.5 w-6" aria-hidden="true">
                <span
                  className={cn(
                    "hdr-bar absolute left-0 top-0 h-px w-6 bg-ink transition-transform duration-500 ease-editorial",
                    menuOpen && "translate-y-[5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "hdr-bar absolute bottom-0 left-0 h-px w-6 bg-ink transition-transform duration-500 ease-editorial",
                    menuOpen && "-translate-y-[4px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} primary={primary} />
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
function BagIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
    </svg>
  );
}

function MobileMenu({ open, onClose, primary }: { open: boolean; onClose: () => void; primary: readonly NavLink[] }) {
  const links = [...primary, ...navigation.secondary];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          key="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-0 z-[45] flex flex-col overflow-y-auto bg-ivory pt-16 md:pt-[4.5rem] lg:hidden"
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
