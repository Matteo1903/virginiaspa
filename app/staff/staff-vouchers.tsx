"use client";
import { FormEvent, useState } from "react";
import { SiteFooter, ThemeToggle } from "../site-chrome";

type Voucher = { id: string; code: string; title: string; status: "pagato" | "utilizzato" | "rimborsato" | "scaduto"; validUntil: string; usedAt: string | null; recipient: string | null; customerName: string; customerEmail: string };

export default function StaffVouchers() {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Voucher[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = (): HeadersInit => {
    const next: Record<string, string> = {};
    if (token) next.Authorization = `Bearer ${token}`;
    return next;
  };

  const load = async (event?: FormEvent) => {
    event?.preventDefault();
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
          <span>Cerca un codice o un cliente, verifica lo stato e registra l’utilizzo in SPA.</span>
        </div>
        <form className="staff-search" onSubmit={load}>
          <label>Chiave personale<input type="password" autoComplete="current-password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Token staff" /></label>
          <label>Cerca voucher<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Codice, trattamento o email" /></label>
          <button className="button button-primary" disabled={loading}>{loading ? "Ricerca…" : "Cerca"}</button>
        </form>
        {error && <p className="staff-error" role="alert">{error}</p>}
        <div className="staff-results">
          {rows.map((voucher) => (
            <article key={voucher.id}>
              <div>
                <span className={`voucher-status status-${voucher.status}`}>{voucher.status}</span>
                <h2>{voucher.title}</h2>
                <strong>{voucher.code}</strong>
                <p>{voucher.recipient || voucher.customerName} · {voucher.customerEmail}</p>
                <small>Valido fino al {new Date(voucher.validUntil).toLocaleDateString("it-IT")}</small>
              </div>
              <button type="button" disabled={voucher.status !== "pagato"} onClick={() => redeemVoucher(voucher)}>
                {voucher.status === "pagato" ? "Segna come utilizzato" : `Voucher ${voucher.status}`}
              </button>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
