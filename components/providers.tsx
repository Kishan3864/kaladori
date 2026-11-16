"use client";

import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Client-side app providers: reduced-motion aware animation config + cart rehydration. */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // `persist` is only attached when zustand could create its storage. The
    // store's factory never throws, but stay defensive: a missing API must
    // never take the whole site down.
    const persistApi = (useCart as Partial<typeof useCart>).persist;
    if (persistApi) void persistApi.rehydrate();
    else useCart.setState({ hasHydrated: true });
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
