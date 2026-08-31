# Pagamenti online — Virginia SPA

Versione visiva da aprire in browser: [pagamenti-italia.html](./pagamenti-italia.html) (stampa o PDF dal pulsante in pagina).

**Stato go-live (31 agosto 2026):** il sito va in produzione **con Stripe Checkout**. Webhook firmati, emissione voucher riprendibile, cookie di accesso ordine, Resend, rate limit, header di sicurezza, area staff con redeem atomico. Il confronto Nexi resta consultivo: non è in scope sostituire il provider prima del lancio.

Briefing per il confronto con l’azienda. Aggiornato al 31 agosto 2026. La tabella sotto riassume i rischi del 26 agosto e come sono stati chiusi nel codice.

Non è consulenza fiscale o legale. I listini sono pubblici e soggetti a contratto/promozione.

---

## Cosa c’è oggi nel sito

- Sito base: 17 agosto 2026.
- Prima integrazione Stripe: commit `fe1da4e`, 26 agosto 2026.
- Go-live tecnico (webhook atomici, accesso ordine, staff, Resend, legal, SEO): agosto 2026.

Il pagamento live resta bloccato dai dati della SPA (KYC Stripe, listino, P.IVA), non dal codice di checkout.

### Rischi del prototipo del 26 agosto (risolti nel codice)

| Problema (26 ago) | Stato attuale |
| --- | --- |
| Ordini `in_attesa` per sempre | Cron Worker alle 04:00 UTC li cancella dopo 7 giorni |
| Webhook processato anche se l’emissione fallisce | Evento cancellato in caso di errore; Stripe ritenta; `issueVouchers` riprende le quantità mancanti |
| Due eventi rimborso | Solo `charge.refunded`; i voucher `utilizzato` non passano a `rimborsato` |
| Consegna Gift Card finta / niente email | Gift Card immediata; Resend dopo il webhook (retry se l’invio fallisce) |
| Staff senza rate limit né lock | `safeEqual`, cookie HttpOnly, redeem atomico, rate limit |
| Prezzi duplicati client/server | Fonte unica `lib/catalog.ts` |
| Status ordine con il solo `session_id` | Cookie HMAC HttpOnly dopo `/api/orders/access` |

Restano fuori dal codice: KYC Stripe della SPA, IVA/fattura, D1 e secret di produzione, revisione legale.

**Da tenere:** carrello → ordine → voucher → staff, su Stripe Checkout.  
**Non in scope pre-lancio:** adapter multi-provider né Nexi.

---

## Stripe vs Nexi XPay

Stesso modello PCI: pagina di pagamento ospitata dal provider, le carte **non** transitano sul sito.

- **XPay Easy:** piano e-commerce base (redirect).
- **XPay Pro:** se servono estero, pagina custom/iframe, ricorrenti.
- **XPay Link:** pay-by-link senza sito — **non** è quello che serve.

Prezzi listino agosto 2026. Le promozioni “canone zero” scadono in fretta (l’ultima Pro risultava al 25/08/2026).

| | Stripe Checkout | Nexi XPay Easy / Pro |
| --- | --- | --- |
| Fee carta consumer UE su €100 | 1,5% + €0,25 = **€1,75** | Easy ~1,20% + €0,25 = **€1,45** · Pro ~1,25% + €0,29 = **€1,54** |
| Canone | €0 | Easy €5,90/mese · Pro €14,90/mese (IVA esclusa, promo variabili) |
| Accredito | 2–7 giorni lavorativi | **T+1** dichiarato |
| Chargeback | €20 ricevuto + €20 se si risponde | In scheda prodotto: dispute gestite, chargeback gratuiti |
| BANCOMAT Pay | Non è un metodo Checkout documentato | **Nativo** |
| Satispay / Apple Pay / Google Pay | Toggle in Dashboard | Nel catalogo 30+ metodi; da confermare sul contratto |
| Carte extra-SEE / turisti | Più forte (Radar, 3DS, documentazione) | Pro ha DCC e estero; Easy è più “Italia” |
| Assistenza per il titolare | Inglese, ticket, poco telefono IT | Telefono e backoffice in italiano |
| Contratto | Self-serve, KYC online | Convenzionamento Nexi, visura, valutazione, PEC |
| Docs / Cloudflare Workers | Ottime, REST semplice | Pensato per plugin CMS; API custom si fa, sandbox più lenta |
| POS in cabina | Stripe Terminal a parte | Se hanno già POS Nexi: offerta dedicata (XPay 360) |
| Report per commercialista | CSV / Dashboard in inglese | Reportistica italiana, circuito noto in studio |

