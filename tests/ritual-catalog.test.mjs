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

const { checkoutCatalog, headSpaStartingPriceEuros } = (await loadSource("../lib/catalog.ts")).exports;
const { ritualExperiences } = (await loadSource("../app/ritual-experiences.ts")).exports;
const { readStoredCart, CART_STORAGE_KEY } = (await loadSource("../lib/cart.ts")).exports;
const { quizQuestions, recommendRitual } = (await loadSource("../lib/ritual-finder.ts")).exports;
const { languages, translate } = (await loadSource("../app/i18n.ts")).exports;

const definitive = [
  ["terra", "Rituale della Terra", 147, 120],
  ["luna", "Rituale della Luna", 135, 90],
  ["rosa", "Rituale della Rosa", 125, 120],
  ["surya", "Rituale Surya", 137, 90],
  ["luce-ambra", "Luce d’Ambra", 137, 120],
  ["ayurveda", "Percorso Ayurveda", 250, 180],
  ["peel-longevity", "Rituale Peel Longevity", 80, 60],
  ["longevity-muse", "Rituale Longevity Muse", 120, 90],
];

test("confirmed prices and durations agree across pages, languages and checkout", () => {
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
});

const confirmedHeadSpaPrices = [
  ["carezza", 90],
  ["cielo-terra", 90],
  ["wine-essence", 250],
  ["abbraccio-vita", 147],
  ["two-souls", 310],
];

test("HEAD SPA uses the confirmed prices and VINUM name in every language", () => {
  for (const [productId, price] of confirmedHeadSpaPrices) {
    assert.equal(checkoutCatalog[productId].unitAmount, price * 100, productId);
    assert.equal(checkoutCatalog[productId].confirmed, true, productId);
  }
  assert.equal(headSpaStartingPriceEuros, 90);
  assert.equal(checkoutCatalog["wine-essence"].title, "VINUM");
  for (const { code } of languages) assert.equal(checkoutCatalog["wine-essence"].titles[code], "VINUM");
});

test("existing HEAD SPA carts adopt VINUM and current prices without losing quantities", () => {
  const stored = confirmedHeadSpaPrices.map(([id], index) => ({
    id, title: id === "wine-essence" ? "Wine Essence" : "Old title", price: 1, detail: "Old duration", quantity: index + 1,
  }));
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  try {
    for (const { code } of languages) {
      Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
        getItem(key) { return key === CART_STORAGE_KEY ? JSON.stringify(stored) : code; },
      } });
      const cart = readStoredCart();
      assert.equal(cart.length, stored.length);
      for (let index = 0; index < cart.length; index++) {
        const [id, price] = confirmedHeadSpaPrices[index];
        assert.deepEqual(cart[index], { ...stored[index], title: checkoutCatalog[id].titles[code], price, detail: checkoutCatalog[id].duration });
      }
      assert.equal(cart[2].title, "VINUM");
    }
  } finally {
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else delete globalThis.localStorage;
  }
});

test("Ayurveda includes all seven rituals from the supplied photographs in every language", () => {
  const ayurveda = ritualExperiences.find((item) => item.slug === "ayurveda");
  for (const copy of Object.values(ayurveda.locales)) {
    assert.deepEqual(copy.blocks.map((block) => block.title), ["Nada Ananda", "Kadhi Vasti", "Urovasti", "Padma", "Pindasweda", "Kithzi", "Othadam"]);
    assert.ok(copy.blocks.every((block) => block.text.length > 0));
  }
});

test("Ritual Finder recommends the new experiences for their matching needs", () => {
  const scenarios = [
    [["Leggera e rilassata", "Tre ore di benessere", "Corpo e tensioni"], "percorso-ayurveda", "/esperienze/ayurveda", 250, "180 min"],
    [["Energica e tonica", "Tre ore di benessere", "Mente e respiro"], "percorso-ayurveda", "/esperienze/ayurveda", 250, "180 min"],
    [["Luminosa e rinnovata", "Un’ora tutta per me", "Pelle e luminosità"], "rituale-peel-longevity", "/esperienze/peel-longevity", 80, "60 min"],
    [["Leggera e rilassata", "Una pausa essenziale", "Pelle e longevità"], "rituale-peel-longevity", "/esperienze/peel-longevity", 80, "60 min"],
    [["Energica e tonica", "Un percorso completo", "Pelle e longevità"], "rituale-longevity-muse", "/esperienze/longevity-muse", 120, "90 min"],
    [["Luminosa e rinnovata", "Tre ore di benessere", "Pelle e longevità"], "rituale-longevity-muse", "/esperienze/longevity-muse", 120, "90 min"],
  ];
  for (const [answers, productId, href, price, duration] of scenarios) {
    for (const { code } of languages) {
      const recommendation = recommendRitual(answers, code);
      assert.equal(recommendation.productId, productId);
      assert.equal(recommendation.href, href);
      assert.equal(recommendation.price, price);
      assert.equal(recommendation.duration, duration);
      assert.equal(recommendation.title, checkoutCatalog[productId].titles[code]);
      assert.equal(recommendation.fromPrice, false);
      if (code !== "it") assert.notEqual(recommendation.copy, recommendRitual(answers).copy);
    }
  }
});

test("every catalog experience remains reachable and all Finder text is translated", () => {
  const reached = new Set();
  for (const feeling of quizQuestions[0].options) {
    for (const time of quizQuestions[1].options) {
      for (const focus of quizQuestions[2].options) {
        const answers = [feeling, time, focus];
        reached.add(recommendRitual(answers).href);
        for (const { code } of languages) {
          const recommendation = recommendRitual(answers, code);
          if (code !== "it") assert.notEqual(recommendation.copy, recommendRitual(answers).copy);
        }
      }
    }
  }
  assert.deepEqual([...reached].sort(), ["/head-spa", ...ritualExperiences.map(({ slug }) => `/esperienze/${slug}`)].sort());
  for (const { code } of languages.filter(({ code }) => code !== "it")) {
    for (const question of quizQuestions) {
      for (const text of [question.question, ...question.options]) {
        assert.notEqual(translate(text, code), text, `${code}: ${text}`);
      }
    }
  }
});

test("React development diagnostics can use eval while the production CSP blocks it", async () => {
  const { createContentSecurityPolicy, contentSecurityPolicy } = (await loadSource("../lib/security-headers.ts")).exports;
  assert.match(createContentSecurityPolicy(true), /script-src[^;]*'unsafe-eval'/);
  assert.doesNotMatch(createContentSecurityPolicy(false), /'unsafe-eval'/);
  assert.equal(contentSecurityPolicy, createContentSecurityPolicy(process.env.NODE_ENV === "development"));
  for (const development of [true, false]) {
    const policy = createContentSecurityPolicy(development);
    assert.ok(policy.includes("frame-ancestors 'none'"));
    assert.ok(policy.includes("form-action 'self' https://checkout.stripe.com"));
  }
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
    assert.deepEqual(cart.slice(2), [gift, { ...headSpa, title: "Ciel & Terre", price: 90 }]);
    assert.equal(cart.reduce((sum, item) => sum + item.quantity * item.price, 0), 839);
  } finally {
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else delete globalThis.localStorage;
  }
});
