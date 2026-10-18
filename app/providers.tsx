"use client";

import type { ReactNode } from "react";
import { CartProvider } from "./cart-context";
import { DemoBanner } from "./demo-runtime";
import { DEMO_MODE } from "../lib/demo-client";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {DEMO_MODE ? <DemoBanner /> : null}
      {children}
    </CartProvider>
  );
}
