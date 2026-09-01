"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Language } from "../../i18n";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import { purchaseCopy } from "../../../lib/purchase";
import { spaEmail, spaPhoneDisplay, spaPhoneHref } from "../../../lib/site";
import { PurchaseNotice } from "../../purchase-notice";

type Voucher = { title: string; code: string; claimToken: string; status: string; validUntil: string };
const copy: Record<Language, { checking: string; paid: string; paidCopy: string; pending: string; pendingCopy: string; download: string; home: string; error: string; contact: string }> = {
  it: { checking: "Verifica del pagamento…", paid: "Il tuo voucher è pronto.", paidCopy: "Hai acquistato un voucher, non una prenotazione. Scaricalo e poi contatta Virginia SPA per scegliere data, orario e finalizzare l’appuntamento.", pending: "Stiamo confermando il pagamento.", pendingCopy: "La conferma può richiedere qualche secondo. Questa pagina si aggiorna automaticamente.", download: "Scarica il voucher", home: "Torna alla home", error: "Non riusciamo a verificare questo ordine.", contact: "Contatta Virginia SPA" },
  en: { checking: "Checking payment…", paid: "Your voucher is ready.", paidCopy: "You have bought a voucher, not a booking. Download it, then contact Virginia SPA to choose date, time and finalise your appointment.", pending: "We are confirming your payment.", pendingCopy: "Confirmation may take a few seconds. This page updates automatically.", download: "Download voucher", home: "Back to home", error: "We cannot verify this order.", contact: "Contact Virginia SPA" },
  es: { checking: "Verificando el pago…", paid: "Tu bono está listo.", paidCopy: "Has comprado un bono, no una reserva. Descárgalo y contacta con Virginia SPA para elegir fecha, hora y finalizar la cita.", pending: "Estamos confirmando tu pago.", pendingCopy: "La confirmación puede tardar unos segundos. Esta página se actualiza automáticamente.", download: "Descargar bono", home: "Volver al inicio", error: "No podemos verificar este pedido.", contact: "Contactar con Virginia SPA" },
  fr: { checking: "Vérification du paiement…", paid: "Votre bon est prêt.", paidCopy: "Vous avez acheté un bon, pas une réservation. Téléchargez-le, puis contactez Virginia SPA pour choisir date, horaire et finaliser le rendez-vous.", pending: "Nous confirmons votre paiement.", pendingCopy: "La confirmation peut prendre quelques secondes. Cette page se met à jour automatiquement.", download: "Télécharger le bon", home: "Retour à l’accueil", error: "Nous ne pouvons pas vérifier cette commande.", contact: "Contacter Virginia SPA" },
  de: { checking: "Zahlung wird geprüft…", paid: "Dein Gutschein ist bereit.", paidCopy: "Du hast einen Gutschein gekauft, keine Terminbuchung. Lade ihn herunter und kontaktiere Virginia SPA, um Datum, Uhrzeit und Termin festzulegen.", pending: "Wir bestätigen deine Zahlung.", pendingCopy: "Die Bestätigung kann einige Sekunden dauern. Diese Seite aktualisiert sich automatisch.", download: "Gutschein herunterladen", home: "Zur Startseite", error: "Diese Bestellung kann nicht geprüft werden.", contact: "Virginia SPA kontaktieren" },
};

export default function CheckoutSuccess() {
  const [language] = useState<Language>(() => typeof window === "undefined" ? "it" : (localStorage.getItem("virginia-language") as Language) || "it");
  const [status, setStatus] = useState<"loading" | "in_attesa" | "pagato" | "error">("loading");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const text = copy[language];
  const notice = purchaseCopy[language];
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      const frame = window.requestAnimationFrame(() => setStatus("error"));
      return () => window.cancelAnimationFrame(frame);
    }
    let attempts = 0;
    const check = async () => {
      attempts += 1;
      try {
        await fetch("/api/orders/access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ session_id: sessionId }),
        });
        const query = new URLSearchParams({ session_id: sessionId });
        const response = await fetch(`/api/orders/status?${query}`, { cache: "no-store", credentials: "include" });
        const data = await response.json() as { status?: string; vouchers?: Voucher[]; locked?: boolean };
        if (data.status === "pagato" && data.vouchers?.length) { setVouchers(data.vouchers); setStatus("pagato"); return; }
        setStatus("in_attesa");
        if (attempts < 12) window.setTimeout(check, 2000);
      } catch { setStatus("error"); }
    };
    void check();
  }, []);
  return <main className="payment-result-shell"><SiteHeader language={language} /><div className="payment-result-page">
    <section aria-live="polite">
      <span className="payment-result-mark">{status === "pagato" ? "✓" : "V"}</span>
      <p>Stripe · Virginia SPA</p>
      <h1>{status === "loading" ? text.checking : status === "pagato" ? text.paid : status === "error" ? text.error : text.pending}</h1>
      <span>{status === "pagato" ? text.paidCopy : status === "in_attesa" ? text.pendingCopy : ""}</span>
      {status === "pagato" && <>
        <PurchaseNotice language={language} />
        <p className="purchase-next">{notice.next}</p>
        <p className="purchase-next-contacts">{text.contact}: <a href={spaPhoneHref}>{spaPhoneDisplay}</a> · <a href={`mailto:${spaEmail}`}>{spaEmail}</a></p>
        <div className="voucher-downloads">{vouchers.map((voucher) => <a className="button button-primary" key={voucher.code} href={`/api/vouchers/${voucher.claimToken}`}>{text.download}: {voucher.title}<b>↓</b></a>)}</div>
      </>}
      <Link className="text-link" href="/">{text.home}</Link>
    </section>
  </div><SiteFooter language={language} /></main>;
}
