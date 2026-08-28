"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Language } from "./i18n";

const copy: Record<Language, { explore: string; treatments: string; method: string; contacts: string; hours: string; city: string; days: string; privacy: string; top: string; light: string; dark: string }> = {
  it: { explore: "Esplora", treatments: "Trattamenti", method: "Metodo", contacts: "Contatti", hours: "Orari", city: "Nel cuore di Latina.", days: "Lun — Sab", privacy: "Privacy · Cookie", top: "Torna su", light: "Attiva modalità chiara", dark: "Attiva modalità scura" },
  en: { explore: "Explore", treatments: "Treatments", method: "Our approach", contacts: "Contact", hours: "Opening hours", city: "In the heart of Latina.", days: "Mon — Sat", privacy: "Privacy · Cookies", top: "Back to top", light: "Switch to light mode", dark: "Switch to dark mode" },
  es: { explore: "Explora", treatments: "Tratamientos", method: "Método", contacts: "Contacto", hours: "Horario", city: "En el corazón de Latina.", days: "Lun — Sáb", privacy: "Privacidad · Cookies", top: "Volver arriba", light: "Activar modo claro", dark: "Activar modo oscuro" },
  fr: { explore: "Explorer", treatments: "Soins", method: "Méthode", contacts: "Contact", hours: "Horaires", city: "Au cœur de Latina.", days: "Lun — Sam", privacy: "Confidentialité · Cookies", top: "Retour en haut", light: "Activer le mode clair", dark: "Activer le mode sombre" },
  de: { explore: "Entdecken", treatments: "Behandlungen", method: "Methode", contacts: "Kontakt", hours: "Öffnungszeiten", city: "Im Herzen von Latina.", days: "Mo — Sa", privacy: "Datenschutz · Cookies", top: "Nach oben", light: "Hellen Modus aktivieren", dark: "Dunklen Modus aktivieren" },
};

export function ThemeToggle({ language = "it" }: { language?: Language }) {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const saved = window.localStorage.getItem("virginia-theme");
    const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const frame = window.requestAnimationFrame(() => {
      setIsDark(dark);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const toggle = () => {
    const next = !isDark; setIsDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("virginia-theme", next ? "dark" : "light");
  };
  const label = isDark ? copy[language].light : copy[language].dark;
  return <button className="theme-toggle" type="button" onClick={toggle} aria-label={label} title={label}><span className="sun" aria-hidden="true">☼</span><span className="moon" aria-hidden="true">◐</span></button>;
}

export function SiteFooter({ language = "it" }: { language?: Language }) {
  const text = copy[language];
  return <footer>
    <div className="footer-brand"><Link className="brand" href="/">Virginia <em>SPA</em></Link><p>Beauty, wellness & slow rituals.<br />{text.city}</p></div>
    <div className="footer-links"><div><span>{text.explore}</span><Link href="/#shop">{text.treatments}</Link><Link href="/chi-siamo">{language === "it" ? "Chi siamo" : language === "en" ? "About us" : language === "es" ? "Quiénes somos" : language === "fr" ? "Qui sommes-nous" : "Über uns"}</Link><Link href="/#metodo">{text.method}</Link><Link href="/gift-card">Gift Card</Link></div><div><span>{text.contacts}</span><a href="tel:+390773000000">0773 000000</a><a href="mailto:ciao@virginiaspa.it">ciao@virginiaspa.it</a><Link href="/">Instagram ↗</Link></div><div><span>{text.hours}</span><p>{text.days}<br />09:00 — 20:00</p></div></div>
    <div className="footer-bottom"><span>© 2026 Virginia SPA</span><span>{text.privacy}</span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{text.top} ↑</button></div>
  </footer>;
}
