"use client";

import { SiteFooter, SiteHeader } from "./site-chrome";
import { legalReviewNotice } from "../lib/legal";

export function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="legal-page-shell">
      <SiteHeader language="it" />
      <article className="legal-article">
        <p className="legal-kicker">Documenti</p>
        <h1>{title}</h1>
        <p className="legal-notice" role="note">{legalReviewNotice}</p>
        {children}
      </article>
      <SiteFooter language="it" />
    </main>
  );
}
