"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type From = "bottom" | "top" | "left" | "right";

type ImageRevealProps = {
  children: React.ReactNode;
  /** Sizing / aspect classes for the frame, e.g. "aspect-[3/4]". Frame is `relative overflow-hidden`. */
  className?: string;
  delay?: number;
  /** Direction the curtain uncovers from. */
  from?: From;
  /** Reveal immediately on mount instead of when scrolled into view. */
  animateOnMount?: boolean;
};

const CLIP: Record<From, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Editorial image reveal: a clip-path curtain opens while the image settles
 * from a slight zoom. Put a `next/image` with `fill` inside.
 *
 * Built so a photograph can never stay hidden:
 * - `animateOnMount` (above the fold) is pure CSS (globals.css → curtain-open),
 *   so it plays as soon as the HTML paints, before or without hydration.
 * - Scroll reveals render fully visible on the server. After hydration only
 *   frames that are still below the fold are closed, and they reopen on an
 *   IntersectionObserver, with a scroll / resize check as a second trigger.
 *   Anything already on screen or scrolled past stays as it is, and reduced
 *   motion (or a browser without IntersectionObserver) never hides anything.
 */
export function ImageReveal({ animateOnMount = false, ...props }: ImageRevealProps) {
  return animateOnMount ? <MountCurtain {...props} /> : <ScrollCurtain {...props} />;
}

function MountCurtain({ children, className, delay = 0, from = "bottom" }: Omit<ImageRevealProps, "animateOnMount">) {
  const timing = { animationDelay: `${delay}s` };
  return (
    <div
      className={cn("curtain-open relative overflow-hidden bg-sand", className)}
      style={{ "--curtain-from": CLIP[from], ...timing } as React.CSSProperties}
    >
      <div className="curtain-settle absolute inset-0" style={timing}>
        {children}
      </div>
    </div>
  );
}

const noopSubscribe = () => () => {};

function ScrollCurtain({ children, className, delay = 0, from = "bottom" }: Omit<ImageRevealProps, "animateOnMount">) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // false while hydrating server HTML (already painted, visible), true for a
  // fresh client mount (e.g. after a client-side navigation). Captured once.
  const isClientMount = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [fromServer] = useState(!isClientMount);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const rect = frame.getBoundingClientRect();
    // Scrolled past: leave it. Server HTML already on screen: leave it (no flash).
    if (rect.bottom <= 0) return;
    if (fromServer && rect.top < viewportHeight) return;

    // Close the curtain (before paint), then open it once the frame is seen.
    frame.style.clipPath = CLIP[from];
    inner.style.transform = "scale(1.18)";

    let revealed = false;
    let raf = 0;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      cleanup();
      frame.style.setProperty("--curtain-from", CLIP[from]);
      frame.style.animationDelay = `${delay}s`;
      inner.style.animationDelay = `${delay}s`;
      frame.style.removeProperty("clip-path");
      inner.style.removeProperty("transform");
      frame.classList.add("curtain-open");
      inner.classList.add("curtain-settle");
    };

    const inView = () => {
      const r = frame.getBoundingClientRect();
      const h = window.innerHeight || document.documentElement.clientHeight;
      const w = window.innerWidth || document.documentElement.clientWidth;
      return r.top < h * 0.96 && r.bottom > 0 && r.left < w && r.right > 0;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal();
      },
      { threshold: 0.05, rootMargin: "0px 0px -4% 0px" },
    );
    observer.observe(frame);

    // Second trigger, in case the observer is starved (capture also catches
    // scrolling inside carousels, whose scroll events do not bubble).
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (inView()) reveal();
      });
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    function cleanup() {
      observer.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    }

    return () => {
      cleanup();
      // Never leave a frame closed behind an unmount / effect re-run.
      if (!revealed) {
        frame.style.removeProperty("clip-path");
        inner.style.removeProperty("transform");
      }
    };
  }, [delay, from, fromServer]);

  return (
    <div ref={frameRef} className={cn("relative overflow-hidden bg-sand", className)}>
      <div ref={innerRef} className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
