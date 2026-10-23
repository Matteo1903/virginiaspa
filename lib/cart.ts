import { checkoutCatalog } from "./catalog";
import { getGiftRitual, giftRitualDetail } from "./gift";
import type { Language } from "../app/i18n";

export const CART_STORAGE_KEY = "virginia-spa-cart";

export type StoredCartItem = {
  id: string;
  title: string;
  detail: string;
  price: number;
  quantity: number;
  gift?: { to: string; from: string; message: string; delivery: string; ritualId?: string };
};

export function readStoredCart(): StoredCartItem[] {
  try {
    const value = localStorage.getItem(CART_STORAGE_KEY);
    const items = value ? JSON.parse(value) : [];
    if (!Array.isArray(items)) return [];
    const storedLanguage = localStorage.getItem("virginia-language") || "it";
    const language = (["it", "en", "es", "fr", "de"].includes(storedLanguage) ? storedLanguage : "it") as Language;
    return items.filter((item: StoredCartItem) => item.gift?.ritualId ? Boolean(getGiftRitual(item.gift.ritualId)) : checkoutCatalog[item.id]?.available !== false).map((item: StoredCartItem) => {
      const product = item.gift?.ritualId ? getGiftRitual(item.gift.ritualId) : checkoutCatalog[item.id];
      if (!product) return item;
      return {
        ...item,
        title: product.titles?.[language as keyof NonNullable<typeof product.titles>] || product.title,
        price: product.unitAmount / 100,
        detail: item.gift?.ritualId ? giftRitualDetail(product.duration, item.gift.to, language) : product.duration,
      };
    });
  } catch {
    return [];
  }
}

export function writeStoredCart(items: StoredCartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
