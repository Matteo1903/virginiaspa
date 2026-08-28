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
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function writeStoredCart(items: StoredCartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
