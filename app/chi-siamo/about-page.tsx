"use client";

import { useSiteDocumentTitle, useSiteLanguage } from "../use-site-language";
import type { Language } from "../i18n";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";

const copy: Record<Language, { eyebrow: string; title: string; intro: string; body: string; offer: string; ctaLead: string; ctaShop: string; ctaContact: string }> = {
  it: {
    eyebrow: "Virginia SPA · Latina",
    title: "Un luogo per rallentare, non per inseguire un protocollo.",
    intro: "Virginia SPA è una beauty farm a Latina. Online trovi i rituali e i percorsi HEAD SPA che puoi acquistare come voucher: data e orario si definiscono dopo, parlando con noi.",
    body: "Non pubblichiamo ritratti dello staff finché nomi e fotografie non sono quelli reali. Nel frattempo puoi conoscere il metodo, i rituali in vendita e scriverci per una consulenza.",
    offer: "In vendita ora: cinque rituali (Terra, Luna, Rosa, Surya, Luce d’Ambra), i percorsi HEAD SPA e le Gift Card digitali.",
    ctaLead: "Vuoi un consiglio sul rituale, o hai una domanda sul voucher? Scrivici: ti rispondiamo noi.",
    ctaShop: "Vedi le esperienze",
    ctaContact: "Scrivi alla SPA",
  },
  en: {
    eyebrow: "Virginia SPA · Latina",
    title: "A place to slow down, not to follow a protocol.",
    intro: "Virginia SPA is a beauty farm in Latina. Online you will find the rituals and HEAD SPA journeys you can buy as vouchers: date and time are arranged afterwards, by speaking with us.",
    body: "We do not publish staff portraits until names and photographs are the real ones. In the meantime you can explore the method, the rituals on sale and write to us for advice.",
    offer: "On sale now: five rituals (Earth, Moon, Rose, Surya, Amber Light), HEAD SPA journeys and digital Gift Cards.",
    ctaLead: "Would you like advice on a ritual, or do you have a question about a voucher? Write to us and we will reply.",
    ctaShop: "See the experiences",
    ctaContact: "Write to the SPA",
  },
  es: {
    eyebrow: "Virginia SPA · Latina",
    title: "Un lugar para bajar el ritmo, no para seguir un protocolo.",
    intro: "Virginia SPA es una beauty farm en Latina. Online encuentras los rituales y recorridos HEAD SPA que puedes comprar como bono: fecha y hora se acuerdan después, hablando con nosotros.",
    body: "No publicamos retratos del equipo hasta que nombres y fotografías sean los reales. Mientras tanto puedes conocer el método, los rituales a la venta y escribirnos para una consulta.",
    offer: "A la venta ahora: cinco rituales (Tierra, Luna, Rosa, Surya, Luz de Ámbar), recorridos HEAD SPA y tarjetas regalo digitales.",
    ctaLead: "¿Quieres consejo sobre un ritual o tienes una pregunta sobre el bono? Escríbenos: te responderemos.",
    ctaShop: "Ver las experiencias",
    ctaContact: "Escribir al SPA",
  },
  fr: {
    eyebrow: "Virginia SPA · Latina",
    title: "Un lieu pour ralentir, pas pour suivre un protocole.",
    intro: "Virginia SPA est une beauty farm à Latina. En ligne, vous trouvez les rituels et parcours HEAD SPA à acheter sous forme de bon : date et horaire se définissent ensuite, en nous parlant.",
    body: "Nous ne publions pas de portraits de l’équipe tant que noms et photographies ne sont pas les vrais. En attendant, vous pouvez découvrir la méthode, les rituels en vente et nous écrire pour un conseil.",
    offer: "En vente actuellement : cinq rituels (Terre, Lune, Rose, Surya, Lumière d’Ambre), les parcours HEAD SPA et les cartes cadeaux numériques.",
    ctaLead: "Vous souhaitez un conseil sur un rituel, ou vous avez une question sur le bon ? Écrivez-nous : nous vous répondrons.",
    ctaShop: "Voir les expériences",
    ctaContact: "Écrire au SPA",
  },
  de: {
    eyebrow: "Virginia SPA · Latina",
    title: "Ein Ort zum Entschleunigen, kein Standardprotokoll.",
    intro: "Virginia SPA ist eine Beauty Farm in Latina. Online findest du Rituale und HEAD-SPA-Wege, die du als Gutschein kaufen kannst: Datum und Uhrzeit vereinbarst du danach im Gespräch mit uns.",
    body: "Wir zeigen keine Teamfotos, solange Namen und Bilder nicht die echten sind. Bis dahin kannst du die Methode und die käuflichen Rituale kennenlernen und uns für eine Beratung schreiben.",
    offer: "Jetzt erhältlich: fünf Rituale (Erde, Mond, Rose, Surya, Bernsteinlicht), HEAD-SPA-Wege und digitale Geschenkkarten.",
    ctaLead: "Möchtest du eine Beratung zum Ritual oder hast du eine Frage zum Gutschein? Schreib uns — wir antworten.",
    ctaShop: "Erlebnisse ansehen",
    ctaContact: "SPA schreiben",
  },
};

export default function AboutPage() {
  const [language, setLanguage] = useSiteLanguage();
  const text = copy[language];
  useSiteDocumentTitle(language === "it" ? "Chi siamo" : language === "en" ? "About us" : language === "es" ? "Quiénes somos" : language === "fr" ? "Qui sommes-nous" : "Über uns");
  return <main className="about-page-shell"><SiteHeader language={language} onLanguageChange={setLanguage} />
    <section id="main-content" tabIndex={-1} className="about-hero"><p>{text.eyebrow}</p><h1>{text.title}</h1><span>{text.intro}</span></section>
    <section className="about-offer"><p>{text.body}</p><p>{text.offer}</p></section>
    <section className="about-contact"><p>{text.ctaLead}</p><div className="about-contact-actions"><Link className="button button-light" href="/#shop">{text.ctaShop}<span>→</span></Link><Link className="button button-light" href="/#contatti">{text.ctaContact}<span>→</span></Link></div></section><SiteFooter language={language} />
  </main>;
}
