# Virginia SPA

Sito web ed e-commerce dedicato a **Virginia SPA**, beauty farm e centro benessere di Latina.

Il progetto nasce per risolvere due esigenze principali:

1. aiutare le persone a comprendere e scegliere il percorso di benessere più adatto;
2. permettere l’acquisto online di voucher e Gift Card. Data e orario del rituale si definiscono dopo, contattando la struttura.

## Obiettivo del sito

Il sito non è pensato come una semplice vetrina. L’esperienza accompagna il visitatore dalla scoperta dei propri bisogni fino alla scelta e all’acquisto del trattamento.

La comunicazione utilizza un linguaggio emozionale ma chiaro, spiegando benefici, durata e caratteristiche di ogni esperienza senza richiedere al cliente una conoscenza preliminare dei trattamenti SPA.

## Funzionalità principali

### Percorsi di benessere

La sezione shop presenta i percorsi disponibili e consente di filtrarli in base all’esigenza. L’acquisto online emette un voucher, non una prenotazione.

- rilassamento;
- luminosità e cura della pelle;
- corpo e forma;
- esperienze da condividere.

Il primo percorso configurato è **HEAD SPA**, articolato nei seguenti sotto-percorsi:

- Cielo & Terra;
- Radici di Armonia;
- Abbandono Sensoriale;
- Wine Essence;
- Abbraccio di Vita;
- Carezza;
- Two Souls Ritual.

In homepage compaiono anche i rituali in `/esperienze` (Terra, Luna, Rosa, Surya, Luce d’Ambra). **Prezzi e durate sono dimostrativi** (`pricesAreProvisional` in `lib/catalog.ts`) finché la SPA non conferma il listino. I prezzi Stripe si leggono solo da `lib/catalog.ts`.

### Ritual Finder

Un breve percorso guidato pone alcune domande all’utente e lo aiuta a individuare un’esperienza del catalogo (Cielo & Terra, Rituale della Terra, Rituale della Rosa).

### Gift Card personalizzabile

La pagina dedicata `/gift-card` consente di:

- scegliere il valore della Gift Card (€50 / 100 / 150 / 250);
- indicare destinatario e mittente;
- scrivere una dedica personale;
- visualizzare l’anteprima della Gift Card;
- aggiungerla al carrello;
- completare il checkout;
- ricevere il voucher via email (acquirente) e scaricarlo dopo l’ordine;
- contattare la SPA per data, orario e dettagli del rituale.

La Gift Card è immediata: il sito non programma una consegna futura.

### Carrello, Stripe e voucher

I percorsi e le Gift Card possono essere aggiunti al carrello e pagati tramite Stripe Checkout. Prezzi e prodotti vengono verificati sul server; il sito non riceve né conserva i dati della carta. Il cliente acquista un voucher/card: dopo il pagamento deve contattare Virginia SPA per finalizzare la prenotazione.

Il webhook Stripe è la fonte di verità: il voucher viene creato e reso scaricabile soltanto dopo la conferma effettiva del pagamento. Subito dopo, Resend invia l’email con i link di download (se configurato). Se l’invio fallisce, il webhook risponde 500 e Stripe ritenta. Ordini, righe d’ordine, voucher, eventi Stripe e storico operativo vengono salvati in Cloudflare D1.

Gli stati voucher sono `pagato`, `utilizzato`, `rimborsato` e `scaduto`. L’area riservata `/staff` permette al personale di cercare un voucher e segnarlo come utilizzato (token Bearer o cookie HttpOnly). Un rimborso Stripe non modifica i voucher già `utilizzato`.

La pagina di conferma ordine riceve i download solo dopo `/api/orders/access`, che imposta un cookie HttpOnly firmato. Conoscere il solo `session_id` nell’URL non basta a leggere i claim token.

I messaggi del form contatti e della modal consulenza si salvano in D1 e, con Resend configurato, partono anche all’email della SPA.

### Sito multilingua

L’interfaccia è disponibile in italiano, inglese, spagnolo, francese e tedesco. L’italiano è la lingua principale e l’unica indicizzata (le altre lingue sono client-side).

