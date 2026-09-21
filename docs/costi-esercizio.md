# Costi per tenere online Virginia SPA

Stima aggiornata al **21 settembre 2026**. Serve per separare:

1. i costi vivi dei fornitori;
2. le commissioni legate alle vendite;
3. l'eventuale compenso per manutenzione e assistenza.

I listini possono cambiare. Prima di acquistare o rinnovare va sempre controllato il totale nel checkout, in particolare IVA, durata del contratto e prezzo di rinnovo.

## Risposta breve

Per il sito attuale la soluzione corretta è **Hostinger Hosting di app web gestito**, non un VPS e non un secondo piano e-commerce. Il piano include già Node.js, MySQL, SSL, CDN, backup, WAF e protezione DDoS.

La cifra prudente da accantonare e chiedere ogni anno è:

| Voce | Importo consigliato |
| --- | ---: |
| Infrastruttura e rinnovi, senza lavoro umano | **€350/anno** |
| Manutenzione tecnica essenziale | **€600/anno** |
| Totale consigliato per sito online e seguito | **€950/anno** |

Le commissioni Stripe non sono comprese: vengono trattenute sulle singole vendite. Anche nuove funzionalità, campagne pubblicitarie, produzione di contenuti e interventi straordinari restano fuori dal canone.

## Stack verificato nel progetto

