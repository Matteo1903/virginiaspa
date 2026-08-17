"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CommerceExperience from "../commerce";
import { Language, languages } from "../i18n";

function MiniFlag({ language }: { language: Language }) {
  return <span className={`mini-flag flag-${language}`} aria-hidden="true"><i /></span>;
}

const backLabels: Record<Language, string> = { it: "Torna alla home", en: "Back to home", es: "Volver al inicio", fr: "Retour à l’accueil", de: "Zurück zur Startseite" };
const heroCopy: Record<Language, { eyebrow: string; title: string; accent: string; text: string; cta: string }> = {
  it: { eyebrow: "Virginia SPA · Gift ritual", title: "Regala un tempo", accent: "che resta.", text: "Un dono personale, composto da te. Scegli il valore, aggiungi una dedica e crea un voucher digitale pronto da regalare.", cta: "Componi la tua Gift Card" },
  en: { eyebrow: "Virginia SPA · Gift ritual", title: "Give a moment", accent: "that stays.", text: "A personal gift, created by you. Choose the value, add a message and create a digital voucher ready to give.", cta: "Create your Gift Card" },
  es: { eyebrow: "Virginia SPA · Ritual regalo", title: "Regala un momento", accent: "que perdura.", text: "Un regalo personal, creado por ti. Elige el valor, añade una dedicatoria y crea un bono digital listo para regalar.", cta: "Crea tu tarjeta regalo" },
  fr: { eyebrow: "Virginia SPA · Rituel cadeau", title: "Offrez un moment", accent: "qui demeure.", text: "Un cadeau personnel, composé par vous. Choisissez sa valeur, ajoutez un message et créez un bon numérique prêt à offrir.", cta: "Créez votre carte cadeau" },
  de: { eyebrow: "Virginia SPA · Geschenkritual", title: "Schenke einen Moment", accent: "der bleibt.", text: "Ein persönliches Geschenk, von dir gestaltet. Wähle den Wert, füge eine Nachricht hinzu und erstelle einen digitalen Gutschein.", cta: "Geschenkkarte gestalten" },
};

export default function GiftCardPage() {
  const [language, setLanguage] = useState<Language>("it");
  const [languageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("virginia-language") as Language | null;
    const frame = requestAnimationFrame(() => {
      if (saved && languages.some(({ code }) => code === saved)) setLanguage(saved);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("virginia-language", language);
  }, [language]);

  const changeLanguage = (value: Language) => {
    setLanguage(value);
    setLanguageOpen(false);
  };

  const hero = heroCopy[language];

  return <main className="gift-page-shell">
    <header className="gift-page-header">
      <Link className="brand" href="/">Virginia <em>SPA</em></Link>
      <Link className="gift-back-link" href="/">← {backLabels[language]}</Link>
      <div className={languageOpen ? "gift-language-picker is-open" : "gift-language-picker"}>
        <button className="gift-language-current" type="button" onClick={() => setLanguageOpen((open) => !open)} aria-label="Seleziona lingua" aria-haspopup="menu" aria-expanded={languageOpen}>
          <MiniFlag language={language} /><span aria-hidden="true">⌄</span>
        </button>
        {languageOpen && <div className="gift-language-menu" role="menu">
          {languages.map(({ code, label }) => <button type="button" key={code} role="menuitemradio" aria-checked={language === code} onClick={() => changeLanguage(code)}><MiniFlag language={code} /><span>{label}</span>{language === code && <i aria-hidden="true">✓</i>}</button>)}
        </div>}
      </div>
    </header>
    <section className="gift-entry-hero">
      <div className="gift-entry-image" aria-hidden="true"><span /></div>
      <div className="gift-entry-copy">
        <p>{hero.eyebrow}</p>
        <h1>{hero.title}<em>{hero.accent}</em></h1>
        <span>{hero.text}</span>
        <a className="button button-light" href="#gift-atelier">{hero.cta}<b>↓</b></a>
      </div>
      <span className="gift-entry-index">01 · Gift atelier</span>
    </section>
    <CommerceExperience language={language} mode="gift" />
  </main>;
}
