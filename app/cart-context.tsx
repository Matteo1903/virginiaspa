"use client";

import { FormEvent, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { translate, type Language } from "./i18n";
import { useSiteLanguage } from "./use-site-language";
import { PurchaseNotice } from "./purchase-notice";
import { LegalConsent } from "./legal-consent";
import { readStoredCart, writeStoredCart, type StoredCartItem } from "../lib/cart";

const locales: Record<Language, string> = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" };

type CartContextValue = {
  items: StoredCartItem[];
  count: number;
  open: boolean;
  addItem: (item: StoredCartItem) => void;
  updateQuantity: (id: string, change: -1 | 1) => void;
  removeItem: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [language] = useSiteLanguage();
  const pathname = usePathname();
  const [items, setItems] = useState<StoredCartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setItems(readStoredCart());
      if (new URLSearchParams(window.location.search).get("cart") === "open") setOpen(true);
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (ready) setItems(readStoredCart());
  }, [language, ready]);

  const addItem = useCallback((item: StoredCartItem) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      const next = existing
        ? current.map((entry) => entry.id === item.id ? { ...entry, ...item, quantity: Math.min(10, entry.quantity + item.quantity) } : entry)
        : [...current, item];
      writeStoredCart(next);
      return next;
    });
    setStageCart();
    setOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, change: -1 | 1) => {
    setItems((current) => {
      const next = current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(10, item.quantity + change)) } : item);
      writeStoredCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => {
      const next = current.filter((item) => item.id !== id);
      writeStoredCart(next);
      return next;
    });
  }, []);

  const openCart = useCallback(() => {
    setStageCart();
    setOpen(true);
  }, []);

  const closeCart = useCallback(() => setOpen(false), []);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const publicSite = !pathname?.startsWith("/staff");

  return (
    <CartContext.Provider value={{ items, count, open, addItem, updateQuantity, removeItem, openCart, closeCart }}>
      {children}
      {publicSite && <CartDrawer language={language} />}
    </CartContext.Provider>
  );
}

let setStageCart = () => undefined as void;

function CartDrawer({ language }: { language: Language }) {
  const { items, open, updateQuantity, removeItem, closeCart } = useCart();
  const [stage, setStage] = useState<"cart" | "checkout">("cart");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const drawerRef = useRef<HTMLElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const euro = useMemo(() => new Intl.NumberFormat(locales[language], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }), [language]);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  setStageCart = () => setStage("cart");

  useEffect(() => {
    if (!open) {
      setLoading(false);
      return;
    }
    lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const drawer = drawerRef.current;
    const focusables = () => [...(drawer?.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])") || [])].filter((node) => !node.hasAttribute("disabled"));
    const frame = requestAnimationFrame(() => (focusables()[0] || drawer)?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCart();
        return;
      }
      if (event.key !== "Tab" || !drawer) return;
      const nodes = focusables();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.classList.add("modal-lock");
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.classList.remove("modal-lock");
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus();
    };
  }, [open, closeCart, stage]);

  const checkout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          language,
          items,
          acceptedTerms: form.get("acceptedTerms") === "on",
        }),
      });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || translate("Non è stato possibile avviare il pagamento. Riprova tra poco.", language));
      window.location.assign(data.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : translate("Non è stato possibile avviare il pagamento. Riprova tra poco.", language));
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="commerce-backdrop" onMouseDown={closeCart}>
      <aside
        ref={drawerRef}
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="commerce-close" type="button" onClick={closeCart} aria-label={translate("Chiudi", language)}>×</button>
        {stage === "cart" ? <>
          <p className="section-index">{translate("Virginia SPA Shop", language)}</p>
          <h2 id="cart-title">{translate("Carrello", language)}</h2>
          <PurchaseNotice language={language} />
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2 11h10l2-7H7M9 20h.01M17 20h.01" /></svg>
              <p>{translate("Il tuo carrello è ancora vuoto.", language)}</p>
            </div>
          ) : (
            <>
              <div className="cart-items">{items.map((item) => (
                <article key={item.id}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                    <div className="cart-item-actions">
                      <div className="quantity-stepper" aria-label={`${translate("Quantità", language)}: ${item.title}`}>
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity === 1} aria-label={`${translate("Riduci quantità", language)}: ${item.title}`}>−</button>
                        <output aria-live="polite">{item.quantity}</output>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity === 10} aria-label={`${translate("Aumenta quantità", language)}: ${item.title}`}>+</button>
                      </div>
                      <button className="cart-remove" type="button" onClick={() => removeItem(item.id)}>{translate("Rimuovi", language)}</button>
                    </div>
                  </div>
                  <strong>{euro.format(item.price * item.quantity)}</strong>
                </article>
              ))}</div>
              <div className="cart-total"><span>{translate("Totale", language)}</span><strong>{euro.format(total)}</strong></div>
              <button className="button button-primary commerce-primary" type="button" onClick={() => setStage("checkout")}>{translate("Vai al checkout", language)}<span>→</span></button>
            </>
          )}
        </> : (
          <form className="checkout-form" onSubmit={checkout}>
            <p className="section-index">{translate("Checkout sicuro · Stripe", language)}</p>
            <h2 id="cart-title">{translate("Completa l’ordine", language)}</h2>
            <PurchaseNotice language={language} />
            <fieldset>
              <legend>{translate("I tuoi dati", language)}</legend>
              <label>{translate("Nome e cognome", language)}<input name="name" required autoComplete="name" maxLength={120} /></label>
              <label>{translate("Email", language)}<input name="email" required type="email" autoComplete="email" maxLength={254} /></label>
              <label>{translate("Telefono", language)}<input name="phone" required type="tel" autoComplete="tel" maxLength={40} /></label>
            </fieldset>
            <label className="privacy-check"><input name="acceptedTerms" type="checkbox" required /><LegalConsent language={language} /></label>
            <p className="demo-payment"><span>✓</span>{translate("Il pagamento avviene sulla pagina protetta di Stripe. I dati della carta non transitano su questo sito.", language)}</p>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <div className="checkout-summary"><span>{translate("Totale", language)}</span><strong>{euro.format(total)}</strong></div>
            <button className="button button-primary commerce-primary" type="submit" disabled={loading}>{loading ? translate("Reindirizzamento a Stripe…", language) : translate("Continua con Stripe", language)}<span>→</span></button>
          </form>
        )}
      </aside>
    </div>
  );
}

export function CartButton({ className = "" }: { className?: string }) {
  const [language] = useSiteLanguage();
  const { count, openCart } = useCart();
  const label = translate("Carrello", language);
  return (
    <button className={`cart-trigger header-cart ${className}`.trim()} type="button" onClick={openCart} aria-label={`${label}: ${count}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2 11h10l2-7H7M9 20h.01M17 20h.01" /></svg>
      <span>{label}</span>
      <i>{count}</i>
    </button>
  );
}
