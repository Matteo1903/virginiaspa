import type { Metadata } from "next";
import DemoPayPage from "./demo-pay-page";

export const metadata: Metadata = { title: "Pagamento simulato", robots: { index: false, follow: false } };

export default function Page() {
  return <DemoPayPage />;
}
