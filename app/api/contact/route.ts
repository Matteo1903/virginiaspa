import { getDb } from "../../../db";
import { contactMessages } from "../../../db/schema";
import { sendContactNotification } from "../../../lib/email";

type ContactPayload = { name?: string; email?: string; phone?: string; message?: string; language?: string; privacyAccepted?: boolean };
type ContactLanguage = "it" | "en" | "es" | "fr" | "de";
const contactErrors = {
  incomplete: { it: "Dati di contatto incompleti.", en: "The contact details are incomplete.", es: "Los datos de contacto están incompletos.", fr: "Les coordonnées sont incomplètes.", de: "Die Kontaktdaten sind unvollständig." },
  privacy: { it: "Per inviare accetta l’informativa privacy.", en: "Please accept the privacy notice to send the message.", es: "Acepta la informativa de privacidad para enviar el mensaje.", fr: "Veuillez accepter l’informativa privacy pour envoyer le message.", de: "Bitte akzeptiere die Datenschutzerklärung, um die Nachricht zu senden." },
  unavailable: { it: "Invio non disponibile. Contatta direttamente la SPA.", en: "Message service unavailable. Please contact the SPA directly.", es: "El envío no está disponible. Contacta directamente con el SPA.", fr: "Envoi indisponible. Veuillez contacter directement le SPA.", de: "Nachrichtenversand nicht verfügbar. Bitte kontaktiere das SPA direkt." },
} satisfies Record<string, Record<ContactLanguage, string>>;

export async function POST(request: Request) {
  let responseLanguage: ContactLanguage = "it";
  try {
    const payload = await request.json() as ContactPayload;
    const language = (["it", "en", "es", "fr", "de"].includes(payload.language || "") ? payload.language : "it") as ContactLanguage;
    responseLanguage = language;
    const name = (payload.name?.trim() ?? "").slice(0, 120);
    const email = (payload.email?.trim().toLowerCase() ?? "").slice(0, 254);
    const phone = (payload.phone?.trim() ?? "").slice(0, 40);
    const message = (payload.message?.trim() ?? "").slice(0, 2000);
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 5 || message.length < 10) {
      return Response.json({ error: contactErrors.incomplete[language] }, { status: 400 });
    }
    if (!payload.privacyAccepted) {
      return Response.json({ error: contactErrors.privacy[language] }, { status: 400 });
    }
    await (await getDb()).insert(contactMessages).values({ id: crypto.randomUUID(), customerName: name, customerEmail: email, customerPhone: phone, message, language });
    try {
      await sendContactNotification({ name, email, phone, message, language });
    } catch (error) {
      console.error("email contatto", error);
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: contactErrors.unavailable[responseLanguage] }, { status: 500 });
  }
}
