import type { Metadata } from "next";
import GiftCardPage from "./gift-card-page";

export const metadata: Metadata = {
  title: "Gift Card benessere",
  description: "Acquista online una Gift Card Virginia SPA. È un voucher digitale: dopo l’acquisto si contatta la SPA per data, orario e dettagli del rituale.",
  alternates: { canonical: "/gift-card" },
};

export default function Page() {
  return <GiftCardPage />;
}
