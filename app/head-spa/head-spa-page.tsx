"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CommerceExperience from "../commerce";
import { Language, languages } from "../i18n";
import LanguagePicker from "../language-picker";

const backLabels: Record<Language, string> = { it: "Torna alle esperienze", en: "Back to experiences", es: "Volver a experiencias", fr: "Retour aux expériences", de: "Zurück zu den Erlebnissen" };
const heroCopy: Record<Language, { eyebrow: string; description: string; jump: string }> = {
  it: { eyebrow: "Virginia SPA · Esperienza 01", description: "Un’esperienza dedicata alla cura di testa, cute e sensi. Manualità lente, acqua e rituali mirati aiutano a sciogliere le tensioni e ritrovare equilibrio.", jump: "Vai ai trattamenti" },
  en: { eyebrow: "Virginia SPA · Experience 01", description: "An experience devoted to the care of the head, scalp and senses. Slow techniques, water and targeted rituals help release tension and restore balance.", jump: "View treatments" },
  es: { eyebrow: "Virginia SPA · Experiencia 01", description: "Una experiencia dedicada al cuidado de la cabeza, el cuero cabelludo y los sentidos. Maniobras lentas, agua y rituales específicos ayudan a liberar tensiones y recuperar el equilibrio.", jump: "Ver tratamientos" },
  fr: { eyebrow: "Virginia SPA · Expérience 01", description: "Une expérience consacrée au soin de la tête, du cuir chevelu et des sens. Gestes lents, eau et rituels ciblés aident à libérer les tensions et retrouver l’équilibre.", jump: "Voir les soins" },
  de: { eyebrow: "Virginia SPA · Erlebnis 01", description: "Ein Erlebnis für Kopf, Kopfhaut und Sinne. Langsame Griffe, Wasser und gezielte Rituale helfen, Spannungen zu lösen und das Gleichgewicht wiederzufinden.", jump: "Behandlungen ansehen" },
};

export default function HeadSpaPage() {
  const [language, setLanguage] = useState<Language>("it");
  const [languageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("virginia-language") as Language | null;
    const frame = window.requestAnimationFrame(() => {
      if (saved && languages.some(({ code }) => code === saved)) setLanguage(saved);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("virginia-language", language);
  }, [language]);

  const hero = heroCopy[language];

  return <main className="head-spa-page-shell">
    <header className="gift-page-header">
      <Link className="brand" href="/">Virginia <em>SPA</em></Link>
      <Link className="gift-back-link" href="/#shop">← {backLabels[language]}</Link>
      <LanguagePicker language={language} open={languageOpen} onToggle={() => setLanguageOpen((open) => !open)} onChange={(value) => { setLanguage(value); setLanguageOpen(false); }} />
    </header>
    <section className="head-spa-hero">
      <div className="head-spa-hero-copy">
        <p>{hero.eyebrow}</p>
        <h1>HEAD <em>SPA</em></h1>
        <span>{hero.description}</span>
      </div>
      <a className="head-spa-jump" href="#shop">{hero.jump} <b aria-hidden="true">↓</b></a>
    </section>
    <CommerceExperience language={language} mode="treatments" />
  </main>;
}
