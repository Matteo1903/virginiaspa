import type { Metadata } from "next";
import CheckoutSuccess from "./success-page";

export const metadata: Metadata = { title: "Pagamento completato", robots: { index: false, follow: false } };
export default function Page() { return <CheckoutSuccess />; }
