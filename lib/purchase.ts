import type { Language } from "../app/i18n";

export const purchaseCopy: Record<Language, {
  title: string;
  body: string;
  add: string;
  next: string;
  stripeLine: string;
  stripeSubmit: string;
  svgNote: string;
  testBanner: string;
  emailSubject: string;
  download: string;
}> = {
  it: {
    title: "Stai acquistando un voucher, non una prenotazione.",
    body: "Il pagamento online emette una card/voucher digitale. Data, orario e dettagli del rituale si definiscono dopo, contattando Virginia SPA.",
    add: "Acquista il voucher",
    next: "Scarica il voucher, poi contatta la struttura per scegliere data, orario e finalizzare la prenotazione.",
    stripeLine: "Voucher digitale. Non è una prenotazione: dopo l’acquisto contatta Virginia SPA per data e orario.",
    stripeSubmit: "Acquisti un voucher. La prenotazione si completa in SPA.",
    svgNote: "Non è una prenotazione. Contatta Virginia SPA per data e orario.",
    testBanner: "Pagamento di prova (Stripe test). Nessun addebito reale.",
    emailSubject: "Virginia SPA: i tuoi voucher sono pronti",
    download: "Scarica",
  },
  en: {
    title: "You are buying a voucher, not a booking.",
    body: "Online payment issues a digital card/voucher. Date, time and ritual details are arranged afterwards by contacting Virginia SPA.",
    add: "Buy the voucher",
    next: "Download the voucher, then contact the spa to choose date, time and finalise your appointment.",
    stripeLine: "Digital voucher. This is not a booking: contact Virginia SPA after purchase to set date and time.",
    stripeSubmit: "You are buying a voucher. The appointment is arranged at the spa.",
    svgNote: "This is not a booking. Contact Virginia SPA for date and time.",
    testBanner: "Test payment (Stripe test mode). No real charge will be made.",
    emailSubject: "Virginia SPA: your vouchers are ready",
    download: "Download",
  },
  es: {
    title: "Estás comprando un bono, no una reserva.",
    body: "El pago online emite una tarjeta/bono digital. Fecha, hora y detalles del ritual se acuerdan después, contactando con Virginia SPA.",
    add: "Comprar el bono",
    next: "Descarga el bono y contacta con el centro para elegir fecha, hora y finalizar la reserva.",
    stripeLine: "Bono digital. No es una reserva: después de comprar, contacta con Virginia SPA para fecha y hora.",
    stripeSubmit: "Compras un bono. La reserva se completa en el SPA.",
    svgNote: "No es una reserva. Contacta con Virginia SPA para fecha y hora.",
    testBanner: "Pago de prueba (Stripe test). No se realizará ningún cargo real.",
    emailSubject: "Virginia SPA: tus bonos están listos",
    download: "Descargar",
  },
  fr: {
    title: "Vous achetez un bon, pas une réservation.",
    body: "Le paiement en ligne délivre une carte/bon numérique. Date, horaire et détails du rituel se définissent ensuite auprès de Virginia SPA.",
    add: "Acheter le bon",
    next: "Téléchargez le bon, puis contactez l’établissement pour choisir date, horaire et finaliser la réservation.",
    stripeLine: "Bon numérique. Ce n’est pas une réservation : contactez Virginia SPA après l’achat pour la date et l’heure.",
    stripeSubmit: "Vous achetez un bon. Le rendez-vous se prend au SPA.",
    svgNote: "Ce n’est pas une réservation. Contactez Virginia SPA pour la date et l’heure.",
    testBanner: "Paiement d’essai (mode test Stripe). Aucun débit réel.",
    emailSubject: "Virginia SPA : vos bons sont prêts",
    download: "Télécharger",
  },
  de: {
    title: "Du kaufst einen Gutschein, keine Terminbuchung.",
    body: "Die Online-Zahlung erstellt eine digitale Karte/einen Gutschein. Datum, Uhrzeit und Ritualdetails vereinbarst du danach mit Virginia SPA.",
    add: "Gutschein kaufen",
    next: "Lade den Gutschein herunter und kontaktiere das SPA, um Datum, Uhrzeit und Termin festzulegen.",
    stripeLine: "Digitaler Gutschein. Keine Terminbuchung: nach dem Kauf Virginia SPA für Datum und Uhrzeit kontaktieren.",
    stripeSubmit: "Du kaufst einen Gutschein. Der Termin wird im SPA vereinbart.",
    svgNote: "Keine Terminbuchung. Virginia SPA für Datum und Uhrzeit kontaktieren.",
    testBanner: "Testzahlung (Stripe-Testmodus). Es wird nichts wirklich belastet.",
    emailSubject: "Virginia SPA: deine Gutscheine sind bereit",
    download: "Herunterladen",
  },
};
