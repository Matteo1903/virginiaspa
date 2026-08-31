"use client";

import { useEffect, useState } from "react";
import type { Language } from "./i18n";
import { purchaseCopy } from "../lib/purchase";

export function PurchaseNotice({ language }: { language: Language }) {
  const text = purchaseCopy[language];
  const [testMode, setTestMode] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/payments/mode")
      .then((response) => response.json())
      .then((data: { mode?: string }) => {
        if (!cancelled) setTestMode(data.mode === "test");
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className="purchase-notice-block">
      {testMode && <p className="test-payment-banner" role="status">{text.testBanner}</p>}
      <aside className="purchase-notice" role="note">
        <strong>{text.title}</strong>
        <p>{text.body}</p>
      </aside>
    </div>
  );
}
