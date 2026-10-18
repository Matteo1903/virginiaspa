import type { Language } from "../app/i18n";
import { allowedGiftAmounts, checkoutCatalog } from "./catalog";
import { writeStoredCart } from "./cart";
import { purchaseCopy } from "./purchase";

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "1";

type VoucherStatus = "pagato" | "utilizzato" | "rimborsato" | "scaduto";

export type DemoVoucher = {
  id: string;
  code: string;
  title: string;
  status: VoucherStatus;
  validUntil: string;
  usedAt: string | null;
  recipient: string | null;
  message: string | null;
  amount: number;
  claimToken: string;
  customerName: string;
  customerEmail: string;
  language: Language;
};

export type DemoOrder = {
  sessionId: string;
  status: "in_attesa" | "pagato";
  customerName: string;
  customerEmail: string;
  language: Language;
  totalCents: number;
  lines: { title: string; quantity: number; amountCents: number }[];
  vouchers: DemoVoucher[];
};

type DemoStore = { seeds: DemoVoucher[]; orders: DemoOrder[] };

const STORAGE_KEY = "virginia-demo-v1";
const languages = ["it", "en", "es", "fr", "de"] as const;

const checkoutErrors: Record<Language, { incomplete: string; invalid: string; terms: string; unavailable: string }> = {
  it: { incomplete: "Dati del checkout incompleti.", invalid: "Dati del checkout non validi.", terms: "Per procedere accetta privacy e termini.", unavailable: "Checkout non disponibile." },
  en: { incomplete: "Checkout details are incomplete.", invalid: "Checkout details are invalid.", terms: "Please accept the privacy notice and terms to continue.", unavailable: "Checkout is currently unavailable." },
  es: { incomplete: "Los datos del pago están incompletos.", invalid: "Los datos del pago no son válidos.", terms: "Acepta la política de privacidad y las condiciones para continuar.", unavailable: "El pago no está disponible en este momento." },
  fr: { incomplete: "Les informations de paiement sont incomplètes.", invalid: "Les informations de paiement ne sont pas valides.", terms: "Veuillez accepter la politique de confidentialité et les conditions pour continuer.", unavailable: "Le paiement est actuellement indisponible." },
  de: { incomplete: "Die Angaben für den Bezahlvorgang sind unvollständig.", invalid: "Die Angaben für den Bezahlvorgang sind ungültig.", terms: "Bitte akzeptiere die Datenschutzerklärung und die Bedingungen, um fortzufahren.", unavailable: "Der Bezahlvorgang ist derzeit nicht verfügbar." },
};

const hex = (bytes: number) => {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return [...data].map((value) => value.toString(16).padStart(2, "0")).join("");
};

const cap = (value: string, max: number) => value.slice(0, max);

const languageOf = (value: unknown): Language => (languages.includes(value as Language) ? value as Language : "it");

const yearFromNow = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString();
};

const seedVouchers = (): DemoVoucher[] => {
  const validUntil = yearFromNow();
  return [
    {
      id: "seed-terra",
      code: "VS-DEMOTERRA01",
      title: "Rituale della Terra",
      status: "pagato",
      validUntil,
      usedAt: null,
      recipient: null,
      message: null,
      amount: 14700,
      claimToken: "a1b2c3d4e5f60718293a4b5c6d7e8f01",
      customerName: "Giulia Bianchi",
      customerEmail: "giulia.bianchi@email.it",
      language: "it",
    },
    {
      id: "seed-carezza",
      code: "VS-DEMOCAREZZA",
      title: "Carezza",
      status: "utilizzato",
      validUntil,
      usedAt: "2026-09-12T10:30:00.000Z",
      recipient: null,
      message: null,
      amount: 9000,
      claimToken: "b1b2c3d4e5f60718293a4b5c6d7e8f02",
      customerName: "Luca Romano",
      customerEmail: "luca.romano@email.it",
      language: "it",
    },
    {
      id: "seed-gift",
      code: "VS-DEMOGIFT150",
      title: "Virginia SPA Gift Card",
      status: "pagato",
      validUntil,
      usedAt: null,
      recipient: "Elena Rossi",
      message: "Per il tuo compleanno.",
      amount: 15000,
      claimToken: "c1b2c3d4e5f60718293a4b5c6d7e8f03",
      customerName: "Marco Verdi",
      customerEmail: "marco.verdi@email.it",
      language: "it",
    },
  ];
};

