"use client";

import { useEffect, useRef } from "react";
import type { Language } from "./i18n";
import { useSiteLanguage } from "./use-site-language";
import { DEMO_MODE, installDemoFetch } from "../lib/demo-client";

if (DEMO_MODE) installDemoFetch();

const copy: Record<Language, string> = {
  it: "Anteprima dimostrativa. Pagamenti, email e voucher restano in questo browser: nessun addebito. Area staff su",
  en: "Demonstration preview. Payments, emails and vouchers stay in this browser: nothing is charged. Staff area at",
  es: "Vista previa de demostración. Pagos, correos y bonos se quedan en este navegador: ningún cargo. Área de personal en",
  fr: "Aperçu de démonstration. Paiements, e-mails et bons restent dans ce navigateur : aucun débit. Espace équipe sur",
  de: "Demonstrationsvorschau. Zahlungen, E-Mails und Gutscheine bleiben in diesem Browser: keine Abbuchung. Personalbereich unter",
};

export function DemoBanner() {
  const [language] = useSiteLanguage();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const apply = () => document.documentElement.style.setProperty("--demo-banner-h", `${node.offsetHeight}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--demo-banner-h");
    };
  }, [language]);
  return (
    <div ref={ref} className="demo-banner" role="status">
      <p>{copy[language]} <a href="/staff">/staff</a> · demo</p>
    </div>
  );
}
