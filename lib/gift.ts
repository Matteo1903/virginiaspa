import type { Language } from "../app/i18n";
import { allowedGiftAmounts, checkoutCatalog } from "./catalog";

export const giftCopy: Record<Language, { ritual: string; noRitual: string; hint: string; selectedHint: string; recipient: string }> = {
  it: { ritual: "Rituale da regalare (facoltativo)", noRitual: "Lascia scegliere a chi riceve", hint: "Puoi regalare un valore libero oppure scegliere un rituale: in questo caso il valore del regalo corrisponde al suo prezzo.", selectedHint: "Stai regalando il rituale selezionato. Per tornare a un regalo a valore libero, scegli un importo o lascia vuota la scelta del rituale.", recipient: "Per" },
  en: { ritual: "Ritual to give (optional)", noRitual: "Let the recipient choose", hint: "You can give a monetary gift or choose a ritual: in that case, the gift value matches its price.", selectedHint: "You are giving the selected ritual. To return to a monetary gift, choose an amount or clear the ritual selection.", recipient: "For" },
  es: { ritual: "Ritual para regalar (opcional)", noRitual: "Deja que elija quien lo recibe", hint: "Puedes regalar un importe o elegir un ritual: en ese caso, el valor del regalo corresponde a su precio.", selectedHint: "Estás regalando el ritual seleccionado. Para volver a un regalo por importe, elige una cantidad o deja vacía la selección del ritual.", recipient: "Para" },
  fr: { ritual: "Rituel à offrir (facultatif)", noRitual: "Laissez la personne choisir", hint: "Vous pouvez offrir un montant ou choisir un rituel : dans ce cas, la valeur du cadeau correspond à son prix.", selectedHint: "Vous offrez le rituel sélectionné. Pour revenir à un cadeau d’un montant libre, choisissez un montant ou effacez la sélection du rituel.", recipient: "Pour" },
  de: { ritual: "Ritual zum Verschenken (optional)", noRitual: "Die beschenkte Person entscheidet", hint: "Du kannst einen Geldwert verschenken oder ein Ritual wählen: Dann entspricht der Geschenkwert seinem Preis.", selectedHint: "Du verschenkst das ausgewählte Ritual. Für ein Wertgeschenk wähle einen Betrag oder hebe die Ritualauswahl auf.", recipient: "Für" },
};

export const giftRitualIds = Object.keys(checkoutCatalog).filter((id) => checkoutCatalog[id].available !== false);

export function getGiftRitual(id: string) {
  return Object.hasOwn(checkoutCatalog, id) && checkoutCatalog[id].available !== false ? checkoutCatalog[id] : undefined;
}

/** Selected rituals always use their server catalog price; only open gifts accept preset amounts. */
export function resolveGiftPurchase(ritualId: unknown, price: unknown, language: Language) {
  if (ritualId !== undefined && ritualId !== "") {
    const product = typeof ritualId === "string" ? getGiftRitual(ritualId) : undefined;
    if (!product) throw new Error("INVALID_GIFT_SELECTION");
    return { productId: ritualId as string, title: product.titles?.[language] || product.title, unitAmount: product.unitAmount, duration: giftRitualDetail(product.duration, "", language) };
  }
  const amount = Math.round(Number(price) * 100);
  if (!allowedGiftAmounts.has(amount)) throw new Error("INVALID_GIFT_SELECTION");
  return { productId: "gift-card", title: "Virginia SPA Gift Card", unitAmount: amount, duration: "" };
}

export function giftRitualDetail(duration: string, recipient: string, language: Language) {
  const people: Record<Language, string> = { it: "2 persone", en: "2 people", es: "2 personas", fr: "2 personnes", de: "2 Personen" };
  return [duration.replace(/^2 persone/, people[language]), recipient ? `${giftCopy[language].recipient}: ${recipient}` : ""].filter(Boolean).join(" · ");
}