La lingua selezionata viene memorizzata nel browser. Anche catalogo HEAD SPA, Gift Atelier, carrello, checkout ed email voucher dispongono di contenuti localizzati.

### SEO, legal e accessibilità

Il progetto include:

- metadati SEO, canonical URL e Open Graph;
- `sitemap.xml` e `robots.txt` (`/staff`, `/api/`, `/checkout/success`, `/chi-siamo` esclusi);
- JSON-LD `DaySpa` / `HealthAndBeautyBusiness` (senza telefono, via o Instagram finché restano placeholder);
- FAQ schema solo in homepage;
- pagine `/privacy`, `/cookie`, `/termini` (modelli Art. 13 / vendita a distanza, **noindex** finché non le rivede un legale);
- `/chi-siamo` **noindex** finché staff e foto non sono ufficiali;
- avviso cookie solo per storage tecnico;
- navigazione da tastiera, skip-link, `prefers-reduced-motion`, layout responsive.

## Tecnologie utilizzate

- React 19
- Next.js 16
- TypeScript
- Vite e Vinext
- Tailwind CSS 4
- Cloudflare Workers, D1 e Drizzle
- Stripe Checkout e Resend

## Struttura principale

```text
app/
├── page.tsx                     # Homepage (wrapper server + FAQ JSON-LD)
├── home-page.tsx                # UI homepage
├── commerce.tsx                 # Shop, carrello, checkout e Gift Atelier
├── i18n.ts                      # Traduzioni generali
├── globals.css                  # Design system e layout responsive
├── layout.tsx                   # Metadati SEO e schema LocalBusiness
├── sitemap.ts · robots.ts
├── privacy/ cookie/ termini/    # Pagine legali modello
├── gift-card/                   # Gift Atelier
└── api/                         # Checkout, webhook, voucher, staff, contatti

lib/
├── catalog.ts                   # Prezzi e tagli Gift Card (fonte unica)
├── site.ts · legal.ts           # NAP e titolare (placeholder da sostituire)
├── email.ts                     # Resend (voucher + notifiche contatto)
└── security.ts                  # Rate limit e header HTTP

public/                          # Immagini e icone
tests/                           # HTML e pagamenti
worker/                          # Cloudflare Worker (header, cron pulizia ordini)
```

## Avvio in locale

È richiesto Node.js `22.13.0` o superiore.

```bash
npm install
npm run dev
```

Il terminale mostrerà l’indirizzo locale al quale aprire il sito.

## Verifiche

Su Linux o in un ambiente dotato di Bash:

```bash
npm run lint
npm test
npm run build
```

`npm test` richiede GNU `timeout`. In alternativa: `npx vinext build` e `node --test tests/rendered-html.test.mjs`.

Su Windows, se Bash non è disponibile:

```powershell
npx eslint . --ignore-pattern dist --ignore-pattern .next
npx vite build
node --test tests\rendered-html.test.mjs
```

I test pagamenti (`npm run test:payments`) richiedono `npm run dev` già avviato, `.dev.vars` con chiavi Stripe test e `stripe listen`.

## Configurazione Stripe, email e database

Si parte dal **nostro account Stripe in modalità test** (`sk_test_...`). Solo quando flusso, webhook, voucher e copy sono validati si passa alle chiavi live della SPA (`sk_live_...`). Il codice non cambia: si sostituiscono i secret.

Per lo sviluppo locale copiare `.dev.vars.example` in `.dev.vars` (gitignored):

```text
STRIPE_SECRET_KEY=sk_test_REPLACE_ME
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_ME
SPA_STAFF_TOKEN=dev-staff-token-change-me
PUBLIC_SITE_URL=http://localhost:5173
ORDER_ACCESS_SECRET=replace-with-a-long-random-string
RESEND_API_KEY=
EMAIL_FROM=Virginia SPA <noreply@virginiaspa.it>
```

