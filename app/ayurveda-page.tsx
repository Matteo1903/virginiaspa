"use client";

import { useState } from "react";
import { useSiteDocumentTitle, useSiteLanguage } from "./use-site-language";
import { SiteFooter, SiteHeader } from "./site-chrome";
import { TreatmentCard } from "./treatment-card";
import { ayurvedaFilterCopy, ayurvedaFilterIds, ayurvedaPageCopy, filterAyurvedaRituals, type AyurvedaFilter } from "./ayurveda-content";
import { checkoutCatalog } from "../lib/catalog";
import { useCart } from "./cart-context";
import { PurchaseNotice } from "./purchase-notice";

export default function AyurvedaPage() {
  const [language, setLanguage] = useSiteLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<AyurvedaFilter>("all");
  const text = ayurvedaPageCopy[language];
  const filters = ayurvedaFilterCopy[language];
  const visible = filterAyurvedaRituals(filter);
  const product = checkoutCatalog["percorso-ayurveda"];
  const title = product.titles?.[language] || product.title;
  const { addItem } = useCart();
  const euro = new Intl.NumberFormat(language, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  useSiteDocumentTitle(title);
  return <main className="head-spa-page-shell ayurveda-page-shell">
    <SiteHeader language={language} onLanguageChange={setLanguage} bookingHref="#shop" />
    <section id="main-content" tabIndex={-1} className="head-spa-hero">
      <div className="head-spa-hero-copy"><p>Virginia SPA · Ayurveda</p><h1>{title}</h1><span>{text.intro}</span></div>
      <a className="head-spa-jump" href="#shop">{text.jump} <b aria-hidden="true">↓</b></a>
    </section>
    <section className="ayurveda-philosophy" aria-labelledby="ayurveda-dosha-title">
      <div className="ayurveda-dosha"><h2 id="ayurveda-dosha-title">{text.doshaTitle}</h2><p>{text.doshaText}</p></div>
      <h2>{text.pillarsTitle}</h2><div className="ayurveda-pillars">{text.pillars.map((pillar) => <article key={pillar.title}><h3>{pillar.title}</h3><p>{pillar.text}</p></article>)}</div>
      <p className="ayurveda-approach">{text.approach}</p>
    </section>
    <section id="shop" className="commerce-section">
      <div className="commerce-heading"><p className="eyebrow"><span /> Ayurveda · {text.count}</p><h2>{text.ritualsTitle}</h2><p>{text.ritualsIntro}</p></div>
      <div className="need-filters" role="group" aria-label={filters.label}>{ayurvedaFilterIds.map((id) => <button key={id} type="button" className={filter === id ? "active" : ""} aria-pressed={filter === id} onClick={() => { setFilter(id); setExpanded(null); }}>{filters[id]}</button>)}</div>
      <div className="product-grid">{visible.map((ritual) => {
        const copy = ritual.locales[language];
        return <TreatmentCard key={ritual.id} id={`ayurveda-${ritual.id}`} title={ritual.title} subtitle={copy.subtitle} summary={copy.description.split(/(?<=\.)\s/)[0]} image={ritual.image} description={copy.description}
          expanded={expanded === ritual.id} onToggle={() => setExpanded((current) => current === ritual.id ? null : ritual.id)} read={text.read} close={text.close} closeAria={text.closeAria} kicker="Ayurveda" back={text.back} action={text.ask} actionHref="/#contatti" />;
      })}</div>
      <div id="percorso-completo" className="ayurveda-complete">
        <div><p className="eyebrow">Ayurveda</p><h2>{text.completeTitle}</h2><p>{text.completeText}</p></div>
        <div><div className="ritual-price"><div><small>{text.duration}</small><strong>{product.duration}</strong></div><div><small>{text.price}</small><strong>{euro.format(product.unitAmount / 100)}</strong></div></div>
          <PurchaseNotice language={language} /><button className="button button-primary" type="button" onClick={() => addItem({ id: "percorso-ayurveda", title, detail: product.duration, price: product.unitAmount / 100, quantity: 1 })}>{text.buy}<span aria-hidden="true">→</span></button>
        </div>
      </div>
    </section>
    <SiteFooter language={language} />
  </main>;
}
