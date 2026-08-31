"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CommerceExperience from "../commerce";
import { Language, languages, translate } from "../i18n";
import LanguagePicker from "../language-picker";
import { SiteFooter, ThemeToggle } from "../site-chrome";

const backLabels: Record<Language, string> = { it: "Torna alla home", en: "Back to home", es: "Volver al inicio", fr: "Retour à l’accueil", de: "Zurück zur Startseite" };
const heroCopy: Record<Language, { eyebrow: string; title: string; accent: string; text: string; cta: string }> = {
  it: { eyebrow: "Virginia SPA · Gift ritual", title: "Regala un tempo", accent: "che resta.", text: "Un dono personale, composto da te. Acquisti una Gift Card digitale: chi la riceve contatta poi Virginia SPA per data, orario e dettagli del rituale.", cta: "Componi la tua Gift Card" },
  en: { eyebrow: "Virginia SPA · Gift ritual", title: "Give a moment", accent: "that stays.", text: "A personal gift, created by you. You are buying a digital Gift Card: the recipient then contacts Virginia SPA to set date, time and ritual details.", cta: "Create your Gift Card" },
  es: { eyebrow: "Virginia SPA · Ritual regalo", title: "Regala un momento", accent: "que perdura.", text: "Un regalo personal, creado por ti. Compras una tarjeta digital: quien la reciba contacta después con Virginia SPA para fecha, hora y detalles del ritual.", cta: "Crea tu tarjeta regalo" },
  fr: { eyebrow: "Virginia SPA · Rituel cadeau", title: "Offrez un moment", accent: "qui demeure.", text: "Un cadeau personnel, composé par vous. Vous achetez une carte numérique : la personne qui la reçoit contacte ensuite Virginia SPA pour la date, l’heure et les détails du rituel.", cta: "Créez votre carte cadeau" },
  de: { eyebrow: "Virginia SPA · Geschenkritual", title: "Schenke einen Moment", accent: "der bleibt.", text: "Ein persönliches Geschenk, von dir gestaltet. Du kaufst eine digitale Geschenkkarte: Die beschenkte Person kontaktiert danach Virginia SPA für Datum, Uhrzeit und Ritualdetails.", cta: "Geschenkkarte gestalten" },
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
      <div className="subpage-actions"><LanguagePicker language={language} open={languageOpen} onToggle={() => setLanguageOpen((open) => !open)} onChange={changeLanguage} /><ThemeToggle language={language} /></div>
    </header>
    <section className="gift-entry-hero">
      <div className="gift-entry-image" aria-hidden="true"><span /></div>
      <div className="gift-entry-copy">
        <p>{hero.eyebrow}</p>
        <h1>{hero.title}<em>{hero.accent}</em></h1>
        <span>{hero.text}</span>
        <a className="button button-light" href="#gift-atelier">{hero.cta}<b>↓</b></a>
      </div>
      <span className="gift-entry-index">{translate("01 · Gift atelier", language)}</span>
    </section>
    <CommerceExperience language={language} mode="gift" />
    <SiteFooter language={language} />
  </main>;
}
