"use client";

import { SiteFooter, SiteHeader } from "./site-chrome";
import { legalReviewNotice } from "../lib/legal";
import { useSiteDocumentTitle, useSiteLanguage } from "./use-site-language";
import { LocalizedContent } from "./localized-content";
import { translate } from "./i18n";

export function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  const [language, setLanguage] = useSiteLanguage();
  useSiteDocumentTitle(translate(title, language));
  return (
    <main className="legal-page-shell">
      <SiteHeader language={language} onLanguageChange={setLanguage} />
      <LocalizedContent language={language}>
      <article className="legal-article">
        <p className="legal-kicker">Documenti</p>
        <h1>{title}</h1>
        <p className="legal-notice" role="note">{legalReviewNotice}</p>
        {children}
      </article>
      </LocalizedContent>
      <SiteFooter language={language} />
    </main>
  );
}
