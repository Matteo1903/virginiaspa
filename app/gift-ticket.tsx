"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Language } from "./i18n";

import { ticketArtUrl, ticketLook } from "../lib/ticket-theme";
import { voucherQrMatrix } from "../lib/voucher-qr";

const copy: Record<Language, { eyebrow: string; voucher: string; duration: string; forLabel: string; fromLabel: string; stub: string; preview: string; valid: string; save: string; replayLabel: string }> = {
  it: { duration: "Durata", eyebrow: "Gift Card", voucher: "Voucher", forLabel: "Per", fromLabel: "Da", stub: "Presenta in SPA", preview: "Anteprima", valid: "Valida fino al", save: "Scarica", replayLabel: "Ristampa la card" },
  en: { duration: "Duration", eyebrow: "Gift Card", voucher: "Voucher", forLabel: "For", fromLabel: "From", stub: "Present at the SPA", preview: "Preview", valid: "Valid until", save: "Save", replayLabel: "Print the card again" },
  es: { duration: "Duración", eyebrow: "Tarjeta regalo", voucher: "Bono", forLabel: "Para", fromLabel: "De", stub: "Preséntala en el SPA", preview: "Vista previa", valid: "Válida hasta el", save: "Descargar", replayLabel: "Imprimir la tarjeta otra vez" },
  fr: { duration: "Durée", eyebrow: "Carte cadeau", voucher: "Bon", forLabel: "Pour", fromLabel: "De", stub: "À présenter au SPA", preview: "Aperçu", valid: "Valable jusqu’au", save: "Télécharger", replayLabel: "Réimprimer la carte" },
  de: { duration: "Dauer", eyebrow: "Geschenkkarte", voucher: "Gutschein", forLabel: "Für", fromLabel: "Von", stub: "Im SPA vorzeigen", preview: "Vorschau", valid: "Gültig bis", save: "Laden", replayLabel: "Karte erneut drucken" },
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
  kind?: "gift" | "voucher";
  productId?: string;
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

export function GiftTicket({ language, title, message, recipient, sender, amount, code, validUntil, print = true, delayMs = 0, downloadHref, downloadLabel, kind = "gift", productId }: GiftTicketProps) {
  const text = copy[language];
  const eyebrow = kind === "voucher" ? text.voucher : text.eyebrow;
  const theme = ticketLook(productId, title, language, kind);
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
            className={`gift-ticket is-${kind}${theme.family ? " has-family" : ""}`}
            style={{ "--ticket-accent": theme.accent, "--ticket-wash": theme.wash, "--ticket-paper": theme.paper, "--ticket-deep": theme.deep, "--ticket-art": theme.art ? `url(${ticketArtUrl(theme.art)})` : "none" } as CSSProperties}
            aria-label={`${eyebrow}${theme.family ? `, ${theme.family}` : ""}${title ? `, ${title}` : ""}`}
            onPointerMove={tilt}
            onPointerLeave={reset}
          >
            <div className="gift-ticket-body">
              {kind === "voucher" ? <div className="gift-ticket-art" aria-hidden="true"><b>{eyebrow}</b>{theme.family ? <span>{theme.family}</span> : null}</div> : null}
              <div className="gift-ticket-copy">
                <header>
                  <div>
                    <span>Virginia <em>SPA</em></span>
                    {kind === "gift" ? <small>{eyebrow}</small> : null}
                    {kind === "gift" && theme.family ? <span className="gift-ticket-family">{theme.family}</span> : null}
                  </div>
                  <i>{amount}</i>
                </header>
                {kind === "voucher" && theme.duration ? <dl className="gift-ticket-spec"><dt>{text.duration}</dt><dd>{theme.duration}</dd></dl> : null}
                <p>{message || title}</p>
                {message && title ? <strong>{title}</strong> : null}
                {dedication.length > 0 ? <p className="gift-ticket-for">{dedication.join(" · ")}</p> : null}
              </div>
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
