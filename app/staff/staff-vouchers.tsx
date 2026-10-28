"use client";
import dynamic from "next/dynamic";
import { FormEvent, useCallback, useState } from "react";
import { SiteFooter, ThemeToggle } from "../site-chrome";

const QrScanner = dynamic(() => import("./qr-scanner"), { ssr: false });

type Voucher = { id: string; code: string; title: string; status: "pagato" | "utilizzato" | "rimborsato" | "scaduto"; validUntil: string; usedAt: string | null; recipient: string | null; customerName: string; customerEmail: string };

export default function StaffVouchers() {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Voucher[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState("");

  const headers = (): HeadersInit => {
    const next: Record<string, string> = {};
    if (token) next.Authorization = `Bearer ${token}`;
    return next;
  };

  const load = async (event?: FormEvent) => {
    event?.preventDefault();
    if (event) setScanned("");
    setLoading(true);
    setError("");
    const response = await fetch(`/api/staff/vouchers?q=${encodeURIComponent(query)}`, {
      headers: headers(),
      cache: "no-store",
      credentials: "include",
    });
    const data = await response.json() as { vouchers?: Voucher[]; error?: string };
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Accesso non riuscito");
      return;
    }
    setRows(data.vouchers || []);
  };

  const onScan = async (code: string) => {
    setScanning(false);
    setScanned(code);
    setQuery(code);
    setLoading(true);
    setError("");
    const response = await fetch(`/api/staff/vouchers?q=${encodeURIComponent(code)}`, {
      headers: headers(),
      cache: "no-store",
      credentials: "include",
    });
    const data = await response.json() as { vouchers?: Voucher[]; error?: string };
    setLoading(false);
    if (!response.ok) {
      setRows([]);
      setError(data.error || "Accesso non riuscito");
      return;
    }
    const match = (data.vouchers || []).filter((voucher) => voucher.code === code);
    setRows(match);
    if (!match.length) setError(`Nessun voucher con codice ${code}.`);
  };

  const closeScanner = useCallback(() => setScanning(false), []);

  const redeemVoucher = async (voucher: Voucher) => {
    if (!window.confirm(`Confermi l’utilizzo del voucher ${voucher.code}?`)) return;
    const response = await fetch(`/api/staff/vouchers/${voucher.id}/use`, {
      method: "POST",
      headers: headers(),
      credentials: "include",
    });
    const data = await response.json() as { error?: string };
    if (!response.ok) {
      setError(data.error || "Operazione non riuscita");
      return;
    }
    await load();
  };

  return (
    <main className="staff-page">
      <header>
        <span>Virginia <em>SPA</em></span>
        <p>Area riservata · Gestione voucher</p>
        <ThemeToggle />
      </header>
      <section>
        <div className="staff-intro">
          <p>Controllo operativo</p>
          <h1>Voucher</h1>
          <span>Scansiona il QR del voucher o cerca un codice o un cliente, verifica lo stato e registra l’utilizzo in SPA.</span>
          {process.env.NEXT_PUBLIC_DEMO_MODE === "1" && <p className="staff-demo-note">Anteprima: inserisci la chiave <strong>demo</strong>. I voucher di esempio e quelli creati dal checkout di questo browser compaiono nella ricerca.</p>}
        </div>
        <form className="staff-search" onSubmit={load}>
          <label>Chiave personale<input type="password" autoComplete="current-password" value={token} onChange={(event) => setToken(event.target.value)} placeholder={process.env.NEXT_PUBLIC_DEMO_MODE === "1" ? "demo" : "Token staff"} /></label>
          <label>Cerca voucher<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Codice, trattamento o email" /></label>
          <button className="button button-primary" disabled={loading}>{loading ? "Ricerca…" : "Cerca"}</button>
          <button type="button" className="button staff-scan-button" onClick={() => setScanning(true)}>Scansiona QR</button>
        </form>
        {error && <p className="staff-error" role="alert">{error}</p>}
        <div className="staff-results">
          {rows.map((voucher) => (
            <article key={voucher.id} className={voucher.code === scanned ? "is-scanned" : undefined}>
              <div>
                <span className={`voucher-status status-${voucher.status}`}>{voucher.status}</span>
                <h2>{voucher.title}</h2>
                <strong>{voucher.code}</strong>
                <p>{voucher.recipient || voucher.customerName} · {voucher.customerEmail}</p>
                <small>{voucher.status === "utilizzato" && voucher.usedAt ? `Utilizzato il ${new Date(voucher.usedAt).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" })}` : `Valido fino al ${new Date(voucher.validUntil).toLocaleDateString("it-IT")}`}</small>
              </div>
              <button type="button" disabled={voucher.status !== "pagato"} onClick={() => redeemVoucher(voucher)}>
                {voucher.status === "pagato" ? "Segna come utilizzato" : `Voucher ${voucher.status}`}
              </button>
            </article>
          ))}
        </div>
      </section>
      {scanning && <QrScanner onCode={(code) => void onScan(code)} onClose={closeScanner} />}
      <SiteFooter />
    </main>
  );
}
