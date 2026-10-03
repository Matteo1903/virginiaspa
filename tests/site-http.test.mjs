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
  ["ayurveda", "Percorso Ayurveda", 250, 180],
  ["peel-longevity", "Rituale Peel Longevity", 80, 60],
  ["longevity-muse", "Rituale Longevity Muse", 120, 90],
];

test("production Next.js server renders pages and Hostinger runtime routes", async () => {
  await withNextServer(async (base) => {
    const home = await fetch(`${base}/`, { headers: { accept: "text/html" } });
    assert.equal(home.status, 200);
    assert.match(home.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.equal(home.headers.get("x-frame-options"), "DENY");
    assert.equal(home.headers.get("x-content-type-options"), "nosniff");
    assert.doesNotMatch(home.headers.get("content-security-policy") ?? "", /'unsafe-eval'/);
    const html = await home.text();
    assert.doesNotMatch(html, developmentPreviewMeta);
    assert.match(html, /<html lang="it"/i);

    const headSpa = await fetch(`${base}/head-spa`, { headers: { accept: "text/html" } });
    assert.equal(headSpa.status, 200);
    const headSpaHtml = (await headSpa.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<!--[^]*?-->/g, "");
    assert.doesNotMatch(headSpaHtml, /Wine Essence|Durate e prezzi attualmente dimostrativi/);
    const headSpaCards = [...headSpaHtml.matchAll(/<article\b[^>]*class="product-card"[^>]*>([\s\S]*?)<\/article>/g)].map((match) => match[1].replaceAll("&amp;", "&"));
    for (const [title, price] of [["Carezza", 90], ["Cielo & Terra", 90], ["VINUM", 250], ["Abbraccio di Vita", 147], ["Two Souls Ritual", 310]]) {
      const card = headSpaCards.find((cardHtml) => cardHtml.includes(`<h3>${title}</h3>`));
      assert.ok(card, `HEAD SPA card: ${title}`);
      assert.match(card, new RegExp(`<strong>${price}\\s*€</strong>`), `HEAD SPA price: ${title}`);
    }

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

    const sitemap = await fetch(`${base}/sitemap.xml`);
    assert.equal(sitemap.status, 200);
    const sitemapXml = await sitemap.text();

    for (const [slug, title, price, minutes] of pages) {
      assert.ok(html.includes(`/esperienze/${slug}`), `${slug} homepage link`);
      assert.ok(sitemapXml.includes(`/esperienze/${slug}</loc>`), `${slug} sitemap`);
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
