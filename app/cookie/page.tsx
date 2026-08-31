import type { Metadata } from "next";
import { LegalShell } from "../legal-shell";
import { legalEntityName, legalRegisteredOffice, privacyEmail } from "../../lib/legal";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "Informativa sui cookie e sullo storage tecnico utilizzati da Virginia SPA.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cookie" },
};

export default function CookiePage() {
  return (
    <LegalShell title="Cookie policy">
      <p>Questa pagina descrive i cookie e le tecnologie di memorizzazione usate da {legalEntityName}, con sede in {legalRegisteredOffice}.</p>

      <h2>1. Cosa usiamo oggi</h2>
      <p>Il sito non installa cookie di profilazione, pubblicitari o di analytics di terze parti. Restano solo memorizzazioni tecniche, necessarie al funzionamento:</p>
      <ul>
        <li><strong>Tema</strong> (`virginia-theme`): preferenza chiaro/scuro, salvata in `localStorage`.</li>
        <li><strong>Lingua</strong> (`virginia-language`): lingua dell’interfaccia, salvata in `localStorage`.</li>
        <li><strong>Carrello</strong>: contenuto del carrello sul dispositivo, per non perderlo ricaricando la pagina.</li>
        <li><strong>Avviso cookie</strong> (`virginia-cookie-notice`): ricorda che l’informativa è stata letta.</li>
        <li><strong>Accesso ordine</strong> (`vs_order_access`): cookie HttpOnly impostato dopo un pagamento riuscito, per mostrare i download del voucher sulla pagina di conferma. Dura 24 ore.</li>
      </ul>

      <h2>2. Pagamenti Stripe</h2>
      <p>Quando si procede al checkout, l’utente è reindirizzato sul dominio di Stripe. Stripe può impostare propri cookie, regolati dalla <a href="https://stripe.com/it/privacy" target="_blank" rel="noopener noreferrer">privacy policy di Stripe</a>. Il sito Virginia SPA non legge i dati della carta.</p>

      <h2>3. Cookie di terze parti futuri</h2>
      <p>Se in seguito si attivassero strumenti di misurazione (es. Google Analytics) o remarketing, questa pagina sarà aggiornata e, ove richiesto dalla normativa, verrà chiesto un consenso preventivo ed esplicito.</p>

      <h2>4. Come gestire lo storage</h2>
      <p>È possibile cancellare `localStorage` e i cookie dalle impostazioni del browser. La cancellazione del tema o della lingua non pregiudica la navigazione; la cancellazione del cookie di accesso ordine impedisce il download dalla pagina di successo (il voucher resta recuperabile via email).</p>

      <h2>5. Contatti</h2>
      <p>Per domande sul trattamento: <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>.</p>

      <p>Ultimo aggiornamento: 31 agosto 2026.</p>
    </LegalShell>
  );
}
