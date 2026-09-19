import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const filename = new URL("../lib/db-errors.ts", import.meta.url);
const source = ts.transpileModule(readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { isDuplicateKeyError } = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));

test("detects MySQL duplicate-key errors", () => {
  assert.equal(isDuplicateKeyError({ code: "ER_DUP_ENTRY", errno: 1062 }), true);
  assert.equal(isDuplicateKeyError(new Error("UNIQUE constraint failed")), true);
  assert.equal(isDuplicateKeyError({ cause: { errno: 1062 } }), true);
  assert.equal(isDuplicateKeyError(new Error("connection refused")), false);
  assert.equal(isDuplicateKeyError(null), false);
});
