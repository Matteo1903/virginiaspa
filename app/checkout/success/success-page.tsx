"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Language } from "../../i18n";
import { SiteFooter, ThemeToggle } from "../../site-chrome";

type Voucher = { title: string; code: string; claimToken: string; status: string; validUntil: string };
const copy: Record<Language, { checking: string; paid: string; paidCopy: string; pending: string; pendingCopy: string; download: string; home: string; error: string }> = {
  it: { checking: "Verifica del pagamento…", paid: "Il tuo voucher è pronto.", paidCopy: "Il pagamento è andato a buon fine. Puoi scaricare il voucher e conservarlo fino al momento dell’utilizzo.", pending: "Stiamo confermando il pagamento.", pendingCopy: "La conferma può richiedere qualche secondo. Questa pagina si aggiorna automaticamente.", download: "Scarica il voucher", home: "Torna alla home", error: "Non riusciamo a verificare questo ordine." },
  en: { checking: "Checking payment…", paid: "Your voucher is ready.", paidCopy: "Payment was successful. You can download your voucher and keep it until you are ready to use it.", pending: "We are confirming your payment.", pendingCopy: "Confirmation may take a few seconds. This page updates automatically.", download: "Download voucher", home: "Back to home", error: "We cannot verify this order." },
  es: { checking: "Verificando el pago…", paid: "Tu bono está listo.", paidCopy: "El pago se ha realizado correctamente. Puedes descargar el bono y guardarlo hasta el momento de utilizarlo.", pending: "Estamos confirmando tu pago.", pendingCopy: "La confirmación puede tardar unos segundos. Esta página se actualiza automáticamente.", download: "Descargar bono", home: "Volver al inicio", error: "No podemos verificar este pedido." },
  fr: { checking: "Vérification du paiement…", paid: "Votre bon est prêt.", paidCopy: "Le paiement a réussi. Vous pouvez télécharger votre bon et le conserver jusqu’à son utilisation.", pending: "Nous confirmons votre paiement.", pendingCopy: "La confirmation peut prendre quelques secondes. Cette page se met à jour automatiquement.", download: "Télécharger le bon", home: "Retour à l’accueil", error: "Nous ne pouvons pas vérifier cette commande." },
  de: { checking: "Zahlung wird geprüft…", paid: "Dein Gutschein ist bereit.", paidCopy: "Die Zahlung war erfolgreich. Du kannst den Gutschein herunterladen und bis zur Einlösung aufbewahren.", pending: "Wir bestätigen deine Zahlung.", pendingCopy: "Die Bestätigung kann einige Sekunden dauern. Diese Seite aktualisiert sich automatisch.", download: "Gutschein herunterladen", home: "Zur Startseite", error: "Diese Bestellung kann nicht geprüft werden." },
};

export default function CheckoutSuccess() {
  const [language] = useState<Language>(() => typeof window === "undefined" ? "it" : (localStorage.getItem("virginia-language") as Language) || "it");
  const [status, setStatus] = useState<"loading" | "in_attesa" | "pagato" | "error">("loading");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const text = copy[language];
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
        const response = await fetch(`/api/orders/status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        const data = await response.json() as { status?: string; vouchers?: Voucher[] };
        if (data.status === "pagato" && data.vouchers?.length) { setVouchers(data.vouchers); setStatus("pagato"); return; }
        setStatus("in_attesa");
        if (attempts < 12) window.setTimeout(check, 2000);
      } catch { setStatus("error"); }
    };
    void check();
  }, []);
  return <main className="payment-result-shell"><div className="payment-result-page">
    <header className="result-header"><Link className="brand" href="/">Virginia <em>SPA</em></Link><ThemeToggle language={language} /></header>
    <section aria-live="polite">
      <span className="payment-result-mark">{status === "pagato" ? "✓" : "V"}</span>
      <p>Stripe · Virginia SPA</p>
      <h1>{status === "loading" ? text.checking : status === "pagato" ? text.paid : status === "error" ? text.error : text.pending}</h1>
      <span>{status === "pagato" ? text.paidCopy : status === "in_attesa" ? text.pendingCopy : ""}</span>
      {status === "pagato" && <div className="voucher-downloads">{vouchers.map((voucher) => <a className="button button-primary" key={voucher.code} href={`/api/vouchers/${voucher.claimToken}`}>{text.download}: {voucher.title}<b>↓</b></a>)}</div>}
      <Link className="text-link" href="/">{text.home}</Link>
    </section>
  </div><SiteFooter language={language} /></main>;
}