| Componente | Uso nel sito | Fornitore | Costo atteso iniziale |
| --- | --- | --- | ---: |
| App Next.js 16 / Node.js | sito, API, checkout, area staff | Hostinger Web App gestita | incluso nel piano hosting |
| MySQL | ordini, voucher, contatti, audit | Hostinger | incluso |
| File e immagini | asset statici; meno di 1 MB oggi | Hostinger | incluso nei 50 GB |
| HTTPS, CDN, WAF, DDoS | sicurezza e distribuzione | Hostinger | incluso |
| Backup | giornalieri e su richiesta | Hostinger | incluso |
| Cron giornaliero | pulizia ordini abbandonati | Hostinger | incluso |
| Dominio `.it` | `virginiaspa.it` | Hostinger | primo anno spesso incluso; poi rinnovo |
| Casella professionale | es. `info@virginiaspa.it` | Hostinger Mail | primo anno incluso; poi rinnovo |
| Pagamenti | Checkout, webhook e rimborsi | Stripe | nessun canone; commissione per vendita |
| Email automatiche | voucher e notifiche contatto | Resend | €0 entro la soglia gratuita |
| Statistiche | pageview e conversioni essenziali | PostHog Cloud EU | €0 entro la soglia gratuita |
| Repository e deploy da Git | codice e cronologia | [GitHub Free](https://github.com/pricing) | €0 con il piano Free |

Il progetto non usa object storage, Redis, un database esterno, un server dedicato o un servizio separato per generare i voucher. Non vanno quindi aggiunti al preventivo.

## Hostinger: cosa acquistare

### Piano consigliato

**Hosting di app web gestito**, con 2 vCPU, 3 GB RAM, 50 GB NVMe e banda illimitata. Al 21 settembre 2026 il listino pubblico mostra:

- **€3,99/mese per 48 mesi**, pagati in anticipo: **€191,52**;
- rinnovo dichiarato: **€16,99/mese**, equivalente a **€203,88/anno**;
- dominio ed email business gratuiti per il primo anno;
- MySQL, SSL, CDN, backup, WAF e DDoS inclusi.

Fonte: [Hostinger — hosting Node.js](https://www.hostinger.com/it/nodejs-hosting).

Questo piano è adeguato perché il sito non carica foto degli utenti, non conserva video e il database contiene prevalentemente testo e righe d'ordine. Il VPS costa meno al rinnovo indicato, ma richiede gestione manuale di sistema operativo, sicurezza, aggiornamenti, deploy e backup: il risparmio nominale non compensa il lavoro e il rischio operativo per questo progetto.

### Dominio

Il `.it` è indicato a **€5,99 per il primo anno** e **€15,99/anno al rinnovo**; con un piano idoneo può essere gratuito per il primo anno. Va verificato che `virginiaspa.it` compaia effettivamente a €0 nel carrello del piano.

Fonte: [Hostinger — dominio .it](https://www.hostinger.com/it/tld/dominio-it).

### Email professionale

Il piano hosting include una prova Hostinger Mail di un anno. Alla scadenza la casella passa a un piano a pagamento se si vuole conservarla. Per una sola casella Starter il listino di rinnovo è **€1,59/mese**, cioè **€19,08/anno** per un impegno di 48 mesi.

Fonti: [Hostinger — prova email inclusa](https://www.hostinger.com/support/how-the-hostinger-mail-trial-works/) e [Hostinger Mail — prezzi](https://www.hostinger.com/it/hosting-email).

Una casella è sufficiente: gli alias come `prenotazioni@`, `giftcard@` o `amministrazione@` possono inoltrare alla casella principale se il piano lo consente. Resend resta necessario per le email automatiche del sito: la casella Hostinger serve alle persone, Resend all'applicazione.

### IVA e rinnovi

Hostinger dichiara i prezzi senza IVA. Per non sottostimare la cassa, i calcoli sotto aggiungono il **22%**. Il trattamento effettivo dipende dall'intestazione dell'account e dalla posizione IVA dell'azienda e va confermato con il commercialista e nel checkout.

La promozione iniziale non è il costo annuale strutturale. Il fondo annuale deve essere calcolato sui prezzi di rinnovo, così non si crea un buco di cassa alla fine dei primi 48 mesi.

## Costo vivo annuale a regime

Scenario prudente: un sito, un dominio `.it`, una casella Hostinger Starter, nessun superamento dei piani gratuiti esterni.

| Voce | Netto listino | Con 22% prudenziale |
| --- | ---: | ---: |
| Hosting Web App, rinnovo equivalente | €203,88 | €248,73 |
| Dominio `.it`, rinnovo | €15,99 | €19,51 |
| 1 casella Hostinger Starter, rinnovo | €19,08 | €23,28 |
| Resend | €0,00 | €0,00 |
| PostHog | €0,00 | €0,00 |
| GitHub | €0,00 | €0,00 |
| **Totale vivo a regime** | **€238,95** | **€291,52** |
| Margine prudenziale 20% |  | **€58,30** |
| **Fondo annuale consigliato** |  | **€349,82 → €350** |

Il margine del 20% copre piccoli aumenti di listino, cambio euro/dollaro per servizi esterni e arrotondamenti. Non è un compenso di manutenzione.

## Quanto serve al lancio

Se si acquista oggi la promozione Hostinger da 48 mesi:

| Pagamento iniziale | Senza IVA | Con 22% prudenziale |
| --- | ---: | ---: |
| Hosting per 48 mesi | €191,52 | €233,65 |
| Dominio primo anno | €0 se incluso; altrimenti €5,99 | €0; altrimenti €7,31 |
| Email primo anno | €0 | €0 |
| **Cassa minima al checkout** | **€191,52–197,51** | **€233,65–240,96** |

Questa cifra paga quattro anni di hosting in anticipo, ma non quattro anni completi di dominio ed email. Dal secondo anno vanno rinnovati separatamente dominio e casella. Per una gestione semplice conviene comunque fatturare il fondo infrastruttura di **€350 ogni anno** e conservarne la parte non spesa per il rinnovo hosting futuro.

## Costi variabili: Stripe

Stripe non ha costo di attivazione o canone mensile nel piano standard. Per carte standard emesse nello Spazio Economico Europeo applica **1,5% + €0,25** per transazione riuscita. Le carte premium SEE costano **2,8% + €0,25**, quelle UK **2,5% + €0,25** e le internazionali **3,15% + €0,25**, con eventuale maggiorazione per conversione valuta.

Fonte: [Stripe Italia — prezzi](https://stripe.com/en-it/pricing).

Esempi con carta standard SEE:

| Ordine | Commissione Stripe | Incidenza |
| --- | ---: | ---: |
| €50 | €1,00 | 2,00% |
| €100 | €1,75 | 1,75% |
| €150 | €2,50 | 1,67% |
| €250 | €4,00 | 1,60% |

Con scontrino medio di €100:

| Vendite online annue | Ordini stimati | Commissioni Stripe stimate |
| --- | ---: | ---: |
| €5.000 | 50 | €87,50 |
| €10.000 | 100 | €175,00 |
| €25.000 | 250 | €437,50 |
| €50.000 | 500 | €875,00 |

Queste commissioni sono un costo commerciale proporzionale agli incassi, non un costo per “tenere acceso” il sito. Devono essere considerate nel margine dei servizi e delle Gift Card, non anticipate nel canone annuale. In caso di rimborso Stripe non restituisce le commissioni di elaborazione originarie.

## Servizi che restano gratuiti nel nostro scenario

### Resend

Il piano Free offre **3.000 email al mese**, massimo **100 al giorno**, e fino a 3 domini. Il sito invia email transazionali per voucher e richieste di contatto: per superare la soglia giornaliera servirebbero più di 100 invii nello stesso giorno. Non è realistico nel volume iniziale previsto.

Il primo piano a pagamento costa **$20/mese** per 50.000 email. Non va acquistato in anticipo: si attiva solo se il pannello mostra un uso vicino alla soglia o se serve eliminare il limite giornaliero.

Fonte: [Resend — prezzi](https://resend.com/pricing).

### PostHog Cloud EU

Il sito invia solo pageview ed eventi manuali di conversione; replay, autocapture, heatmap e tracciamenti pesanti sono disattivati. PostHog include **1 milione di eventi di Product Analytics al mese** gratuitamente.

Anche ipotizzando 5 eventi per visita, la soglia corrisponde a circa 200.000 visite mensili. Per una SPA locale il costo previsto è quindi **€0**. Va comunque controllato il consumo nel pannello prima del go-live e poi con cadenza mensile.

Fonte: [PostHog — prezzi Product Analytics](https://posthog.com/#pricing).

## Preventivo da presentare

### Opzione A — soli fornitori

**€350/anno**, anticipati.

Comprende il fondo per hosting, dominio, una casella email e margine su aumenti di listino. Non comprende controllo del sito, aggiornamenti, assistenza, modifiche o ripristino in caso di problemi.

È il minimo corretto se la SPA vuole pagare solo l'infrastruttura e si assume internamente la gestione operativa.

### Opzione B — continuità operativa consigliata

**€950/anno**, anticipati, così divisi:

- **€350** fondo infrastruttura;
- **€600** manutenzione essenziale, equivalenti a €50/mese.

La manutenzione essenziale dovrebbe includere per contratto:

- controllo mensile di homepage, contatti, checkout, webhook, voucher e area staff;
- verifica periodica di dominio, SSL, backup, cron, quote Resend e quote PostHog;
- aggiornamenti di sicurezza e dipendenze, raggruppati quando possibile;
- un test di acquisto in modalità test dopo aggiornamenti rilevanti;
- fino a **4 ore/anno** per piccoli interventi correttivi o incidenti;
- un breve riepilogo annuale di costi, rinnovi e stato tecnico.

Sono esclusi: nuove pagine o funzionalità, fotografie e testi, campagne, SEO continuativo, modifiche al catalogo oltre l'ordinaria amministrazione, assistenza commerciale ai clienti, consulenza legale/fiscale e costi Stripe.

Ore oltre il pacchetto vanno autorizzate e fatturate separatamente. Il prezzo di €600 è una proposta commerciale per il lavoro, non una tariffa imposta dai fornitori.

## Cosa non acquistare ora

- **Hostinger VPS:** richiede amministrazione del server e aumenta il rischio operativo.
- **Hostinger Cloud:** non serve per i volumi e gli asset attuali.
- **Hostinger Ecommerce / Website Builder:** duplicherebbe carrello, Gift Card e Stripe già realizzati nel sito custom.
- **Resend Pro:** il Free copre ampiamente il lancio.
- **PostHog a pagamento:** le metriche richieste rientrano nel milione di eventi gratuito.
- **Storage esterno o CDN separata:** non ci sono upload e la CDN è inclusa.
- **Stripe Tax, Sigma o altri add-on:** non sono necessari al flusso attuale.

## Controlli prima di chiedere il pagamento

1. Aprire il checkout Hostinger e confermare prezzo finale, IVA e durata.
2. Verificare che il dominio `.it` sia incluso per il primo anno; in caso contrario aggiungere €7,31 prudenziali.
3. Registrare hosting e dominio a nome della SPA, con rinnovo automatico e metodo di pagamento aziendale.
4. Decidere quale unica casella professionale mantenere dopo il primo anno.
5. Controllare mensilmente l'utilizzo di Resend e PostHog; non attivare piani a pagamento preventivamente.
6. Tenere le commissioni Stripe separate in contabilità e rivederle dopo i primi tre mesi di vendite reali.
7. Rivedere questo documento almeno 30 giorni prima di ogni rinnovo.

## Formula riutilizzabile

Per aggiornare il fondo annuale:

```text
(hosting annuo al rinnovo + dominio + caselle email + altri canoni)
× imposte applicabili
× 1,20 di margine prudenziale
```

Per stimare Stripe su carte standard SEE:

```text
vendite annue × 1,5% + numero ordini × €0,25
```

Questa stima non è consulenza fiscale. IVA, deducibilità e intestazione delle fatture vanno confermate dal commercialista della SPA.
