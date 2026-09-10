import { checkoutCatalog } from "./catalog";

export const CART_STORAGE_KEY = "virginia-spa-cart";

export type StoredCartItem = {
  id: string;
  title: string;
  detail: string;
  price: number;
  quantity: number;
  gift?: { to: string; from: string; message: string; delivery: string };
};

export function readStoredCart(): StoredCartItem[] {
  try {
    const value = localStorage.getItem(CART_STORAGE_KEY);
    const items = value ? JSON.parse(value) : [];
    if (!Array.isArray(items)) return [];
    const language = localStorage.getItem("virginia-language") || "it";
    return items.map((item: StoredCartItem) => {
      const product = checkoutCatalog[item.id];
      if (!product) return item;
      return {
        ...item,
        title: product.titles?.[language as keyof NonNullable<typeof product.titles>] || product.title,
        price: product.unitAmount / 100,
        detail: product.duration,
      };
    });
  } catch {
    return [];
  }
}

export function writeStoredCart(items: StoredCartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