Commissioni Nexi su Extra-EEA e carte commercial sono più alte; su Stripe idem.

Fonti: [Stripe pricing IT](https://stripe.com/en-it/pricing) · [Nexi XPay](https://www.nexi.it/it/ecommerce/xpay)

### Costo su un ordine da €100 (carte consumer UE)

| Provider | Commissione |
| --- | --- |
| Nexi Easy | €1,45 |
| Nexi Pro | €1,54 |
| Stripe SEE | €1,75 |
| PayPal (indicativo) | €2,84 |

Nexi Easy vince sul pezzo. Stripe vince su assenza di canone e su integrazione. Su pochi ordini al mese il canone Easy (€5,90) mangia il risparmio.

Klarna / Scalapay: da non attivare al go-live (fee ~5% su un voucher da €100).

---

## Quando scegliere cosa

### Nexi è la scelta giusta se

- Hanno già un POS Nexi in spa, o la banca li spinge sul convenzionamento.
- La clientela è prevalentemente italiana e vogliono BANCOMAT Pay vero.
- Il titolare deve poter chiamare un numero italiano se un pagamento fallisce il sabato.
- Vogliono accredito T+1 e report che il commercialista riconosce.

Piano: **Easy** se basta il redirect; **Pro** se vogliono pagina custom o estero.

### Stripe è ancora meglio se

- Non c’è un contratto acquirer e vogliono partire in giorni, non settimane.
- Molti ospiti esteri (il sito è già IT/EN/ES/FR/DE): carte extra-UE, Apple Pay, antifrode.
- Chi sviluppa il sito opera Dashboard, webhook e rimborsi; il titolare non tocca il PSP.
- Servono Satispay + Apple Pay + Google Pay senza negoziare ogni metodo.

Per il go-live il provider è **Stripe Checkout**: è già nel sito e il mix lingue/turisti lo giustifica. Nexi resta un’alternativa se, dopo il lancio, POS in cabina e assistenza telefonica IT diventano priorità.

**Non fare:** due provider in parallelo al primo rilascio (riconciliazione impossibile per una spa piccola). Il POS attuale in cabina si può lasciare com’è e non unificarlo col sito nella v1.

---

## Tre domande al titolare (confermano il go-live Stripe)

Le risposte restano utili per KYC, assistenza e mix clienti. Non bloccano più la scelta del codice.

1. Avete già un POS o un contratto Nexi / Circuito / banca?
2. Se un pagamento è in dubbio, chi chiama l’assistenza: il centro o chi sviluppa il sito? In che lingua?
3. Gift Card e trattamenti online sono soprattutto clienti italiani, o anche turisti?

Il layer pagamenti Stripe (checkout, webhook, voucher, staff) è quello che va in produzione. Un eventuale passaggio a Nexi è un progetto successivo, non un prerequisito.

---

## Informazioni da raccogliere in azienda

Serve sia per Stripe sia per Nexi. Coinvolgere titolare **e** commercialista.

### Identità legale e onboarding

- Forma giuridica (ditta individuale, S.n.c., S.r.l., …)
- Ragione sociale esatta e eventuale insegna Virginia SPA
- Sede legale e sede operativa
- Partita IVA, Codice Fiscale, codice ATECO, REA
- Visura camerale aggiornata
- PEC
- Dominio definitivo (es. `virginiaspa.it`)
- Rappresentante legale: nome, data di nascita, CF, residenza, telefono, email, CIE/passaporto a colori
- Titolari effettivi (UBO) con quota ≥ 25%
- Prova indirizzo personale del rappresentante (bolletta o estratto conto &lt; 6 mesi, documento diverso dalla carta d’identità)
- IBAN aziendale in EUR intestato alla **stessa** ragione sociale
- Chi gestirà la dashboard del provider (email, 2FA)

Nexi in più: contratto di convenzionamento, eventuale codice esercente POS già attivo.

### Catalogo e Gift Card

- Listino definitivo (prezzi e durate attuali sono dimostrativi), IVA inclusa o esclusa
- Aliquota IVA dei servizi spa (di solito 22%; conferma il commercialista)
- Tagli Gift Card (oggi in sito: €50 / 100 / 150 / 250)
- Gift Card **monouso vs multiuso**: se tutti i servizi sono al 22% può essere monouso (IVA alla vendita); se si possono acquistare anche prodotti ad altre aliquote è multiuso (IVA al riscatto)
- Validità voucher (oggi 12 mesi; prassi 12–24 mesi; troppo breve può essere vessatorio)
- Cumulabilità, resto, prenotazione vs voucher aperto
- Email voucher: oggi parte subito dopo il pagamento (niente consegna programmata); confermare mittente Resend e testi
- Wine Essence / alcol: limiti di età da valutare

### Fisco e recesso (commercialista / legale)

Stripe e Nexi **incassano**. Non emettono scontrino RT né fattura elettronica XML SdI. Resta sul gestionale dell’azienda.

- Come si certificano le vendite B2C online (corrispettivi vs fattura)
- Momento IVA delle Gift Card
- Buoni scaduti (IVA e ricavo)
- Recesso 14 giorni (Codice del Consumo) sulla vendita a distanza; si perde se il voucher è già usato. Un testo personalizzato da solo di solito **non** esclude il recesso
- Privacy, cookie, termini di vendita, condizioni Gift Card, organismo ADR/mediazione

### Operatività

- Email e telefono assistenza clienti (compariranno anche sull’estratto carta)
- Descriptor in estratto conto (es. `VIRGINIASPA`)
- POS attuale in sede (Nexi, SumUp, Satispay, cassa) — non unificare col sito in v1
- Come si prenota dopo l’acquisto online (il pagamento non è ancora un calendario)
- Chi autorizza i rimborsi
- Lingue da tenere live
- Volumi attesi (ordini/mese, scontrino medio) — utile in seguito per pricing custom

---

## Regole del layer pagamenti (già applicate su Stripe)

| Pezzo | Stato |
| --- | --- |
| Ordine | `in_attesa` con idempotency; cron cancella dopo 7 giorni se non pagato |
| Pagamento | Redirect Stripe Checkout; mai carte sul sito |
| Verità | Solo webhook firmato emette il voucher; retry se l’email Resend fallisce |
| Schema | Colonne Stripe (`session_id`, `payment_intent`); un adapter Nexi non è in scope pre-lancio |
| Rimborso | Solo `charge.refunded`; voucher `utilizzato` non torna `rimborsato` |
| Gift Card | Immediata + email Resend; monouso/multiuso dal commercialista |
| Staff | Cookie HttpOnly o Bearer, `safeEqual`, redeem atomico, rate limit |

---

## Prossimo passo

1. Completare KYC Stripe della SPA (visura, P.IVA, IBAN, nome pubblico, assistenza).
2. Confermare listino, IVA Gift Card e dati anagrafici in `lib/site.ts` / `lib/legal.ts`.
3. Applicare D1 remoto, secret Cloudflare e webhook live.
4. Fare revisionare privacy/termini/cookie da un legale; smoke test su staging.
