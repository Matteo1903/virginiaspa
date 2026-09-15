import { getDb } from "../../../db";
import { reviews } from "../../../db/schema";

type ReviewLanguage = "it" | "en" | "es" | "fr" | "de";
type ReviewPayload = {
  name?: string;
  email?: string;
  rating?: number;
  ritual?: string;
  message?: string;
  website?: string;
  language?: string;
  privacyAccepted?: boolean;
};

const reviewErrors = {
  incomplete: {
    it: "Completa tutti i dati della recensione e scegli una valutazione.",
    en: "Complete all review details and choose a rating.",
    es: "Completa todos los datos de la reseña y elige una valoración.",
    fr: "Complétez toutes les informations de l’avis et choisissez une note.",
    de: "Vervollständige alle Angaben und wähle eine Bewertung aus.",
  },
  privacy: {
    it: "Per inviare accetta l’informativa privacy.",
    en: "Please accept the privacy notice to submit your review.",
    es: "Acepta la política de privacidad para enviar tu reseña.",
    fr: "Veuillez accepter la politique de confidentialité pour envoyer votre avis.",
    de: "Bitte akzeptiere die Datenschutzerklärung, um deine Bewertung zu senden.",
  },
  unavailable: {
    it: "Invio non disponibile. Riprova più tardi.",
    en: "Submission is unavailable. Please try again later.",
    es: "El envío no está disponible. Inténtalo de nuevo más tarde.",
    fr: "L’envoi est indisponible. Veuillez réessayer plus tard.",
    de: "Das Senden ist derzeit nicht möglich. Bitte versuche es später erneut.",
  },
} satisfies Record<string, Record<ReviewLanguage, string>>;

export async function POST(request: Request) {
  let responseLanguage: ReviewLanguage = "it";
  try {
    const payload = await request.json() as ReviewPayload;
    const language = (["it", "en", "es", "fr", "de"].includes(payload.language || "") ? payload.language : "it") as ReviewLanguage;
    responseLanguage = language;

    // Honeypot: bots receive a neutral response without writing to the database.
    if ((payload.website ?? "").trim()) return Response.json({ ok: true });

    const name = (payload.name?.trim() ?? "").slice(0, 120);
    const email = (payload.email?.trim().toLowerCase() ?? "").slice(0, 254);
    const ritual = (payload.ritual?.trim() ?? "").slice(0, 120);
    const message = (payload.message?.trim() ?? "").slice(0, 1500);
    const rating = Number(payload.rating);

    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || !Number.isInteger(rating) || rating < 1 || rating > 5 || message.length < 20) {
      return Response.json({ error: reviewErrors.incomplete[language] }, { status: 400 });
    }
    if (!payload.privacyAccepted) {
      return Response.json({ error: reviewErrors.privacy[language] }, { status: 400 });
    }

    await (await getDb()).insert(reviews).values({
      id: crypto.randomUUID(),
      customerName: name,
      customerEmail: email,
      rating,
      ritual,
      message,
      language,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: reviewErrors.unavailable[responseLanguage] }, { status: 500 });
  }
}
