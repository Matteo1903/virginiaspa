import type { Metadata } from "next";
import AboutPage from "./about-page";

export const metadata: Metadata = {
  title: "Chi siamo",
  description: "Virginia SPA a Latina: rituali, HEAD SPA e voucher digitali.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/chi-siamo" },
};

export default function Page() {
  return <AboutPage />;
}
