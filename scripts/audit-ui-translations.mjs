import ts from "typescript";
import { readFileSync } from "node:fs";
const files = process.argv.slice(2);
const entries = new Set();
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
console.log(JSON.stringify([...entries],null,2));
