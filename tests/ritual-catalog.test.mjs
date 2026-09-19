import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

// Load the small catalog modules without a server or a payment provider.
const modules = new Map();
async function loadSource(relativePath) {
  if (modules.has(relativePath)) return modules.get(relativePath);
  const filename = new URL(relativePath, import.meta.url);
  let source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  for (const match of [...source.matchAll(/from "([^"]+)"/g)]) {
    const dependency = new URL(match[1] + ".ts", filename);
    const dependencyModule = await loadSource(dependency.href);
    source = source.replace(match[0], 'from "' + dependencyModule.url + '"');
  }
  const url = "data:text/javascript;base64," + Buffer.from(source).toString("base64");
  const result = { url, exports: await import(url) };
  modules.set(relativePath, result);
  return result;
}

const { checkoutCatalog } = (await loadSource("../lib/catalog.ts")).exports;
const { ritualExperiences } = (await loadSource("../app/ritual-experiences.ts")).exports;
const { readStoredCart, CART_STORAGE_KEY } = (await loadSource("../lib/cart.ts")).exports;

const definitive = [
  ["terra", "Rituale della Terra", 147, 120],
  ["luna", "Rituale della Luna", 135, 90],
  ["rosa", "Rituale della Rosa", 125, 120],
  ["surya", "Rituale Surya", 137, 90],
  ["luce-ambra", "Luce d’Ambra", 137, 120],
];

test("PDF prices and durations agree across pages, languages and checkout", () => {
  for (const [slug, title, price, minutes] of definitive) {
    const ritual = ritualExperiences.find((item) => item.slug === slug);
    const product = checkoutCatalog[ritual.productId];
    assert.equal(ritual.locales.it.title, title);
    assert.equal(ritual.price, price);
    assert.equal(ritual.duration, minutes);
    assert.equal(product.unitAmount, price * 100);
    assert.equal(product.duration, minutes + " min");
    assert.equal(product.confirmed, true);
    assert.deepEqual(Object.keys(ritual.locales).sort(), ["de", "en", "es", "fr", "it"]);
    for (const [language, copy] of Object.entries(ritual.locales)) {
      assert.equal(copy.title, product.titles[language]);
      assert.equal(copy.blocks.length, ritual.locales.it.blocks.length);
      assert.ok(copy.intro.length > 0);
      assert.ok(copy.blocks.every((block) => block.title.length > 0));
    }
  }
  assert.equal(checkoutCatalog["cielo-terra"].unitAmount, 11000);
  assert.notEqual(checkoutCatalog["cielo-terra"].confirmed, true);
});

test("saved carts adopt the final list without losing quantities or gift details", () => {
  const gift = { id: "gift-123", title: "Gift Card", price: 100, quantity: 1, detail: "Per Anna", gift: { to: "Anna", from: "Marco", message: "Auguri", delivery: "now" } };
  const headSpa = { id: "cielo-terra", title: "Cielo & Terra", detail: "75 min", price: 110, quantity: 1 };
  const stored = [
    { id: "rituale-luce-ambra", title: "Rituale Luce d’Ambra", price: 130, detail: "100 min", quantity: 2 },
    { id: "rituale-rosa", title: "Rituale della Rosa", price: 110, detail: "90 min", quantity: 3 },
    gift, headSpa,
  ];
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
    getItem(key) { return key === CART_STORAGE_KEY ? JSON.stringify(stored) : "fr"; },
  } });
  try {
    const cart = readStoredCart();
    assert.deepEqual(cart[0], { ...stored[0], title: "Lumière d’Ambre", price: 137, detail: "120 min" });
    assert.deepEqual(cart[1], { ...stored[1], title: "Rituel de la Rose", price: 125, detail: "120 min" });
    assert.deepEqual(cart.slice(2), [gift, { ...headSpa, title: "Ciel & Terre" }]);
    assert.equal(cart.reduce((sum, item) => sum + item.quantity * item.price, 0), 859);
  } finally {
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else delete globalThis.localStorage;
  }
});
