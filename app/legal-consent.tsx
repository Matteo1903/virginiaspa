import type { Language } from "./i18n";

const copy: Record<Language, { before: string; privacy: string; middle: string; terms: string; after: string }> = {
  it: { before: "Ho letto l’", privacy: "informativa privacy", middle: " e i ", terms: "termini di vendita", after: "." },
  en: { before: "I have read the ", privacy: "privacy notice", middle: " and the ", terms: "terms of sale", after: "." },
  es: { before: "He leído la ", privacy: "política de privacidad", middle: " y las ", terms: "condiciones de venta", after: "." },
  fr: { before: "J’ai lu la ", privacy: "politique de confidentialité", middle: " et les ", terms: "conditions de vente", after: "." },
  de: { before: "Ich habe die ", privacy: "Datenschutzerklärung", middle: " und die ", terms: "Verkaufsbedingungen", after: " gelesen." },
};

export function LegalConsent({ language }: { language: Language }) {
  const text = copy[language];
  return <>{text.before}<a href="/privacy" target="_blank" rel="noopener noreferrer">{text.privacy}</a>{text.middle}<a href="/termini" target="_blank" rel="noopener noreferrer">{text.terms}</a>{text.after}</>;
}
