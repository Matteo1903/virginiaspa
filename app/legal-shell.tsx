"use client";

import Link from "next/link";
import { SiteFooter, ThemeToggle } from "./site-chrome";
import { legalReviewNotice } from "../lib/legal";

export function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="legal-page-shell">
      <header className="gift-page-header">
        <Link className="brand" href="/">Virginia <em>SPA</em></Link>
        <Link className="gift-back-link" href="/">← Home</Link>
        <div className="subpage-actions"><ThemeToggle language="it" /></div>
      </header>
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
