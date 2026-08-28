import { getDb } from "../../../db";
import { contactMessages } from "../../../db/schema";

type ContactPayload = { name?: string; email?: string; phone?: string; message?: string; language?: string };
type ContactLanguage = "it" | "en" | "es" | "fr" | "de";
const contactErrors = {
  incomplete: { it: "Dati di contatto incompleti.", en: "The contact details are incomplete.", es: "Los datos de contacto están incompletos.", fr: "Les coordonnées sont incomplètes.", de: "Die Kontaktdaten sind unvollständig." },
  unavailable: { it: "Invio non disponibile. Contatta direttamente la SPA.", en: "Message service unavailable. Please contact the SPA directly.", es: "El envío no está disponible. Contacta directamente con el SPA.", fr: "Envoi indisponible. Veuillez contacter directement le SPA.", de: "Nachrichtenversand nicht verfügbar. Bitte kontaktiere das SPA direkt." },
} satisfies Record<string, Record<ContactLanguage, string>>;

export async function POST(request: Request) {
  let responseLanguage: ContactLanguage = "it";
  try {
    const payload = await request.json() as ContactPayload;
    const language = (["it", "en", "es", "fr", "de"].includes(payload.language || "") ? payload.language : "it") as ContactLanguage;
    responseLanguage = language;
    const name = payload.name?.trim() ?? "";
    const email = payload.email?.trim().toLowerCase() ?? "";
    const phone = payload.phone?.trim() ?? "";
    const message = payload.message?.trim() ?? "";
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 5 || message.length < 10) {
      return Response.json({ error: contactErrors.incomplete[language] }, { status: 400 });
    }
    await (await getDb()).insert(contactMessages).values({ id: crypto.randomUUID(), customerName: name, customerEmail: email, customerPhone: phone, message: message.slice(0, 2000), language });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: contactErrors.unavailable[responseLanguage] }, { status: 500 });
  }
}
