import type { Metadata } from "next";
import HeadSpaPage from "./head-spa-page";

export const metadata: Metadata = {
  title: "HEAD SPA | Rituali e trattamenti",
  description: "Scopri tutti i rituali HEAD SPA Virginia SPA, con descrizioni, durate e prezzi.",
  alternates: { canonical: "/head-spa" },
};

export default function Page() {
  return <HeadSpaPage />;
}