const loadStore = (): DemoStore => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = { seeds: seedVouchers(), orders: [] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as DemoStore;
    if (!Array.isArray(parsed.seeds) || !Array.isArray(parsed.orders)) throw new Error("store");
    return parsed;
  } catch {
    const initial = { seeds: seedVouchers(), orders: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
};

const saveStore = (store: DemoStore) => localStorage.setItem(STORAGE_KEY, JSON.stringify(store));

const allVouchers = (store: DemoStore) => [
  ...store.orders.filter((order) => order.status === "pagato").flatMap((order) => order.vouchers),
  ...store.seeds,
];

export const readDemoOrder = (sessionId: string) => loadStore().orders.find((order) => order.sessionId === sessionId) || null;

export const confirmDemoPayment = (sessionId: string) => {
  const store = loadStore();
  const order = store.orders.find((entry) => entry.sessionId === sessionId);
  if (!order) return false;
  order.status = "pagato";
  saveStore(store);
  sessionStorage.removeItem(`virginia-demo-poll:${sessionId}`);
  writeStoredCart([]);
  return true;
};

const publicVoucher = (voucher: DemoVoucher) => ({
  title: voucher.title,
  code: voucher.code,
  claimToken: voucher.claimToken,
  status: voucher.status,
  validUntil: voucher.validUntil,
});

const staffVoucher = (voucher: DemoVoucher) => ({
  id: voucher.id,
  code: voucher.code,
  title: voucher.title,
  status: voucher.status,
  validUntil: voucher.validUntil,
  usedAt: voucher.usedAt,
  recipient: voucher.recipient,
  customerName: voucher.customerName,
  customerEmail: voucher.customerEmail,
});

const bearer = (init?: RequestInit) => {
  const header = new Headers(init?.headers).get("authorization") || "";
  return header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
};

const readJson = (init?: RequestInit) => {
  if (typeof init?.body !== "string" || !init.body) return {};
  return JSON.parse(init.body) as Record<string, unknown>;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type CheckoutPayload = {
  name?: string;
  email?: string;
  phone?: string;
  language?: string;
  acceptedTerms?: boolean;
  items?: { id?: string; quantity?: number; price?: number; title?: string; gift?: { to?: string; from?: string; message?: string } }[];
};

const createOrder = (payload: CheckoutPayload) => {
  const language = languageOf(payload.language);
  const errors = checkoutErrors[language];
  const name = cap(payload.name?.trim() ?? "", 120);
  const email = cap(payload.email?.trim().toLowerCase() ?? "", 254);
  const phone = cap(payload.phone?.trim() ?? "", 40);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 5 || !payload.items?.length) {
    return Response.json({ error: errors.incomplete }, { status: 400 });
  }
  if (!payload.acceptedTerms) return Response.json({ error: errors.terms }, { status: 400 });

  const lines: DemoOrder["lines"] = [];
  const vouchers: DemoVoucher[] = [];
  const validUntil = yearFromNow();
  for (const item of payload.items) {
    const quantity = Math.max(1, Math.min(10, Math.floor(item.quantity || 1)));
    let title = "";
    let unitAmount = 0;
    let recipient: string | null = null;
    let message: string | null = null;
    if (item.gift) {
      unitAmount = Math.round(Number(item.price) * 100);
      if (!allowedGiftAmounts.has(unitAmount)) return Response.json({ error: errors.invalid }, { status: 400 });
      title = cap(item.title?.trim() || "Virginia SPA Gift Card", 120);
      recipient = cap(item.gift.to?.trim() || "", 80) || null;
      message = cap(item.gift.message?.trim() || "", 400) || null;
    } else {
      const product = item.id ? checkoutCatalog[item.id] : undefined;
      if (!product) return Response.json({ error: errors.invalid }, { status: 400 });
      title = product.titles?.[language] || product.title;
      unitAmount = product.unitAmount;
    }
    lines.push({ title, quantity, amountCents: unitAmount * quantity });
    for (let count = 0; count < quantity; count += 1) {
      vouchers.push({
        id: hex(16),
        code: `VS-${hex(6).toUpperCase()}`,
        title,
        status: "pagato",
        validUntil,
        usedAt: null,
        recipient,
        message,
        amount: unitAmount,
        claimToken: hex(16),
        customerName: name,
        customerEmail: email,
        language,
      });
    }
  }

  const sessionId = `cs_demo_${hex(12)}`;
  const order: DemoOrder = {
    sessionId,
    status: "in_attesa",
    customerName: name,
    customerEmail: email,
    language,
    totalCents: lines.reduce((sum, line) => sum + line.amountCents, 0),
    lines,
    vouchers,
  };
  const store = loadStore();
  store.orders.unshift(order);
  saveStore(store);
  return Response.json({ url: `/checkout/demo?session_id=${encodeURIComponent(sessionId)}` });
};

const orderStatus = (sessionId: string) => {
  const order = readDemoOrder(sessionId);
  if (!order || order.status !== "pagato") return Response.json({ status: "in_attesa", vouchers: [] });
  const key = `virginia-demo-poll:${sessionId}`;
  const seen = Number(sessionStorage.getItem(key) || "0");
  if (seen < 1) {
    sessionStorage.setItem(key, "1");
    return Response.json({ status: "in_attesa", vouchers: [] });
  }
  return Response.json({ status: "pagato", vouchers: order.vouchers.map(publicVoucher) });
};

const staffList = (url: URL, init?: RequestInit) => {
  if (!bearer(init)) return Response.json({ error: "Inserisci una chiave. In questa anteprima va bene demo." }, { status: 401 });
  const query = (url.searchParams.get("q") || "").trim().toLowerCase().slice(0, 80);
  const rows = allVouchers(loadStore()).filter((voucher) => {
    if (!query) return true;
    return [voucher.code, voucher.title, voucher.customerEmail, voucher.customerName, voucher.recipient || ""].join(" ").toLowerCase().includes(query);
  }).slice(0, 100).map(staffVoucher);
  return Response.json({ vouchers: rows });
};

const staffRedeem = (id: string, init?: RequestInit) => {
  if (!bearer(init)) return Response.json({ error: "Inserisci una chiave. In questa anteprima va bene demo." }, { status: 401 });
  const store = loadStore();
  const voucher = allVouchers(store).find((entry) => entry.id === id);
  if (!voucher) return Response.json({ error: "Voucher non trovato" }, { status: 404 });
  if (voucher.status !== "pagato") return Response.json({ error: "Il voucher non è utilizzabile." }, { status: 409 });
  voucher.status = "utilizzato";
  voucher.usedAt = new Date().toISOString();
  saveStore(store);
  return Response.json({ ok: true });
};

const contactResponse = async (init?: RequestInit) => {
  await wait(400);
  try {
    const payload = readJson(init);
    const language = languageOf(payload.language);
    const name = String(payload.name || "").trim();
    const email = String(payload.email || "").trim();
    const phone = String(payload.phone || "").trim();
    const message = String(payload.message || "").trim();
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 5 || message.length < 10) {
      const incomplete = { it: "Dati di contatto incompleti.", en: "The contact details are incomplete.", es: "Los datos de contacto están incompletos.", fr: "Les coordonnées sont incomplètes.", de: "Die Kontaktdaten sind unvollständig." };
      return Response.json({ error: incomplete[language] }, { status: 400 });
    }
    if (!payload.privacyAccepted) {
      const privacy = { it: "Per inviare accetta l’informativa privacy.", en: "Please accept the privacy notice to send the message.", es: "Acepta la política de privacidad para enviar el mensaje.", fr: "Veuillez accepter la politique de confidentialité pour envoyer le message.", de: "Bitte akzeptiere die Datenschutzerklärung, um die Nachricht zu senden." };
      return Response.json({ error: privacy[language] }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Invio non disponibile. Contatta direttamente la SPA." }, { status: 400 });
  }
};

const reviewResponse = async (init?: RequestInit) => {
  await wait(400);
  try {
    const payload = readJson(init);
    if (String(payload.website || "").trim()) return Response.json({ ok: true });
    const language = languageOf(payload.language);
    const name = String(payload.name || "").trim();
    const email = String(payload.email || "").trim();
    const message = String(payload.message || "").trim();
    const rating = Number(payload.rating);
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || !Number.isInteger(rating) || rating < 1 || rating > 5 || message.length < 20) {
      const incomplete = { it: "Completa tutti i dati della recensione e scegli una valutazione.", en: "Complete all review details and choose a rating.", es: "Completa todos los datos de la reseña y elige una valoración.", fr: "Complétez toutes les informations de l’avis et choisissez une note.", de: "Vervollständige alle Angaben und wähle eine Bewertung aus." };
      return Response.json({ error: incomplete[language] }, { status: 400 });
    }
    if (!payload.privacyAccepted) {
      const privacy = { it: "Per inviare accetta l’informativa privacy.", en: "Please accept the privacy notice to submit your review.", es: "Acepta la política de privacidad para enviar tu reseña.", fr: "Veuillez accepter la politique de confidentialité pour envoyer votre avis.", de: "Bitte akzeptiere die Datenschutzerklärung, um deine Bewertung zu senden." };
      return Response.json({ error: privacy[language] }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Invio non disponibile. Riprova più tardi." }, { status: 400 });
  }
};

const escapeXml = (value: string | null) => (value || "").replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[char] || char));

const voucherSvg = (voucher: DemoVoucher) => {
  const labels = {
    it: { digital: "VOUCHER DIGITALE", fallback: "Un tempo solo tuo." },
    en: { digital: "DIGITAL VOUCHER", fallback: "Time just for you." },
    es: { digital: "BONO DIGITAL", fallback: "Un tiempo solo para ti." },
    fr: { digital: "BON NUMÉRIQUE", fallback: "Un moment rien que pour vous." },
    de: { digital: "DIGITALER GUTSCHEIN", fallback: "Zeit nur für dich." },
  }[voucher.language];
  const locale = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" }[voucher.language];
  const amount = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(voucher.amount / 100);
  const validUntil = new Date(voucher.validUntil).toLocaleDateString(locale);
  const note = purchaseCopy[voucher.language].svgNote;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700"><rect width="1200" height="700" fill="#f5f0e7"/><rect x="34" y="34" width="1132" height="632" rx="36" fill="none" stroke="#b86145" stroke-width="2"/><circle cx="1020" cy="150" r="190" fill="#aab6a2" opacity=".32"/><text x="90" y="115" font-family="Georgia,serif" font-size="54" fill="#28382f">Virginia SPA</text><text x="90" y="200" font-family="Arial,sans-serif" font-size="18" letter-spacing="5" fill="#b86145">${escapeXml(labels.digital)}</text><text x="90" y="315" font-family="Georgia,serif" font-size="58" fill="#28382f">${escapeXml(voucher.title)}</text><text x="90" y="390" font-family="Georgia,serif" font-size="26" fill="#503044">${escapeXml(voucher.message || labels.fallback)}</text><text x="90" y="490" font-family="Arial,sans-serif" font-size="20" fill="#697169">${escapeXml(voucher.code)}</text><text x="90" y="540" font-family="Arial,sans-serif" font-size="18" fill="#697169">${amount} · ${escapeXml(validUntil)}</text><text x="90" y="635" font-family="Arial,sans-serif" font-size="15" fill="#b86145">${escapeXml(note)}</text></svg>`;
};

const downloadVoucher = (token: string) => {
  const voucher = allVouchers(loadStore()).find((entry) => entry.claimToken.toLowerCase() === token.toLowerCase());
  if (!voucher || voucher.status === "rimborsato" || voucher.status === "scaduto") return false;
  const blob = new Blob([voucherSvg(voucher)], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `Virginia-SPA-${voucher.code}.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
  return true;
};

const onVoucherClick = (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const anchor = target.closest("a");
  const href = anchor?.getAttribute("href") || "";
  const match = href.match(/^\/api\/vouchers\/([a-f0-9]{32})$/i);
  if (!match) return;
  if (!downloadVoucher(match[1])) return;
  event.preventDefault();
};

export async function handleDemoRequest(url: URL, init?: RequestInit) {
  const path = url.pathname;
  const method = (init?.method || "GET").toUpperCase();
  if (path === "/api/payments/mode" && method === "GET") return Response.json({ mode: "demo" });
  if (path === "/api/checkout" && method === "POST") {
    await wait(450);
    try {
      return createOrder(readJson(init) as CheckoutPayload);
    } catch {
      return Response.json({ error: checkoutErrors.it.unavailable }, { status: 400 });
    }
  }
  if (path === "/api/orders/access" && method === "POST") return Response.json({ status: "pagato" });
  if (path === "/api/orders/status" && method === "GET") return orderStatus(url.searchParams.get("session_id") || "");
  if (path === "/api/staff/vouchers" && method === "GET") {
    await wait(280);
    return staffList(url, init);
  }
  const redeem = path.match(/^\/api\/staff\/vouchers\/([^/]+)\/use$/);
  if (redeem && method === "POST") return staffRedeem(decodeURIComponent(redeem[1]), init);
  if (path === "/api/contact" && method === "POST") return contactResponse(init);
  if (path === "/api/reviews" && method === "POST") return reviewResponse(init);
  return Response.json({ error: "Non disponibile in anteprima." }, { status: 404 });
}

export function installDemoFetch() {
  if (typeof window === "undefined") return;
  const host = window as Window & { __virginiaDemo?: boolean };
  if (host.__virginiaDemo) return;
  host.__virginiaDemo = true;
  const original = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const raw = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const url = new URL(raw, window.location.origin);
    if (url.origin === window.location.origin && url.pathname.startsWith("/api/")) return handleDemoRequest(url, init);
    return original(input, init);
  };
  document.addEventListener("click", onVoucherClick, true);
}
