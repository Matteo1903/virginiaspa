"use client";

import { useSiteDocumentTitle, useSiteLanguage } from "./use-site-language";
import Image from "next/image";
import type { Language } from "./i18n";
import { SiteFooter, SiteHeader } from "./site-chrome";
import type { RitualExperience } from "./ritual-experiences";
import { PurchaseNotice } from "./purchase-notice";
import { checkoutCatalog } from "../lib/catalog";
import { useCart } from "./cart-context";

const copy: Record<Language, { back: string; experience: string; duration: string; price: string; provisional: string; buy: string }> = {
  it: { back: "Torna alle esperienze", experience: "Esperienza Virginia SPA", duration: "Durata", price: "Prezzo", provisional: "Valori provvisori", buy: "Acquista il voucher" },
  en: { back: "Back to experiences", experience: "Virginia SPA experience", duration: "Duration", price: "Price", provisional: "Provisional values", buy: "Buy the voucher" },
  es: { back: "Volver a experiencias", experience: "Experiencia Virginia SPA", duration: "Duración", price: "Precio", provisional: "Valores provisionales", buy: "Comprar el bono" },
  fr: { back: "Retour aux expériences", experience: "Expérience Virginia SPA", duration: "Durée", price: "Prix", provisional: "Valeurs provisoires", buy: "Acheter le bon" },
  de: { back: "Zurück zu den Erlebnissen", experience: "Virginia-SPA-Erlebnis", duration: "Dauer", price: "Preis", provisional: "Vorläufige Werte", buy: "Gutschein kaufen" },
};
const locales: Record<Language, string> = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" };

export default function RitualExperiencePage({ experience }: { experience: RitualExperience }) {
  const [language, setLanguage] = useSiteLanguage();
  const { addItem } = useCart();
  const ritual = experience.locales[language];
  const text = copy[language];
  const euro = new Intl.NumberFormat(locales[language], { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  useSiteDocumentTitle(ritual.title);
  const addToCart = () => {
    addItem({ id: experience.productId, title: ritual.title, detail: `${experience.duration} min`, price: experience.price, quantity: 1 });
  };
  return <main className="ritual-page-shell"><SiteHeader language={language} onLanguageChange={setLanguage} showBooking={false} />
    <section id="main-content" tabIndex={-1} className="ritual-detail-hero"><div className="ritual-detail-image"><Image src={experience.image} alt={ritual.title} fill priority unoptimized sizes="(max-width:700px) 100vw, 46vw" /></div><div className="ritual-detail-copy"><p>{text.experience}</p><h1>{ritual.title}</h1><span>{ritual.intro}</span>{ritual.meta && <div className="ritual-meta">{ritual.meta.map((item) => <small key={item}>{item}</small>)}</div>}<div className="ritual-price"><div><small>{text.duration}</small><strong>{experience.duration} min</strong></div><div><small>{text.price}</small><strong>{euro.format(experience.price)}</strong></div>{!checkoutCatalog[experience.productId].confirmed && <i>{text.provisional}</i>}</div><PurchaseNotice language={language} /><button className="button button-primary" type="button" onClick={addToCart}>{text.buy}<b>→</b></button></div></section>
    <section className="ritual-journey"><div className="ritual-journey-heading"><p>{text.experience}</p><h2>{ritual.title}</h2></div><div className="ritual-blocks">{ritual.blocks.map((block, index) => <article key={block.title}><span>{String(index + 1).padStart(2,"0")}</span><div><h3>{block.title}</h3>{block.text && <p>{block.text}</p>}</div></article>)}{ritual.closing && <blockquote>{ritual.closing}</blockquote>}</div></section>
    <SiteFooter language={language} />
  </main>;
}
