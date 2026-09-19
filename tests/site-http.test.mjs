import assert from "node:assert/strict";
import test from "node:test";
import { withNextServer } from "./start-next.mjs";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

const pages = [
  ["terra", "Rituale della Terra", 147, 120],
  ["luna", "Rituale della Luna", 135, 90],
  ["rosa", "Rituale della Rosa", 125, 120],
  ["surya", "Rituale Surya", 137, 90],
  ["luce-ambra", "Luce d’Ambra", 137, 120],
];

test("production Next.js server renders pages and Hostinger runtime routes", async () => {
  await withNextServer(async (base) => {
    const home = await fetch(`${base}/`, { headers: { accept: "text/html" } });
    assert.equal(home.status, 200);
    assert.match(home.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.equal(home.headers.get("x-frame-options"), "DENY");
    assert.equal(home.headers.get("x-content-type-options"), "nosniff");
    const html = await home.text();
    assert.doesNotMatch(html, developmentPreviewMeta);
    assert.match(html, /<html lang="it"/i);

    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { ok: true });

    const cron = await fetch(`${base}/api/cron`);
    assert.ok([401, 503].includes(cron.status), `cron status ${cron.status}`);

    const gift = await fetch(`${base}/gift-card`, { headers: { accept: "text/html" } });
    assert.equal(gift.status, 200);
    assert.match(await gift.text(), /Gift Card/i);

    const privacy = await fetch(`${base}/privacy`, { headers: { accept: "text/html" } });
    assert.equal(privacy.status, 200);
    const privacyHtml = await privacy.text();
    assert.match(privacyHtml, /Hostinger per hosting e database MySQL/);
    assert.doesNotMatch(privacyHtml, /Cloudflare per hosting/);
    assert.doesNotMatch(privacyHtml, /database D1/);

    const about = await fetch(`${base}/chi-siamo`, { headers: { accept: "text/html" } });
    assert.equal(about.status, 200);

    const mode = await fetch(`${base}/api/payments/mode`);
    assert.equal(mode.status, 200);
    assert.ok(["test", "unset"].includes((await mode.json()).mode));

    for (const [slug, title, price, minutes] of pages) {
      const response = await fetch(`${base}/esperienze/${slug}`, { headers: { accept: "text/html" } });
      assert.equal(response.status, 200, slug);
      const page = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<!--[^]*?-->/g, "");
      assert.ok(page.includes(title), slug);
      assert.ok(page.includes(`${minutes} min`), slug);
      assert.ok(page.includes(String(price)), slug);
      assert.ok(!page.includes("Valori provvisori"), slug);
    }
  });
});
