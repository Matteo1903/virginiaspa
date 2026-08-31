import type { Metadata } from "next";
import { LegalShell } from "../legal-shell";
import {
  legalEntityName,
  legalPec,
  legalRegisteredOffice,
  legalVatNumber,
  voucherValidityMonths,
} from "../../lib/legal";
import { spaEmail, spaPhoneDisplay } from "../../lib/site";

export const metadata: Metadata = {
  title: "Condizioni di vendita",
  description: "Condizioni di vendita a distanza di voucher e Gift Card Virginia SPA.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/termini" },
};

export default function TermsPage() {
  return (
    <LegalShell title="Condizioni di vendita">
      <p>Le presenti condizioni regolano l’acquisto a distanza, tramite il sito, di voucher digitali e Gift Card emessi da {legalEntityName} ({legalVatNumber}), con sede in {legalRegisteredOffice}.</p>

      <h2>1. Oggetto</h2>
      <p>L’acquisto online <strong>non è una prenotazione</strong>. Il cliente ottiene un voucher/Gift Card digitale che dà diritto a un trattamento o a un importo spendibile in SPA. Data, orario, operatore e dettagli del rituale si definiscono successivamente, contattando Virginia SPA.</p>

      <h2>2. Come si usa il voucher</h2>
      <ol>
        <li>Dopo il pagamento si riceve l’email con i link di download e, sulla pagina di conferma, i file del voucher.</li>
        <li>Si contatta la SPA al {spaPhoneDisplay} oppure a <a href={`mailto:${spaEmail}`}>{spaEmail}</a> per scegliere data e orario, soggetti a disponibilità.</li>
        <li>Il giorno dell’appuntamento si presenta il codice voucher al desk. Il personale lo segna come utilizzato.</li>
      </ol>

      <h2>3. Validità</h2>
      <p>Salvo diversa indicazione sul voucher, la validità è di <strong>{voucherValidityMonths} mesi</strong> dalla data di emissione. Dopo la scadenza il voucher non è più spendibile.</p>

      <h2>4. Prezzi e pagamento</h2>
      <p>I prezzi sono in euro e si intendono comprensivi di IVA ove applicabile. Il pagamento avviene su Stripe Checkout. Il contratto si perfeziona quando Stripe conferma il pagamento e il sito emette il voucher.</p>

      <h2>5. Gift Card</h2>
      <p>La Gift Card è nominativa rispetto al destinatario indicato in fase d’ordine, ma spendibile in SPA secondo le regole del desk. Il messaggio di dedica è un dato dell’ordine, non un documento fiscale. La Gift Card è consegnata subito dopo il pagamento via email e download: non è prevista la consegna in una data futura dal sito.</p>

      <h2>6. Recesso (artt. 52 e ss. Codice del consumo)</h2>
      <p>Il cliente consumatore ha 14 giorni per recedere dal contratto a distanza, senza doverne dare ragione, salvo le eccezioni di legge. Il recesso si comunica a <a href={`mailto:${spaEmail}`}>{spaEmail}</a> o alla PEC {legalPec}, indicando il numero ordine o il codice voucher.</p>
      <p>Il recesso non si applica, in particolare, se il servizio è stato interamente eseguito con accordo espresso del consumatore (voucher già utilizzato in cabina) o in altri casi previsti dall’art. 59 Codice del consumo. Se il voucher non è stato utilizzato, il rimborso avviene con lo stesso mezzo di pagamento, di regola entro 14 giorni dalla comunicazione.</p>

      <h2>7. Rimborsi e voucher già usati</h2>
      <p>Un voucher già <strong>utilizzato</strong> in SPA non viene rimborsato in automatico. Eventuali contestazioni su trattamenti erogati si gestiscono in struttura. In caso di rimborso Stripe su un ordine il cui voucher risulti già utilizzato, lo stato “utilizzato” resta e la pratica è valutata dalla SPA.</p>

      <h2>8. Non disponibilità e cambi</h2>
      <p>La SPA può proporre una data alternativa o un rituale equivalente se il trattamento acquistato non è erogabile per cause organizzative o di forza maggiore. Non è dovuta una nuova prestazione oltre il valore del voucher.</p>

      <h2>9. Avvertenze di salute</h2>
      <p>Alcuni rituali (in gravidanza, con essenze, con vino o altri attivi) possono essere sconsigliati. Prima della seduta è necessario comunicare al personale condizioni di salute rilevanti. La SPA può rifiutare o adattare il trattamento per motivi di sicurezza, senza che ciò costituisca inadempimento se viene offerto un’alternativa di pari valore o un voucher residuo.</p>

      <h2>10. Legge applicabile</h2>
      <p>Si applica la legge italiana. Per i consumatori restano ferme le tutele inderogabili del Codice del consumo. Foro del consumatore: luogo di residenza o domicilio elettivo.</p>

      <p>Ultimo aggiornamento: 31 agosto 2026.</p>
    </LegalShell>
  );
}
