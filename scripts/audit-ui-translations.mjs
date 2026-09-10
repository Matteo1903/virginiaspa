import ts from "typescript";
import { readFileSync } from "node:fs";
const publicUiFiles = [
  "app/home-page.tsx", "app/head-spa/head-spa-page.tsx", "app/gift-card/gift-card-page.tsx",
  "app/chi-siamo/about-page.tsx", "app/ritual-experience-page.tsx", "app/checkout/success/success-page.tsx",
  "app/site-chrome.tsx", "app/commerce.tsx", "app/purchase-notice.tsx", "app/legal-consent.tsx",
  "app/privacy/page.tsx", "app/cookie/page.tsx", "app/termini/page.tsx", "app/cookie-notice.tsx",
  "app/legal-shell.tsx", "app/language-picker.tsx", "app/cart-context.tsx",
];
const requestedFiles = process.argv.slice(2);
const files = requestedFiles.length ? requestedFiles : publicUiFiles;
const entries = new Set();
const translated = new Set();
const i18nSource = ts.createSourceFile("app/i18n.ts", readFileSync("app/i18n.ts", "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
function collectTranslations(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(i18nSource) === "entries" && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
    for (const element of node.initializer.elements) {
      if (ts.isArrayLiteralExpression(element) && element.elements[0] && ts.isStringLiteral(element.elements[0])) translated.add(element.elements[0].text.replace(/\s+/g, " ").trim());
    }
  }
  ts.forEachChild(node, collectTranslations);
}
collectTranslations(i18nSource);
for (const file of files) {
  const source = ts.createSourceFile(file, readFileSync(file,"utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node) {
    if (ts.isJsxText(node) || ts.isStringLiteral(node) && ts.isJsxAttribute(node.parent)) {
      if (ts.isStringLiteral(node) && !["title","placeholder","aria-label","alt"].includes(node.parent.name.text)) return;
      const value = node.text.replace(/\s+/g," ").trim();
      if (/[a-zA-ZÀ-ÿ]/.test(value)) entries.add(value);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
const brandOrNeutral = /^(?:V|×|min|Virginia|SPA|HEAD|HEAD SPA|Email|Instagram|Stripe|garanteprivacy\.it)(?:\s|$|\s*·)/;
function isCovered(rawValue) {
  const value = rawValue.replaceAll("&amp;", "&");
  if (translated.has(value) || brandOrNeutral.test(value)) return true;
  const indexed = value.match(/^\d{2}\s*·\s*(.+)$/);
  if (indexed) return isCovered(indexed[1]);
  const decorated = value.match(/^(.+?)\s*[↑↓→↗]$/);
  if (decorated) return isCovered(decorated[1]);
  return false;
}
const missing = [...entries].filter((value) => !isCovered(value));
console.log(JSON.stringify(missing, null, 2));
if (missing.length) process.exitCode = 1;