`PUBLIC_SITE_URL` è obbligatorio fuori da localhost. Senza `RESEND_API_KEY` / `EMAIL_FROM` il webhook emette comunque i voucher e salta l’email (log di warning). Se Resend è configurato e l’invio fallisce, Stripe ritenta.

Quando il cliente è pronto, gli stessi nomi di variabile vanno nei secret Cloudflare con i valori live:

```text
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SPA_STAFF_TOKEN=una-chiave-lunga-casuale
PUBLIC_SITE_URL=https://www.virginiaspa.it
ORDER_ACCESS_SECRET=un-segreto-dedicato
RESEND_API_KEY=re_...
EMAIL_FROM=Virginia SPA <noreply@virginiaspa.it>
```

Nel Dashboard Stripe occorre completare i dati legali e fiscali della SPA, il conto bancario, il nome pubblico, l’assistenza clienti e l’eventuale configurazione IVA. Registrare il webhook pubblico `https://www.virginiaspa.it/api/stripe/webhook` per questi eventi:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `charge.refunded`

Su Resend verificare il dominio mittente (es. `virginiaspa.it`) prima di usare `EMAIL_FROM`.

Per lo sviluppo locale:

1. copiare `.dev.vars.example` in `.dev.vars` con chiavi `sk_test_...` / sandbox e `whsec_...`;
2. applicare lo schema D1 locale: `npx wrangler d1 migrations apply DB --local`;
3. avviare `npm run dev` e in un altro terminale `stripe listen --forward-to localhost:5173/api/stripe/webhook`;
4. verificare con `npm run test:payments` (server già avviato) e una carta di test `4242 4242 4242 4242`.

Prima del deploy: creare un database D1 remoto, copiare l’id in `wrangler.toml`, applicare `npx wrangler d1 migrations apply DB --remote`. Un cron Worker alle 04:00 UTC cancella gli ordini `in_attesa` più vecchi di 7 giorni.

Il flusso live è: ordine `in_attesa` → pagamento Stripe → webhook verificato → ordine e voucher `pagato` → email Resend e download. Il personale usa `/staff` per registrare `utilizzato`; rimborsi completi e scadenze impostano `rimborsato` e `scaduto`.

## Checklist go-live

Sostituire i placeholder in `lib/site.ts` e `lib/legal.ts` **prima** di pubblicare. Impostare `pricesAreProvisional` a `false` in `lib/catalog.ts` solo dopo il listino confermato. Le pagine `/privacy`, `/cookie` e `/termini` restano noindex finché un legale non le approva.

- [ ] Ragione sociale, P.IVA, sede, PEC, telefono, email, indirizzo, orari, Instagram
- [ ] Prezzi e durate confermati (togliere «provvisori» in UI solo dopo ok SPA)
- [ ] Foto e nomi reali su `/chi-siamo`, oppure lasciare la pagina noindex
- [ ] Account Stripe della SPA (KYC) + webhook produzione
- [ ] Dominio `www.virginiaspa.it` (o definitivo) su Cloudflare, HTTPS, HSTS
- [ ] Dominio mittente Resend verificato
- [ ] D1 remoto + migrazioni applicate; `database_id` in `wrangler.toml`
- [ ] Secret Cloudflare: Stripe live, webhook, staff, `PUBLIC_SITE_URL`, Resend, `ORDER_ACCESS_SECRET`
- [ ] Ok scritto del legale sulle pagine privacy/termini/cookie, poi togliere il banner modello e il noindex
- [ ] `npm run test:payments` su staging + 1 carta test + eventuale live €1 richiesto dalla SPA

Contatti e NAP restano centralizzati in `lib/site.ts`. Schema LocalBusiness, `sitemap.xml` e `robots.txt` usano gli stessi dati, omettendo i campi ancora placeholder.

## Stato del progetto

Il sito è pronto al deploy di staging: design, navigazione, IT-first con lingue client, catalogo unificato, carrello, Gift Card immediata, Stripe Checkout, voucher atomici, email Resend, area staff, pagine legali modello (noindex), sitemap e header di sicurezza. Restano i dati anagrafici/fiscali della SPA, le chiavi live, il D1 di produzione e la revisione legale.
