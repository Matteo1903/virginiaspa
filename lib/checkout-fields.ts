import type { Language } from "../app/i18n";

export type CheckoutField = "name" | "email" | "phone";

const emailPattern = /^\S+@\S+\.\S+$/;

export const invalidCheckoutFields = (input: { name?: string | null; email?: string | null; phone?: string | null }): CheckoutField[] => {
  const fields: CheckoutField[] = [];
  if (!(input.name || "").trim()) fields.push("name");
  if (!emailPattern.test((input.email || "").trim())) fields.push("email");
  if ((input.phone || "").trim().length < 5) fields.push("phone");
  return fields;
};

export const checkoutFieldMessage: Record<Language, Record<CheckoutField, string>> = {
  it: {
    name: "Inserisci nome e cognome.",
    email: "L’email non è valida.",
    phone: "Il telefono è troppo corto: servono almeno 5 cifre.",
  },
  en: {
    name: "Enter your first and last name.",
    email: "The email address is not valid.",
    phone: "The phone number is too short: enter at least 5 digits.",
  },
  es: {
    name: "Escribe nombre y apellidos.",
    email: "El email no es válido.",
    phone: "El teléfono es demasiado corto: hacen falta al menos 5 cifras.",
  },
  fr: {
    name: "Indiquez nom et prénom.",
    email: "L’adresse e-mail n’est pas valide.",
    phone: "Le téléphone est trop court : il faut au moins 5 chiffres.",
  },
  de: {
    name: "Bitte Vor- und Nachnamen eintragen.",
    email: "Die E-Mail-Adresse ist ungültig.",
    phone: "Die Telefonnummer ist zu kurz: mindestens 5 Ziffern.",
  },
};
