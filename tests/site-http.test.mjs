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
    assert.doesNotMatch(headSpaHtml, /VINUM|Wine Essence|Durate e prezzi attualmente dimostrativi/);
    const headSpaCards = [...headSpaHtml.matchAll(/<article\b[^>]*class="product-card"[^>]*>([\s\S]*?)<\/article>/g)].map((match) => match[1].replaceAll("&amp;", "&"));
    assert.equal(headSpaCards.length, 6);
    for (const [title, price] of [["Carezza", 90], ["Cielo & Terra", 90], ["Radici di Armonia", 147], ["Abbandono Sensoriale", 250], ["Abbraccio di Vita", 147], ["Two Souls Ritual", 310]]) {
      const card = headSpaCards.find((cardHtml) => cardHtml.includes(`<h3>${title}</h3>`));
      assert.ok(card, `HEAD SPA card: ${title}`);
      assert.match(card, new RegExp(`<strong>${price}\\s*€</strong>`), `HEAD SPA price: ${title}`);
    }

    const suspendedCheckout = await fetch(`${base}/api/checkout`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Catalog test", email: "test@example.com", phone: "0000000000", acceptedTerms: true, items: [{ id: "wine-essence", quantity: 1 }] }) });
    assert.equal(suspendedCheckout.status, 400);

    const ayurveda = await fetch(`${base}/esperienze/ayurveda`);
    assert.equal(ayurveda.status, 200);
    const ayurvedaHtml = (await ayurveda.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<!--[^]*?-->/g, "");
    assert.equal([...ayurvedaHtml.matchAll(/<article\b[^>]*class="product-card"/g)].length, 15);
    assert.equal([...ayurvedaHtml.matchAll(/href="\/#contatti"[^>]*>Richiedi informazioni/g)].length, 15);
    const ayurvedaFilters = ayurvedaHtml.match(/<div class="need-filters"[^>]*>[\s\S]*?<\/div>/)?.[0];
    assert.ok(ayurvedaFilters);
    assert.equal([...ayurvedaFilters.matchAll(/<button\b/g)].length, 5);
    assert.match(ayurvedaFilters, /aria-pressed="true"[^>]*>Tutti<\/button>/);
    for (const label of ["Relax e distensione", "Calore e oli", "Pelle e leggerezza", "Armonia interiore"]) assert.ok(ayurvedaFilters.includes(label));
    for (const text of ["Ayus, la vita", "Dosha ed equilibrio", "Dharma", "Artha", "Kama", "Moksha", "Snehana", "Chakra Balancing", "Il percorso completo", "180 min"]) assert.ok(ayurvedaHtml.includes(text), `Ayurveda: ${text}`);

    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { ok: true });

    const cron = await fetch(`${base}/api/cron`);
    assert.ok([401, 503].includes(cron.status), `cron status ${cron.status}`);

    const gift = await fetch(`${base}/gift-card`, { headers: { accept: "text/html" } });
    assert.equal(gift.status, 200);
    const giftHtml = (await gift.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
    assert.match(giftHtml, /Gift Card/i);
    assert.match(giftHtml, /Rituale da regalare \(facoltativo\)/);
    const giftSelect = giftHtml.match(/<select\b[^>]*id="gift-ritual"[^>]*>[\s\S]*?<\/select>/)?.[0];
    assert.ok(giftSelect);
    assert.doesNotMatch(giftSelect, /\brequired(?:\s|=|>)/);
    assert.match(giftSelect, /<option value=""[^>]*>Lascia scegliere a chi riceve<\/option>/);
    assert.match(giftSelect, /value="rituale-terra"/);
    assert.match(giftSelect, /value="percorso-ayurveda"/);
    assert.doesNotMatch(giftSelect, /VINUM|wine-essence/);
    for (const ritualId of ["wine-essence", "snehana", "non-esiste"]) {
      const invalidGift = await fetch(`${base}/api/checkout`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Gift test", email: "test@example.com", phone: "0000000000", acceptedTerms: true, items: [{ price: 100, gift: { ritualId } }] }) });
      assert.equal(invalidGift.status, 400, `Gift ritual: ${ritualId}`);
    }

    const privacy = await fetch(`${base}/privacy`, { headers: { accept: "text/html" } });
    assert.equal(privacy.status, 200);
    const privacyHtml = await privacy.text();
    assert.match(privacyHtml, /Hostinger per hosting e database MySQL/);
    assert.doesNotMatch(privacyHtml, /da revisionare da legale/);
    assert.doesNotMatch(privacyHtml, /noindex/);
    assert.doesNotMatch(privacyHtml, /Cloudflare per hosting/);
    assert.doesNotMatch(privacyHtml, /database D1/);

    const cookie = await fetch(`${base}/cookie`, { headers: { accept: "text/html" } });
    assert.equal(cookie.status, 200);
    const cookieHtml = await cookie.text();
    assert.match(cookieHtml, /PostHog Cloud EU/);
    assert.doesNotMatch(cookieHtml, /da revisionare da legale/);
    assert.doesNotMatch(cookieHtml, /noindex/);

    const terms = await fetch(`${base}/termini`, { headers: { accept: "text/html" } });
    assert.equal(terms.status, 200);
    const termsHtml = await terms.text();
    assert.match(termsHtml, /non è una prenotazione/);
    assert.doesNotMatch(termsHtml, /da revisionare da legale/);
    assert.doesNotMatch(termsHtml, /noindex/);

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
