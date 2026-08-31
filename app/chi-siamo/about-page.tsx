"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Language } from "../i18n";
import { languages } from "../i18n";
import LanguagePicker from "../language-picker";
import { SiteFooter, ThemeToggle } from "../site-chrome";

const copy: Record<Language, { back: string; eyebrow: string; title: string; intro: string; team: string; demo: string; cta: string; people: { name: string; role: string; description: string; focus: string }[] }> = {
  it: { back: "Torna alla home", eyebrow: "Le persone di Virginia SPA", title: "La cura nasce da chi sa ascoltare.", intro: "Dietro ogni rituale ci sono presenza, competenza e mani esperte. Conosci le persone che trasformano ogni trattamento in un’esperienza personale.", team: "Il nostro staff", demo: "Nomi, fotografie e profili attualmente dimostrativi, da sostituire con i dati ufficiali dello staff.", cta: "Contatta la SPA", people: [
    { name: "Virginia", role: "Founder · Wellness Consultant", description: "Accoglie ogni persona partendo dall’ascolto. Coordina la filosofia Virginia SPA e costruisce percorsi di benessere capaci di unire ritualità, bellezza e attenzione autentica.", focus: "Consulenza · Percorsi personalizzati · Accoglienza" },
    { name: "Elena", role: "Head Spa Specialist", description: "Si dedica alla salute e al benessere di cute e capelli attraverso manualità lente, rituali sensoriali e trattamenti studiati per favorire leggerezza e rilassamento profondo.", focus: "Head Spa · Massaggio della testa · Aromaterapia" },
    { name: "Martina", role: "Beauty & Body Specialist", description: "Lavora sul viso e sul corpo con un approccio delicato e preciso. Unisce trattamenti estetici, massaggi e gesti di cura per valorizzare la bellezza individuale.", focus: "Viso · Corpo · Massaggi benessere" },
  ] },
  en: { back: "Back to home", eyebrow: "The people of Virginia SPA", title: "Care begins with those who know how to listen.", intro: "Behind every ritual are presence, expertise and skilled hands. Meet the people who turn every treatment into a personal experience.", team: "Our team", demo: "Names, photographs and profiles are currently demonstrative and should be replaced with the team’s official details.", cta: "Contact the SPA", people: [
    { name: "Virginia", role: "Founder · Wellness Consultant", description: "She welcomes every guest by listening first. She leads the Virginia SPA philosophy and creates wellbeing journeys that unite ritual, beauty and genuine attention.", focus: "Consultation · Personal journeys · Welcome" },
    { name: "Elena", role: "Head Spa Specialist", description: "She cares for scalp and hair wellbeing through slow expert touch, sensory rituals and treatments designed to encourage lightness and deep relaxation.", focus: "Head Spa · Head massage · Aromatherapy" },
    { name: "Martina", role: "Beauty & Body Specialist", description: "She works on face and body with a gentle, precise approach, combining beauty treatments, massage and caring gestures to enhance individual beauty.", focus: "Face · Body · Wellness massage" },
  ] },
  es: { back: "Volver al inicio", eyebrow: "Las personas de Virginia SPA", title: "El cuidado nace de quien sabe escuchar.", intro: "Detrás de cada ritual hay presencia, experiencia y manos expertas. Conoce a quienes transforman cada tratamiento en una experiencia personal.", team: "Nuestro equipo", demo: "Los nombres, fotografías y perfiles son actualmente demostrativos y deberán sustituirse por los datos oficiales del equipo.", cta: "Contactar con el SPA", people: [
    { name: "Virginia", role: "Fundadora · Consultora de bienestar", description: "Recibe a cada persona empezando por la escucha. Coordina la filosofía Virginia SPA y crea recorridos que unen ritualidad, belleza y atención auténtica.", focus: "Consulta · Recorridos personalizados · Acogida" },
    { name: "Elena", role: "Especialista Head Spa", description: "Se dedica al bienestar del cuero cabelludo y el cabello mediante técnicas lentas, rituales sensoriales y tratamientos para favorecer ligereza y relajación profunda.", focus: "Head Spa · Masaje de cabeza · Aromaterapia" },
    { name: "Martina", role: "Especialista Beauty & Body", description: "Trabaja rostro y cuerpo con un enfoque delicado y preciso, combinando tratamientos estéticos, masajes y gestos de cuidado para realzar la belleza individual.", focus: "Rostro · Cuerpo · Masajes de bienestar" },
  ] },
  fr: { back: "Retour à l’accueil", eyebrow: "Les personnes de Virginia SPA", title: "Le soin naît de celles qui savent écouter.", intro: "Derrière chaque rituel se trouvent présence, expertise et mains expertes. Découvrez celles qui transforment chaque soin en expérience personnelle.", team: "Notre équipe", demo: "Les noms, photographies et profils sont actuellement démonstratifs et devront être remplacés par les informations officielles de l’équipe.", cta: "Contacter le SPA", people: [
    { name: "Virginia", role: "Fondatrice · Consultante bien-être", description: "Elle accueille chaque personne en commençant par l’écoute. Elle porte la philosophie Virginia SPA et crée des parcours alliant rituel, beauté et attention authentique.", focus: "Conseil · Parcours personnalisés · Accueil" },
    { name: "Elena", role: "Spécialiste Head Spa", description: "Elle prend soin du cuir chevelu et des cheveux grâce à des gestes lents, des rituels sensoriels et des soins favorisant légèreté et relaxation profonde.", focus: "Head Spa · Massage de la tête · Aromathérapie" },
    { name: "Martina", role: "Spécialiste Beauty & Body", description: "Elle travaille le visage et le corps avec douceur et précision, associant soins esthétiques, massages et gestes attentionnés pour révéler la beauté de chacun.", focus: "Visage · Corps · Massages bien-être" },
  ] },
  de: { back: "Zurück zur Startseite", eyebrow: "Die Menschen bei Virginia SPA", title: "Fürsorge beginnt bei Menschen, die zuhören können.", intro: "Hinter jedem Ritual stehen Präsenz, Kompetenz und erfahrene Hände. Lerne die Menschen kennen, die jede Behandlung zu einem persönlichen Erlebnis machen.", team: "Unser Team", demo: "Namen, Fotografien und Profile sind derzeit Demo-Inhalte und werden später durch die offiziellen Teamdaten ersetzt.", cta: "SPA kontaktieren", people: [
    { name: "Virginia", role: "Gründerin · Wellness-Beraterin", description: "Sie empfängt jeden Menschen mit aufmerksamem Zuhören. Sie prägt die Philosophie von Virginia SPA und entwickelt Wege, die Ritual, Schönheit und echte Aufmerksamkeit verbinden.", focus: "Beratung · Individuelle Wege · Empfang" },
    { name: "Elena", role: "Head-Spa-Spezialistin", description: "Sie widmet sich Kopfhaut und Haar mit langsamen Berührungen, sinnlichen Ritualen und Behandlungen für Leichtigkeit und tiefe Entspannung.", focus: "Head Spa · Kopfmassage · Aromatherapie" },
    { name: "Martina", role: "Beauty-&-Body-Spezialistin", description: "Sie behandelt Gesicht und Körper sanft und präzise und verbindet Beauty-Anwendungen, Massagen und achtsame Gesten, um individuelle Schönheit zu unterstreichen.", focus: "Gesicht · Körper · Wellnessmassagen" },
  ] },
};

