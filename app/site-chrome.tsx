"use client";

import { type ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { languages, translate, type Language } from "./i18n";
import LanguagePicker, { FlagIcon } from "./language-picker";
import { CartButton } from "./cart-context";
import {
  spaCityLine,
  spaDaysDisplay,
  spaEmail,
  spaHoursDisplay,
  spaInstagramUrl,
  spaPhoneDisplay,
  spaPhoneHref,
} from "../lib/site";

const copy: Record<Language, { explore: string; treatments: string; method: string; contacts: string; hours: string; city: string; days: string; privacy: string; cookies: string; terms: string; top: string; light: string; dark: string }> = {
  it: { explore: "Esplora", treatments: "Trattamenti", method: "Metodo", contacts: "Contatti", hours: "Orari", city: spaCityLine, days: spaDaysDisplay, privacy: "Privacy", cookies: "Cookie", terms: "Termini", top: "Torna su", light: "Attiva modalità chiara", dark: "Attiva modalità scura" },
  en: { explore: "Explore", treatments: "Treatments", method: "Our approach", contacts: "Contact", hours: "Opening hours", city: spaCityLine, days: "Tue — Sat", privacy: "Privacy", cookies: "Cookies", terms: "Terms", top: "Back to top", light: "Switch to light mode", dark: "Switch to dark mode" },
  es: { explore: "Explora", treatments: "Tratamientos", method: "Método", contacts: "Contacto", hours: "Horario", city: spaCityLine, days: "Mar — Sáb", privacy: "Privacidad", cookies: "Cookies", terms: "Términos", top: "Volver arriba", light: "Activar modo claro", dark: "Activar modo oscuro" },
  fr: { explore: "Explorer", treatments: "Soins", method: "Méthode", contacts: "Contact", hours: "Horaires", city: spaCityLine, days: "Mar — Sam", privacy: "Confidentialité", cookies: "Cookies", terms: "Conditions", top: "Retour en haut", light: "Activer le mode clair", dark: "Activer le mode sombre" },
  de: { explore: "Entdecken", treatments: "Behandlungen", method: "Methode", contacts: "Kontakt", hours: "Öffnungszeiten", city: spaCityLine, days: "Di — Sa", privacy: "Datenschutz", cookies: "Cookies", terms: "AGB", top: "Nach oben", light: "Hellen Modus aktivieren", dark: "Dunklen Modus aktivieren" },
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

const navCopy: Record<Language, { experiences: string; gift: string; method: string; about: string; contacts: string; booking: string; open: string; close: string }> = {
  it: { experiences: "Esperienze", gift: "Gift Card", method: "Metodo", about: "Chi siamo", contacts: "Contatti", booking: "Acquista un voucher", open: "Apri il menu", close: "Chiudi il menu" },
  en: { experiences: "Experiences", gift: "Gift Card", method: "Approach", about: "About us", contacts: "Contact", booking: "Buy a voucher", open: "Open menu", close: "Close menu" },
  es: { experiences: "Experiencias", gift: "Gift Card", method: "Método", about: "Quiénes somos", contacts: "Contacto", booking: "Compra un bono", open: "Abrir menú", close: "Cerrar menú" },
  fr: { experiences: "Expériences", gift: "Gift Card", method: "Méthode", about: "Qui sommes-nous", contacts: "Contact", booking: "Achetez un bon", open: "Ouvrir le menu", close: "Fermer le menu" },
  de: { experiences: "Erlebnisse", gift: "Gift Card", method: "Methode", about: "Über uns", contacts: "Kontakt", booking: "Gutschein kaufen", open: "Menü öffnen", close: "Menü schließen" },
};

export function SiteBrand({ href = "/", onClick, label = "Virginia SPA" }: { href?: string; onClick?: () => void; label?: string }) {
  return <Link className="brand" href={href} aria-label={label} onClick={onClick}>Virginia <em>SPA</em></Link>;
}

export function SiteHeader({ language, onLanguageChange, extraAction, showBooking = true, bookingHref = "/#shop" }: { language: Language; onLanguageChange?: (language: Language) => void; extraAction?: ReactNode; showBooking?: boolean; bookingHref?: string }) {
  const [menuOpen, setMenuOpen] = useState(false); const [languageOpen, setLanguageOpen] = useState(false); const text = navCopy[language];
  const changeLanguage = (value: Language) => { onLanguageChange?.(value); setLanguageOpen(false); setMenuOpen(false); };
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.body.classList.add("menu-lock");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("menu-lock");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);
  return <>
    <a className="skip-link" href="#main-content">{translate("Vai al contenuto principale", language)}</a>
    <header className={menuOpen ? "site-header is-menu-open" : "site-header"}>
      <SiteBrand onClick={() => setMenuOpen(false)} />
      <nav className="nav-links nav-links-desktop" aria-label={translate("Navigazione principale", language)}>
        <Link href="/#shop">{text.experiences}</Link>
        <Link href="/gift-card">{text.gift}</Link>
        <Link href="/#metodo">{text.method}</Link>
        <Link href="/chi-siamo">{text.about}</Link>
        <Link href="/#contatti">{text.contacts}</Link>
      </nav>
      <div className="header-actions">
        {extraAction}
        {showBooking && <Link className="header-booking" href={bookingHref}>{text.booking}<span aria-hidden="true">↗</span></Link>}
        <CartButton />
        {onLanguageChange ? <LanguagePicker language={language} open={languageOpen} onToggle={() => setLanguageOpen((value) => !value)} onChange={changeLanguage} /> : null}
        <ThemeToggle language={language} />
        <button className={menuOpen ? "menu-toggle is-open" : "menu-toggle"} type="button" aria-label={menuOpen ? text.close : text.open} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((value) => !value)}><span /><span /></button>
      </div>
    </header>
    <nav id="mobile-navigation" className={menuOpen ? "nav-links nav-links-mobile is-open" : "nav-links nav-links-mobile"} aria-label={translate("Navigazione mobile", language)} aria-hidden={!menuOpen}>
      <Link href="/#shop" onClick={() => setMenuOpen(false)}>{text.experiences}</Link>
      <Link href="/gift-card" onClick={() => setMenuOpen(false)}>{text.gift}</Link>
      <Link href="/#metodo" onClick={() => setMenuOpen(false)}>{text.method}</Link>
      <Link href="/chi-siamo" onClick={() => setMenuOpen(false)}>{text.about}</Link>
      <Link href="/#contatti" onClick={() => setMenuOpen(false)}>{text.contacts}</Link>
      {showBooking && <Link className="mobile-booking" href={bookingHref} onClick={() => setMenuOpen(false)}>{text.booking}</Link>}
      {onLanguageChange && <div className="mobile-languages" role="group" aria-label={translate("Seleziona lingua", language)}>
        {languages.map(({ code, label }) => (
          <button key={code} type="button" className={language === code ? "active" : undefined} aria-label={label} aria-pressed={language === code} onClick={() => changeLanguage(code)}>
            <FlagIcon language={code} />
          </button>
        ))}
      </div>}
    </nav>
  </>;
}

export function SiteFooter({ language = "it" }: { language?: Language }) {
  const text = copy[language];
  return <footer>
    <div className="footer-brand"><Link className="brand" href="/">Virginia <em>SPA</em></Link><p>{translate("Beauty, wellness & slow rituals.", language)}<br />{text.city}</p></div>
    <div className="footer-links"><div><span>{text.explore}</span><Link href="/#shop">{text.treatments}</Link><Link href="/chi-siamo">{navCopy[language].about}</Link><Link href="/#metodo">{text.method}</Link><Link href="/gift-card">Gift Card</Link></div><div><span>{text.contacts}</span><a href={spaPhoneHref}>{spaPhoneDisplay}</a><a href={`mailto:${spaEmail}`}>{spaEmail}</a><a href={spaInstagramUrl} target="_blank" rel="noopener noreferrer">Instagram ↗</a></div><div><span>{text.hours}</span><p>{text.days}<br />{spaHoursDisplay}</p></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Virginia SPA</span><span className="footer-legal"><Link href="/privacy">{text.privacy}</Link><Link href="/cookie">{text.cookies}</Link><Link href="/termini">{text.terms}</Link></span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{text.top} ↑</button></div>
  </footer>;
}
