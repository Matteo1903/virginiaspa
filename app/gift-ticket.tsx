"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { Language } from "./i18n";

import { voucherQrMatrix } from "../lib/voucher-qr";

const copy: Record<Language, { eyebrow: string; forLabel: string; fromLabel: string; stub: string; preview: string; valid: string; save: string; replayLabel: string }> = {
  it: { eyebrow: "Gift Card", forLabel: "Per", fromLabel: "Da", stub: "Presenta in SPA", preview: "Anteprima", valid: "Valida fino al", save: "Scarica", replayLabel: "Ristampa la card" },
  en: { eyebrow: "Gift Card", forLabel: "For", fromLabel: "From", stub: "Present at the SPA", preview: "Preview", valid: "Valid until", save: "Save", replayLabel: "Print the card again" },
  es: { eyebrow: "Tarjeta regalo", forLabel: "Para", fromLabel: "De", stub: "Preséntala en el SPA", preview: "Vista previa", valid: "Válida hasta el", save: "Descargar", replayLabel: "Imprimir la tarjeta otra vez" },
  fr: { eyebrow: "Carte cadeau", forLabel: "Pour", fromLabel: "De", stub: "À présenter au SPA", preview: "Aperçu", valid: "Valable jusqu’au", save: "Télécharger", replayLabel: "Réimprimer la carte" },
  de: { eyebrow: "Geschenkkarte", forLabel: "Für", fromLabel: "Von", stub: "Im SPA vorzeigen", preview: "Vorschau", valid: "Gültig bis", save: "Laden", replayLabel: "Karte erneut drucken" },
};

export type GiftTicketProps = {
  language: Language;
  title?: string;
  message: string;
  recipient: string;
  sender?: string;
  amount: string;
  code?: string;
  validUntil?: string;
  print?: boolean;
  delayMs?: number;
  downloadHref?: string;
  downloadLabel?: string;
};

function VoucherQr({ value }: { value: string }) {
  const qr = useMemo(() => voucherQrMatrix(value), [value]);
  return (
    <svg className="gift-ticket-qr" viewBox={`0 0 ${qr.size} ${qr.size}`} role="img" aria-label={value}>
      <rect width={qr.size} height={qr.size} fill="#fbf6ec" />
      {qr.data.flatMap((row, y) => row.map((on, x) => on ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#28382f" /> : null))}
    </svg>
  );
}

export function GiftTicket({ language, title, message, recipient, sender, amount, code, validUntil, print = true, delayMs = 0, downloadHref, downloadLabel }: GiftTicketProps) {
  const text = copy[language];
  const pressRef = useRef<HTMLDivElement>(null);
  const firstPlay = useRef(true);
  const [canTilt, setCanTilt] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState<"wait" | "armed" | "printing">(print ? "armed" : "wait");
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      setReduced(motion.matches);
      setCanTilt(hover.matches && !motion.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    hover.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      hover.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!print || reduced) {
      setPhase("wait");
      return;
    }
    const node = pressRef.current;
    if (!node) return;
    setPhase("armed");
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || started) return;
      started = true;
      observer.disconnect();
      setPhase("printing");
    }, { threshold: 0.22 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [print, reduced]);

  const replay = () => {
    if (!print || reduced) return;
    firstPlay.current = false;
    setPlayCount((count) => count + 1);
    setPhase("printing");
  };

  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (!canTilt) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(x * 9).toFixed(2)}deg`);
  };

  const reset = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  const dedication = [
    recipient ? `${text.forLabel} ${recipient}` : "",
    sender ? `${text.fromLabel} ${sender}` : "",
  ].filter(Boolean);

  return (
    <div ref={pressRef} className={`gift-press${phase === "armed" ? " is-armed" : ""}${phase === "printing" ? " is-printing" : ""}`}>
      <div className="gift-press-lip">
        <div className="gift-press-housing">
          {print && !reduced ? <button type="button" className="gift-press-replay" onClick={replay} aria-label={code ? `${text.replayLabel} ${code}` : text.replayLabel}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8a4.8 4.8 0 1 0 1.15-3.1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 2.6v3.1h3.1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button> : null}
          <span className="gift-press-slot" aria-hidden="true" />
          {downloadHref ? <a className="gift-press-download" href={downloadHref} aria-label={downloadLabel}>{text.save}<b aria-hidden="true">↓</b></a> : null}
        </div>
      </div>
      <div className="gift-press-stage">
        <div key={playCount} className="gift-ticket-feed" style={{ animationDelay: phase === "printing" && firstPlay.current ? `${delayMs}ms` : undefined }}>
          <article
            className="gift-ticket"
            aria-label={`${text.eyebrow}${title ? `, ${title}` : ""}`}
            onPointerMove={tilt}
            onPointerLeave={reset}
          >
            <div className="gift-ticket-body">
              <header>
                <div>
                  <span>Virginia <em>SPA</em></span>
                  <small>{text.eyebrow}</small>
                </div>
                <i>{amount}</i>
              </header>
              <p>{message || title}</p>
              {message && title ? <strong>{title}</strong> : null}
              {dedication.length > 0 ? <p className="gift-ticket-for">{dedication.join(" · ")}</p> : null}
              <svg className="gift-ticket-mark" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M40 18c2 10 8 16 18 18-10 2-16 8-18 18-2-10-8-16-18-18 10-2 16-8 18-18z" fill="currentColor"/></svg>
            </div>
            <aside className="gift-ticket-stub">
              <small>{text.stub}</small>
              {code ? <VoucherQr value={code} /> : null}
              <b>{code || text.preview}</b>
              {validUntil ? <span>{text.valid} {validUntil}</span> : null}
            </aside>
          </article>
        </div>
      </div>
    </div>
  );
}
