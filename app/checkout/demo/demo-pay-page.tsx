"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Language } from "../../i18n";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import { useSiteDocumentTitle, useSiteLanguage } from "../../use-site-language";
import { confirmDemoPayment, readDemoOrder, type DemoOrder } from "../../../lib/demo-client";

const locales: Record<Language, string> = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" };

const copy: Record<Language, { kicker: string; title: string; body: string; sample: string; pay: string; paying: string; cancel: string; missingTitle: string; missing: string; home: string; ready: string; see: string; total: string }> = {
  it: {
    kicker: "Pagamento simulato",
    title: "Conferma il pagamento",
    body: "In questa anteprima non si apre Stripe e non parte nessun addebito. I numeri della carta sono un esempio e non vengono letti.",
    sample: "Carta di esempio",
    pay: "Conferma pagamento",
    paying: "Conferma in corso…",
    cancel: "Torna allo shop",
    missingTitle: "Ordine non trovato",
    missing: "Riparti dal carrello per simulare un acquisto.",
    home: "Torna alla home",
    ready: "Questo ordine è già confermato.",
    see: "Vedi i voucher",
    total: "Totale",
  },
  en: {
    kicker: "Simulated payment",
    title: "Confirm the payment",
    body: "This preview does not open Stripe and nothing is charged. The card numbers are an example and are not read.",
    sample: "Sample card",
    pay: "Confirm payment",
    paying: "Confirming…",
    cancel: "Back to the shop",
    missingTitle: "Order not found",
    missing: "Start again from the cart to simulate a purchase.",
    home: "Back to home",
    ready: "This order is already confirmed.",
    see: "View vouchers",
    total: "Total",
  },
  es: {
    kicker: "Pago simulado",
    title: "Confirma el pago",
    body: "En esta vista previa no se abre Stripe y no hay ningún cargo. Los números de la tarjeta son un ejemplo y no se leen.",
    sample: "Tarjeta de ejemplo",
    pay: "Confirmar pago",
    paying: "Confirmando…",
    cancel: "Volver a la tienda",
    missingTitle: "Pedido no encontrado",
    missing: "Vuelve al carrito para simular una compra.",
    home: "Volver al inicio",
    ready: "Este pedido ya está confirmado.",
    see: "Ver los bonos",
    total: "Total",
  },
  fr: {
    kicker: "Paiement simulé",
    title: "Confirmez le paiement",
    body: "Dans cet aperçu, Stripe ne s’ouvre pas et aucun débit n’est lancé. Les numéros de carte sont un exemple et ne sont pas lus.",
    sample: "Carte d’exemple",
    pay: "Confirmer le paiement",
    paying: "Confirmation…",
    cancel: "Retour à la boutique",
    missingTitle: "Commande introuvable",
    missing: "Repartez du panier pour simuler un achat.",
    home: "Retour à l’accueil",
    ready: "Cette commande est déjà confirmée.",
    see: "Voir les bons",
    total: "Total",
  },
  de: {
    kicker: "Simulierte Zahlung",
    title: "Zahlung bestätigen",
    body: "In dieser Vorschau öffnet sich Stripe nicht und es wird nichts abgebucht. Die Kartennummern sind ein Beispiel und werden nicht gelesen.",
    sample: "Beispielkarte",
    pay: "Zahlung bestätigen",
    paying: "Bestätigung läuft…",
    cancel: "Zurück zum Shop",
    missingTitle: "Bestellung nicht gefunden",
    missing: "Starte im Warenkorb neu, um einen Kauf zu simulieren.",
    home: "Zur Startseite",
    ready: "Diese Bestellung ist bereits bestätigt.",
    see: "Gutscheine ansehen",
    total: "Gesamt",
  },
};

export default function DemoPayPage() {
  const [language, setLanguage] = useSiteLanguage();
  const [order, setOrder] = useState<DemoOrder | null | undefined>(undefined);
  const [sessionId, setSessionId] = useState("");
  const [paying, setPaying] = useState(false);
  const text = copy[language];
  useSiteDocumentTitle(order ? text.title : text.missingTitle);
  const euro = new Intl.NumberFormat(locales[language], { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session_id") || "";
    const frame = window.requestAnimationFrame(() => {
      setSessionId(id);
      setOrder(id ? readDemoOrder(id) : null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const pay = () => {
    if (!sessionId || paying) return;
    setPaying(true);
    window.setTimeout(() => {
      confirmDemoPayment(sessionId);
      window.location.assign(`/checkout/success?session_id=${encodeURIComponent(sessionId)}`);
    }, 700);
  };

  return (
    <main className="payment-result-shell">
      <SiteHeader language={language} onLanguageChange={setLanguage} />
      <div id="main-content" tabIndex={-1} className="payment-result-page">
        <section aria-live="polite">
          <span className="payment-result-mark">V</span>
          {order === undefined ? <h1>{text.kicker}</h1> : !order ? <>
            <p>{text.kicker}</p>
            <h1>{text.missingTitle}</h1>
            <span>{text.missing}</span>
            <Link className="text-link" href="/">{text.home}</Link>
          </> : <>
            <p>{text.kicker}</p>
            <h1>{text.title}</h1>
            <span>{text.body}</span>
            <div className="demo-pay-lines">
              {order.lines.map((line) => (
                <article key={`${line.title}-${line.amountCents}`}>
                  <div>
                    <h2>{line.title}</h2>
                    <p>× {line.quantity}</p>
                  </div>
                  <strong>{euro.format(line.amountCents / 100)}</strong>
                </article>
              ))}
            </div>
            <div className="checkout-summary"><span>{text.total}</span><strong>{euro.format(order.totalCents / 100)}</strong></div>
            <p className="demo-card-label">{text.sample}</p>
            <div className="demo-card-fake" aria-hidden="true"><span>4242 4242 4242 4242</span><span>12/28</span><span>123</span></div>
            {order.status === "pagato" ? <>
              <p>{text.ready}</p>
              <Link className="button button-primary" href={`/checkout/success?session_id=${encodeURIComponent(order.sessionId)}`}>{text.see}<b>→</b></Link>
            </> : (
              <button className="button button-primary" type="button" onClick={pay} disabled={paying}>{paying ? text.paying : text.pay}<b>→</b></button>
            )}
            <Link className="text-link" href="/#shop">{text.cancel}</Link>
          </>}
        </section>
      </div>
      <SiteFooter language={language} />
    </main>
  );
}
