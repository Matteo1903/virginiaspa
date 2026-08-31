"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "virginia-cookie-notice";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== "dismissed");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (!visible) return null;
  return (
    <div className="cookie-notice" role="status">
      <p>
        Questo sito usa solo storage tecnico (tema e lingua). Nessun cookie di profilazione.
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
    </div>
  );
}
