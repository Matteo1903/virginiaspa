import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const nextConfig = readFileSync(new URL("next.config.ts", root), "utf8");

test("package.json matches Hostinger Next.js Web App requirements", () => {
  assert.equal(pkg.scripts.build, "next build");
  assert.equal(pkg.scripts.start, "next start");
  assert.ok(pkg.engines?.node?.startsWith(">=20"));
  assert.equal(pkg.dependencies.next, "16.2.6");
  assert.equal(pkg.dependencies.mysql2, "3.24.4");
  assert.ok(pkg.dependencies.typescript);
  assert.ok(pkg.dependencies.tailwindcss);
  assert.ok(!pkg.dependencies.wrangler);
  assert.ok(!pkg.dependencies.vinext);
  assert.ok(!pkg.devDependencies?.wrangler);
});

test("next.config exports a mergeable object, not a function", () => {
  assert.match(nextConfig, /const nextConfig: NextConfig = \{/);
  assert.match(nextConfig, /export default nextConfig/);
  assert.doesNotMatch(nextConfig, /export default function/);
  assert.doesNotMatch(nextConfig, /export default \(phase/);
  assert.doesNotMatch(nextConfig, /output:\s*["']export["']/);
});

test("Cloudflare Workers artifacts are gone", () => {
  assert.equal(existsSync(new URL("wrangler.toml", root)), false);
  assert.equal(existsSync(new URL("vite.config.ts", root)), false);
  assert.equal(existsSync(new URL("worker/index.ts", root)), false);
});
