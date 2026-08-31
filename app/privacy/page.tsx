import type { Metadata } from "next";
import { LegalShell } from "../legal-shell";
import {
  legalEntityName,
  legalPec,
  legalRegisteredOffice,
  legalRepresentative,
  legalVatNumber,
  privacyEmail,
} from "../../lib/legal";
import { spaEmail, spaPhoneDisplay } from "../../lib/site";

export const metadata: Metadata = {
  title: "Informativa privacy",
  description: "Informativa sul trattamento dei dati personali di Virginia SPA ai sensi dell’art. 13 GDPR.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Informativa privacy">
      <p>Ai sensi dell’art. 13 del Regolamento (UE) 2016/679 (GDPR), Virginia SPA informa gli interessati sulle modalità di trattamento dei dati personali raccolti tramite il sito e i servizi collegati (acquisto voucher/Gift Card, form di contatto, area staff).</p>

      <h2>1. Titolare del trattamento</h2>
      <p>
        {legalEntityName}<br />
        Sede legale: {legalRegisteredOffice}<br />
        {legalVatNumber}<br />
        Legale rappresentante: {legalRepresentative}<br />
        Email: <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a><br />
        Telefono: {spaPhoneDisplay}<br />
        PEC: {legalPec}
      </p>

      <h2>2. Categorie di dati</h2>
      <ul>
        <li>dati anagrafici e di contatto (nome, email, telefono);</li>
        <li>dati dell’ordine (prodotti, importi, lingua, messaggi Gift Card);</li>
        <li>dati di pagamento gestiti da Stripe (il sito non riceve né conserva i dati della carta);</li>
        <li>contenuto dei messaggi inviati tramite form;</li>
        <li>dati tecnici di navigazione (indirizzo IP, log di sicurezza) per il funzionamento del sito.</li>
      </ul>

      <h2>3. Finalità e basi giuridiche</h2>
      <ul>
        <li><strong>Esecuzione del contratto</strong> (art. 6, lett. b GDPR): gestione dell’ordine, emissione e download del voucher, invio email di conferma, assistenza post-acquisto.</li>
        <li><strong>Obblighi di legge</strong> (art. 6, lett. c): fatturazione, adempimenti fiscali e contabili, gestione rimborsi.</li>
        <li><strong>Legittimo interesse</strong> (art. 6, lett. f): sicurezza del sito, prevenzione abusi, difesa in giudizio.</li>
        <li><strong>Consenso</strong> (art. 6, lett. a): solo se in futuro si attivassero cookie di profilazione o newsletter promozionali. Oggi il sito usa storage tecnico (tema e lingua).</li>
      </ul>

      <h2>4. Destinatari</h2>
      <p>I dati possono essere comunicati a: personale autorizzato della SPA; Stripe, Inc./Stripe Payments Europe per i pagamenti; Resend per l’invio delle email transazionali; Cloudflare per hosting, CDN e database D1. Non sono previste cessioni a fini di marketing a terzi.</p>

      <h2>5. Trasferimenti extra-SEE</h2>
      <p>Alcuni fornitori (in particolare Stripe, Resend, Cloudflare) possono trattare dati anche fuori dallo Spazio Economico Europeo. In tal caso il trasferimento avviene sulla base di Clausole Contrattuali Standard o altre garanzie di cui agli artt. 44 e ss. GDPR.</p>

      <h2>6. Conservazione</h2>
      <ul>
        <li>ordini e voucher: per la durata di validità del voucher e, dopo, nei termini previsti dagli obblighi fiscali e civilistici;</li>
        <li>messaggi di contatto: per il tempo necessario a dare riscontro e per eventuali esigenze documentali;</li>
        <li>ordini non pagati: cancellati automaticamente dopo 7 giorni;</li>
        <li>log di sicurezza: tempo strettamente necessario.</li>
      </ul>

      <h2>7. Diritti dell’interessato</h2>
      <p>È possibile chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione scrivendo a <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a> oppure a {spaEmail}. È inoltre possibile proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">garanteprivacy.it</a>).</p>

      <h2>8. Cookie e storage</h2>
      <p>Il dettaglio è nella <a href="/cookie">Cookie policy</a>. Non è richiesto un consenso di profilazione per i soli storage tecnici.</p>

      <h2>9. Minori</h2>
      <p>I servizi del sito non sono destinati a minori di 16 anni. I trattamenti in cabina per minori, se ammessi, sono gestiti in SPA con i genitori o tutori.</p>

      <p>Ultimo aggiornamento: 31 agosto 2026.</p>
    </LegalShell>
  );
}
