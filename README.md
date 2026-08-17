# Virginia SPA

Sito web ed e-commerce dedicato a **Virginia SPA**, beauty farm e centro benessere di Latina.

Il progetto nasce per risolvere due esigenze principali:

1. aiutare le persone a comprendere e scegliere il percorso di benessere più adatto;
2. permettere l’acquisto online di trattamenti, pacchetti e Gift Card personalizzate.

## Obiettivo del sito

Il sito non è pensato come una semplice vetrina. L’esperienza accompagna il visitatore dalla scoperta dei propri bisogni fino alla scelta e all’acquisto del trattamento.

La comunicazione utilizza un linguaggio emozionale ma chiaro, spiegando benefici, durata e caratteristiche di ogni esperienza senza richiedere al cliente una conoscenza preliminare dei trattamenti SPA.

## Funzionalità principali

### Percorsi di benessere

La sezione shop presenta i percorsi disponibili e consente di filtrarli in base all’esigenza:

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

Le descrizioni, le durate e i prezzi presenti sono attualmente dimostrativi e dovranno essere sostituiti con i dati commerciali definitivi.

### Ritual Finder

Un breve percorso guidato pone alcune domande all’utente e lo aiuta a individuare l’esperienza più coerente con il proprio stato d’animo e i propri obiettivi.

### Gift Card personalizzabile

La pagina dedicata `/gift-card` consente di:

- scegliere il valore della Gift Card;
- indicare destinatario e mittente;
- scrivere una dedica personale;
- scegliere la consegna immediata o una data speciale;
- visualizzare l’anteprima della Gift Card;
- aggiungerla al carrello;
- completare il checkout;
- scaricare il voucher digitale dopo l’ordine.

### Carrello e checkout

I percorsi e le Gift Card possono essere aggiunti a un carrello laterale. È presente un flusso completo di checkout e conferma dell’ordine.

> **Nota:** il pagamento è attualmente dimostrativo. Nessun importo viene addebitato. Per la pubblicazione sarà necessario collegare un provider reale, ad esempio Stripe o PayPal, e generare ordini e voucher attraverso il backend.

### Sito multilingua

L’interfaccia è disponibile in italiano, inglese, spagnolo, francese e tedesco. L’italiano è la lingua principale.

La lingua selezionata viene memorizzata nel browser. Anche catalogo HEAD SPA, Gift Atelier, carrello e checkout dispongono di contenuti localizzati.

### SEO e accessibilità

Il progetto include:

- metadati SEO dedicati all’attività locale;
- canonical URL e Open Graph;
- dati strutturati Schema.org per `DaySpa` e `HealthAndBeautyBusiness`;
- navigazione da tastiera e focus visibili;
- testi alternativi per le immagini;
- controlli touch di dimensioni accessibili;
- supporto a `prefers-reduced-motion`;
- layout responsive per smartphone, tablet e desktop.

## Tecnologie utilizzate

- React 19
- Next.js 16
- TypeScript
- Vite e Vinext
- Tailwind CSS 4
- Cloudflare Workers, con predisposizione opzionale per D1 e Drizzle

## Struttura principale

```text
app/
├── page.tsx                     # Homepage
├── commerce.tsx                 # Shop, carrello, checkout e Gift Atelier
├── i18n.ts                      # Traduzioni generali
├── globals.css                  # Design system e layout responsive
├── layout.tsx                   # Metadati SEO e dati strutturati
└── gift-card/
    ├── page.tsx                 # Metadati della pagina Gift Card
    └── gift-card-page.tsx       # Esperienza Gift Atelier multilingua

public/                          # Immagini e icone
tests/                           # Test del rendering HTML
worker/                          # Entry point Cloudflare Worker
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

Su Windows, se Bash non è disponibile:

```powershell
npx eslint . --ignore-pattern dist --ignore-pattern .next
npx vite build
node --test tests\rendered-html.test.mjs
```

## Attività necessarie prima della pubblicazione

- inserire prezzi, durate e descrizioni approvati dal cliente;
- configurare dominio e dati aziendali definitivi;
- collegare il provider di pagamento;
- salvare ordini e voucher in un database;
- inviare email di conferma e consegna Gift Card;
- aggiungere Privacy Policy, Cookie Policy e gestione del consenso;
- sostituire telefono e indirizzi dimostrativi;
- configurare analytics e monitoraggio delle conversioni;
- eseguire test completi del checkout e dei voucher.

## Stato del progetto

Il sito è attualmente una **versione funzionale pre-produzione**: design, navigazione, multilingua, catalogo, carrello, configuratore Gift Card e download del voucher sono implementati. Pagamenti, ordini persistenti ed email richiedono ancora l’integrazione con servizi reali.