const images = ["/staff-director-demo.jpg", "/staff-head-spa-demo.jpg", "/staff-body-demo.jpg"];

export default function AboutPage() {
  const [language, setLanguage] = useState<Language>("it"); const [languageOpen, setLanguageOpen] = useState(false);
  useEffect(() => { const saved = localStorage.getItem("virginia-language") as Language | null; const frame = requestAnimationFrame(() => { if (saved && languages.some(({ code }) => code === saved)) setLanguage(saved); }); return () => cancelAnimationFrame(frame); }, []);
  useEffect(() => { document.documentElement.lang = language; localStorage.setItem("virginia-language", language); }, [language]);
  const text = copy[language];
  return <main className="about-page-shell"><header className="gift-page-header"><Link className="brand" href="/">Virginia <em>SPA</em></Link><Link className="gift-back-link" href="/">← {text.back}</Link><div className="subpage-actions"><LanguagePicker language={language} open={languageOpen} onToggle={() => setLanguageOpen((value) => !value)} onChange={(value) => { setLanguage(value); setLanguageOpen(false); }} /><ThemeToggle language={language} /></div></header>
    <section className="about-hero"><p>{text.eyebrow}</p><h1>{text.title}</h1><span>{text.intro}</span></section>
    <section className="team-section"><div className="team-heading"><p>{text.team}</p><span>{text.demo}</span></div><div className="team-grid">{text.people.map((person, index) => <article className="team-card" key={person.name}><div className="team-photo"><Image src={images[index]} alt={`${person.name} · ${person.role}`} fill unoptimized sizes="(max-width:700px) 100vw, 33vw" /></div><div className="team-copy"><span>{String(index + 1).padStart(2,"0")}</span><p>{person.role}</p><h2>{person.name}</h2><div>{person.description}</div><small>{person.focus}</small></div></article>)}</div></section>
    <section className="about-contact"><p>{text.intro}</p><Link className="button button-light" href="/#contatti">{text.cta}<span>→</span></Link></section><SiteFooter language={language} />
  </main>;
}
