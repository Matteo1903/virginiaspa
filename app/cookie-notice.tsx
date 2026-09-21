"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSiteLanguage } from "./use-site-language";
import { LocalizedContent } from "./localized-content";

const STORAGE_KEY = "virginia-cookie-notice";

export function CookieNotice() {
  const [language] = useSiteLanguage();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== "dismissed");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (!visible) return null;
  return (
    <LocalizedContent language={language}><div className="cookie-notice" role="status">
      <p>
        Questo sito usa storage tecnico (tema e lingua) e PostHog Cloud EU in modalità cookieless, senza profili persistenti.
        {" "}<Link href="/cookie">Informativa cookie</Link>
      </p>
      <button
        type="button"
        className="button button-primary"
        onClick={() => {
          window.localStorage.setItem(STORAGE_KEY, "dismissed");
          setVisible(false);
        }}
      >
        Ho capito
      </button>
    </div></LocalizedContent>
  );
}
