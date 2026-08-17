import type { Metadata } from "next";
import GiftCardPage from "./gift-card-page";

export const metadata: Metadata = {
  title: "Gift Card benessere",
  description: "Componi e acquista online una Gift Card Virginia SPA personalizzata. Dopo l’acquisto scarica il voucher digitale pronto da regalare.",
  alternates: { canonical: "/gift-card" },
};

export default function Page() {
  return <GiftCardPage />;
}
