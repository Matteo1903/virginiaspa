"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { translate, type Language } from "./i18n";
import { ritualExperiences } from "./ritual-experiences";
import { giftAmountEuros, priceEuros, pricesAreProvisional } from "../lib/catalog";
import { readStoredCart, writeStoredCart, type StoredCartItem } from "../lib/cart";
import { PurchaseNotice } from "./purchase-notice";

type Need = "all" | "relax" | "skin" | "body" | "couple";
type Product = { id: string; title: string; subtitle: string; description: string; need: Exclude<Need, "all">; sessions: string; price: number; image: string; featured?: boolean };
type CartItem = StoredCartItem;

const products: Product[] = [
  { id: "cielo-terra", title: "Cielo & Terra", subtitle: "HEAD SPA · Equilibrio", description: "Un rituale riequilibrante che unisce testa, respiro e radicamento per ritrovare presenza e leggerezza.", need: "relax", sessions: "1 rituale · 75 min", price: priceEuros("cielo-terra"), image: "/water-stilllife.webp", featured: true },
  { id: "radici-armonia", title: "Radici di Armonia", subtitle: "HEAD SPA · Riequilibrio", description: "Un rituale per fermarsi, respirare e ritrovare se stessi.", need: "relax", sessions: "1 rituale · 60 min", price: priceEuros("radici-armonia"), image: "/hero-ritual.webp" },
  { id: "abbandono-sensoriale", title: "Abbandono Sensoriale", subtitle: "HEAD SPA · Relax profondo", description: "Un viaggio sensoriale pensato per lasciare andare il rumore, rallentare il ritmo e ritrovare una quiete completa.", need: "relax", sessions: "1 rituale · 90 min", price: priceEuros("abbandono-sensoriale"), image: "/face-treatment.webp" },
  { id: "wine-essence", title: "Wine Essence", subtitle: "HEAD SPA · Rituale antiossidante", description: "La forza e la preziosità delle uve incontrano il piacere di un'esperienza di puro benessere.", need: "skin", sessions: "1 rituale · 75 min", price: priceEuros("wine-essence"), image: "/water-stilllife.webp" },
  { id: "abbraccio-vita", title: "Abbraccio di Vita", subtitle: "HEAD SPA · Dolce attesa", description: "Uno spazio tutto per sé, per rallentare, respirare e vivere la gravidanza con dolcezza.", need: "body", sessions: "1 rituale · 60 min", price: priceEuros("abbraccio-vita"), image: "/hero-ritual.webp" },
  { id: "carezza", title: "Carezza", subtitle: "HEAD SPA · Delicatezza", description: "Un percorso essenziale e gentile che trasforma il tocco in una pausa di autentico benessere.", need: "skin", sessions: "1 rituale · 45 min", price: priceEuros("carezza"), image: "/face-treatment.webp" },
  { id: "two-souls", title: "Two Souls Ritual", subtitle: "HEAD SPA · Rituale di coppia", description: "Un’esperienza da condividere: due rituali sincronizzati per rallentare insieme e custodire un ricordo speciale.", need: "couple", sessions: "2 persone · 90 min", price: priceEuros("two-souls"), image: "/hero-ritual.webp" },
];

const detailedDescriptions: Record<string, string> = {
  "cielo-terra": `Un viaggio di benessere dalla testa ai piedi, pensato per riequilibrare corpo e mente attraverso un’esperienza avvolgente e profondamente rilassante.

Cielo è la testa: il punto da cui tutto inizia. Un rituale dedicato al cuoio capelluto e alla testa, fatto di detersione, massaggi e gesti delicati che aiutano a sciogliere le tensioni, liberare la mente e ritrovare una piacevole sensazione di leggerezza.

Terra sono i piedi: il nostro punto di contatto con il mondo. Un trattamento dedicato a questa parte del corpo, con rituali e massaggi studiati per regalare comfort, distensione e una sensazione di radicamento.

Cielo e Terra si incontrano in un unico percorso, creando un equilibrio tra leggerezza e radicamento, energia e abbandono, mente e corpo.

Un’esperienza da vivere lentamente, lasciandosi guidare dal ritmo dei trattamenti e dal piacere di ritrovare il proprio equilibrio.

Dalla testa ai piedi. Dal Cielo alla Terra. Un rituale per ritrovare sé stessi.`,
  "radici-armonia": `Un percorso dedicato al relax e al benessere profondo, un rituale che coinvolge corpo, mente e sensi.

Un’esperienza completa che unisce trattamenti nutrienti e purificanti per viso, cute e lunghezze, accompagnati da delicati massaggi al viso e alla testa.

Il viaggio prosegue attraverso l’aromaterapia con oli essenziali e le vibrazioni armoniche della campana tibetana, e si conclude con uno styling finale, per lasciare andare le tensioni e ritrovare una sensazione di leggerezza, equilibrio e profonda armonia.`,
  "abbandono-sensoriale": `Un rituale di rinascita che percorre tutto il corpo, dalle estremità fino al cuoio capelluto, portando a un relax profondo.

Ideale quando si ha bisogno di una ripartenza. La vasca sensoriale con profumi e fiori completa l’esperienza di totale armonia.`,
  "wine-essence": `Wine Essence è un rituale HEAD SPA alle uve, un’esperienza sensoriale che unisce il benessere dei capelli e della cute al piacere e all’essenza del vino.

Il percorso inizia con un rituale di benvenuto e aromaterapia, per preparare corpo e mente al relax. Prosegue con un massaggio olistico, un trattamento HEAD SPA per cute e capelli a base di uve e un rilassante massaggio alle mani.

L’esperienza si conclude con una degustazione e un calice di vino, per assaporare fino in fondo l’atmosfera del rituale, e con lo styling finale.`,
  "abbraccio-vita": `Un rituale di benessere pensato per accompagnare la donna durante la gravidanza, regalando un momento di profondo relax, cura e ascolto del corpo.

Il trattamento unisce un delicato massaggio corpo con sfioramenti avvolgenti, studiati per favorire una piacevole sensazione di leggerezza e distensione, a un rituale di nutrizione e coccola della pelle.

L’esperienza prosegue con un momento dedicato al relax di cute e capelli, attraverso gesti delicati e avvolgenti che aiutano a lasciare andare tensioni e pensieri, trasformando il trattamento in una vera pausa di benessere.`,
  carezza: `Un percorso essenziale in cui il tocco diventa cura. Detersione delicata, acqua e manualità leggere accompagnano la testa e il cuoio capelluto verso una sensazione immediata di comfort.

I gesti sono morbidi, misurati e continui, ideali per chi desidera avvicinarsi all’esperienza HEAD SPA con semplicità o concedersi una pausa breve ma autentica.

Una carezza che rallenta il tempo e restituisce leggerezza, calma e presenza.`,
  "two-souls": `Un percorso pensato per ritrovare equilibrio, rilassarsi e condividere un momento speciale a due, in un’atmosfera di totale benessere.

Per lei — Rituale Radici di Armonia
Un rituale avvolgente dedicato al riequilibrio e alla riconnessione con sé stessa, per ritrovare leggerezza, armonia e profondo relax.

Per lui — Relax Experience
Un piacevole massaggio rilassante su tutto il corpo, seguito da un rigenerante bagno di vapore Swedana e da un trattamento viso con fango Black Mus, per una sensazione di benessere completa.

Il momento finale — Together Time
L’esperienza si conclude insieme in una suggestiva vasca idromassaggio, lasciandosi coccolare dall’acqua e dalla tranquillità del momento, accompagnati da una raffinata degustazione.`,
};

const translatedDetailedDescriptions: Record<Exclude<Language, "it">, Record<string, string>> = {
  en: {
    "cielo-terra": `A wellbeing journey from head to toe, designed to rebalance body and mind through an enveloping, deeply relaxing experience.

Sky is the head: the point where everything begins. A ritual for the scalp and head, combining cleansing, massage and delicate gestures that help release tension, clear the mind and restore a pleasant feeling of lightness.

Earth is the feet: our point of contact with the world. A treatment dedicated to this part of the body, with rituals and massages designed to offer comfort, relaxation and a sense of grounding.

Sky and Earth meet in one journey, creating balance between lightness and grounding, energy and surrender, mind and body.

An experience to enjoy slowly, guided by the rhythm of the treatments and the pleasure of rediscovering your own balance.

From head to toe. From Sky to Earth. A ritual to find yourself again.`,
    "radici-armonia": `A journey devoted to deep relaxation and wellbeing, a ritual that engages body, mind and senses.

A complete experience combining nourishing and purifying treatments for the face, scalp and hair lengths, accompanied by delicate face and head massages.

The journey continues with essential-oil aromatherapy and the harmonious vibrations of a Tibetan singing bowl, ending with final styling to release tension and rediscover lightness, balance and profound harmony.`,
    "abbandono-sensoriale": `A rebirth ritual that travels through the entire body, from the extremities to the scalp, leading to deep relaxation.

Ideal when you need a fresh start. The sensory tub with fragrances and flowers completes an experience of total harmony.`,
    "wine-essence": `Wine Essence is a grape-based HEAD SPA ritual, a sensory experience combining the wellbeing of hair and scalp with the pleasure and essence of wine.

The journey begins with a welcome ritual and aromatherapy to prepare body and mind for relaxation. It continues with a holistic massage, a grape-based HEAD SPA treatment for scalp and hair, and a relaxing hand massage.

The experience ends with a wine tasting and a glass of wine, allowing you to savour the ritual’s atmosphere fully, followed by final styling.`,
    "abbraccio-vita": `A wellbeing ritual designed to support women during pregnancy, offering a moment of deep relaxation, care and awareness of the body.

The treatment combines a gentle body massage with enveloping strokes designed to create a pleasant feeling of lightness and release, together with a nourishing, pampering skin ritual.

The experience continues with a moment devoted to scalp and hair relaxation, using delicate, enveloping gestures that help release tension and thoughts, transforming the treatment into a true wellbeing pause.`,
    carezza: `An essential journey in which touch becomes care. Gentle cleansing, water and light techniques guide the head and scalp towards an immediate feeling of comfort.

The gestures are soft, measured and continuous—ideal for discovering the HEAD SPA experience with simplicity or enjoying a short but authentic pause.

A caress that slows time and restores lightness, calm and presence.`,
    "two-souls": `A journey designed to restore balance, relax and share a special moment for two in an atmosphere of complete wellbeing.

For her — Roots of Harmony Ritual
An enveloping ritual devoted to rebalancing and reconnecting with herself, restoring lightness, harmony and deep relaxation.

For him — Relax Experience
A pleasant full-body relaxation massage, followed by a regenerating Swedana steam bath and a facial treatment with Black Mus mud, for a complete feeling of wellbeing.

The final moment — Together Time
The experience ends together in an evocative whirlpool bath, embraced by the water and the tranquillity of the moment, accompanied by a refined tasting.`,
  },
  es: {
    "cielo-terra": `Un viaje de bienestar de la cabeza a los pies, pensado para reequilibrar cuerpo y mente mediante una experiencia envolvente y profundamente relajante.

Cielo es la cabeza: el punto donde todo comienza. Un ritual dedicado al cuero cabelludo y la cabeza, con limpieza, masajes y gestos delicados que ayudan a liberar tensiones, despejar la mente y recuperar una agradable sensación de ligereza.

Tierra son los pies: nuestro punto de contacto con el mundo. Un tratamiento dedicado a esta parte del cuerpo, con rituales y masajes diseñados para brindar confort, relajación y una sensación de arraigo.

Cielo y Tierra se encuentran en un único recorrido, creando equilibrio entre ligereza y arraigo, energía y abandono, mente y cuerpo.

Una experiencia para vivir lentamente, dejándose guiar por el ritmo de los tratamientos y el placer de recuperar el propio equilibrio.

De la cabeza a los pies. Del Cielo a la Tierra. Un ritual para reencontrarse.`,
    "radici-armonia": `Un recorrido dedicado a la relajación y al bienestar profundo, un ritual que involucra cuerpo, mente y sentidos.

Una experiencia completa que combina tratamientos nutritivos y purificantes para el rostro, el cuero cabelludo y el largo del cabello, acompañados de delicados masajes faciales y de cabeza.

El viaje continúa con aromaterapia de aceites esenciales y las vibraciones armónicas del cuenco tibetano, y termina con el peinado final para liberar tensiones y recuperar ligereza, equilibrio y profunda armonía.`,
    "abbandono-sensoriale": `Un ritual de renacimiento que recorre todo el cuerpo, desde las extremidades hasta el cuero cabelludo, conduciendo a una relajación profunda.

Ideal cuando se necesita un nuevo comienzo. La bañera sensorial con aromas y flores completa una experiencia de armonía total.`,
    "wine-essence": `Wine Essence es un ritual HEAD SPA a base de uvas, una experiencia sensorial que une el bienestar del cabello y el cuero cabelludo con el placer y la esencia del vino.

El recorrido comienza con un ritual de bienvenida y aromaterapia para preparar cuerpo y mente para la relajación. Continúa con un masaje holístico, un tratamiento HEAD SPA de uvas para cuero cabelludo y cabello, y un relajante masaje de manos.

La experiencia termina con una degustación y una copa de vino para saborear plenamente la atmósfera del ritual, seguida del peinado final.`,
    "abbraccio-vita": `Un ritual de bienestar pensado para acompañar a la mujer durante el embarazo, regalándole un momento de profunda relajación, cuidado y escucha del cuerpo.

El tratamiento combina un delicado masaje corporal con movimientos envolventes que favorecen una agradable sensación de ligereza y distensión, junto con un ritual nutritivo y reconfortante para la piel.

La experiencia continúa con un momento dedicado a relajar el cuero cabelludo y el cabello mediante gestos delicados y envolventes que ayudan a liberar tensiones y pensamientos, convirtiendo el tratamiento en una auténtica pausa de bienestar.`,
    carezza: `Un recorrido esencial donde el tacto se convierte en cuidado. Limpieza delicada, agua y maniobras ligeras llevan la cabeza y el cuero cabelludo hacia una sensación inmediata de confort.

Los gestos son suaves, medidos y continuos, ideales para acercarse con sencillez a la experiencia HEAD SPA o regalarse una pausa breve pero auténtica.

Una caricia que ralentiza el tiempo y devuelve ligereza, calma y presencia.`,
    "two-souls": `Un recorrido pensado para recuperar el equilibrio, relajarse y compartir un momento especial en pareja, en una atmósfera de bienestar total.

Para ella — Ritual Raíces de Armonía
Un ritual envolvente dedicado al reequilibrio y a la reconexión consigo misma, para recuperar ligereza, armonía y una relajación profunda.

Para él — Relax Experience
Un agradable masaje relajante de cuerpo completo, seguido de un regenerador baño de vapor Swedana y un tratamiento facial con barro Black Mus, para una sensación de bienestar completa.

El momento final — Together Time
La experiencia termina juntos en una sugerente bañera de hidromasaje, dejándose mimar por el agua y la tranquilidad del momento, acompañados de una refinada degustación.`,
  },
  fr: {
    "cielo-terra": `Un voyage de bien-être de la tête aux pieds, conçu pour rééquilibrer le corps et l’esprit grâce à une expérience enveloppante et profondément relaxante.

Le Ciel, c’est la tête : le point de départ de tout. Un rituel consacré au cuir chevelu et à la tête, composé de nettoyage, de massages et de gestes délicats qui aident à libérer les tensions, dégager l’esprit et retrouver une agréable légèreté.

La Terre, ce sont les pieds : notre point de contact avec le monde. Un soin dédié à cette partie du corps, avec des rituels et des massages conçus pour offrir confort, détente et ancrage.

Le Ciel et la Terre se rejoignent dans un même parcours, créant un équilibre entre légèreté et ancrage, énergie et abandon, esprit et corps.

Une expérience à vivre lentement, guidée par le rythme des soins et le plaisir de retrouver son équilibre.

De la tête aux pieds. Du Ciel à la Terre. Un rituel pour se retrouver.`,
    "radici-armonia": `Un parcours consacré à la détente et au bien-être profond, un rituel qui engage le corps, l’esprit et les sens.

Une expérience complète associant des soins nourrissants et purifiants pour le visage, le cuir chevelu et les longueurs, accompagnés de délicats massages du visage et de la tête.

Le voyage se poursuit avec l’aromathérapie aux huiles essentielles et les vibrations harmonieuses du bol tibétain, puis se termine par un coiffage final pour libérer les tensions et retrouver légèreté, équilibre et profonde harmonie.`,
    "abbandono-sensoriale": `Un rituel de renaissance qui parcourt tout le corps, des extrémités jusqu’au cuir chevelu, pour conduire à une relaxation profonde.

Idéal lorsque l’on ressent le besoin d’un nouveau départ. Le bassin sensoriel aux parfums et aux fleurs complète cette expérience d’harmonie totale.`,
    "wine-essence": `Wine Essence est un rituel HEAD SPA au raisin, une expérience sensorielle qui unit le bien-être des cheveux et du cuir chevelu au plaisir et à l’essence du vin.

Le parcours commence par un rituel d’accueil et de l’aromathérapie pour préparer le corps et l’esprit à la détente. Il se poursuit par un massage holistique, un soin HEAD SPA au raisin pour le cuir chevelu et les cheveux, ainsi qu’un massage relaxant des mains.

L’expérience s’achève par une dégustation et un verre de vin pour savourer pleinement l’atmosphère du rituel, puis par le coiffage final.`,
    "abbraccio-vita": `Un rituel de bien-être conçu pour accompagner la femme pendant la grossesse, offrant un moment de relaxation profonde, de soin et d’écoute du corps.

Le soin associe un massage corporel délicat aux effleurages enveloppants, conçus pour apporter une agréable sensation de légèreté et de détente, à un rituel nourrissant et réconfortant pour la peau.

L’expérience se poursuit par un moment consacré à la détente du cuir chevelu et des cheveux, grâce à des gestes délicats et enveloppants qui aident à libérer tensions et pensées, transformant le soin en une véritable pause de bien-être.`,
    carezza: `Un parcours essentiel où le toucher devient soin. Nettoyage délicat, eau et gestes légers guident la tête et le cuir chevelu vers une sensation immédiate de confort.

Les mouvements sont doux, mesurés et continus, idéals pour découvrir simplement l’expérience HEAD SPA ou s’offrir une pause brève mais authentique.

Une caresse qui ralentit le temps et restitue légèreté, calme et présence.`,
    "two-souls": `Un parcours conçu pour retrouver l’équilibre, se détendre et partager un moment privilégié à deux, dans une atmosphère de bien-être absolu.

Pour elle — Rituel Racines d’Harmonie
Un rituel enveloppant consacré au rééquilibrage et à la reconnexion avec soi-même, pour retrouver légèreté, harmonie et relaxation profonde.

Pour lui — Relax Experience
Un agréable massage relaxant de tout le corps, suivi d’un bain de vapeur Swedana régénérant et d’un soin du visage à la boue Black Mus, pour une sensation de bien-être complète.

Le moment final — Together Time
L’expérience s’achève ensemble dans un bain à remous évocateur, bercés par l’eau et la tranquillité du moment, accompagnés d’une dégustation raffinée.`,
  },
  de: {
    "cielo-terra": `Eine Wellnessreise von Kopf bis Fuß, die Körper und Geist durch ein umhüllendes, tief entspannendes Erlebnis wieder ins Gleichgewicht bringt.

Der Himmel ist der Kopf: der Punkt, an dem alles beginnt. Ein Ritual für Kopfhaut und Kopf mit Reinigung, Massage und sanften Berührungen, die Spannungen lösen, den Geist befreien und angenehme Leichtigkeit schenken.

Die Erde sind die Füße: unser Kontaktpunkt mit der Welt. Eine Behandlung für diesen Körperbereich mit Ritualen und Massagen, die Komfort, Entspannung und ein Gefühl der Erdung schenken.

Himmel und Erde begegnen sich in einem einzigen Weg und schaffen Balance zwischen Leichtigkeit und Erdung, Energie und Loslassen, Geist und Körper.

Ein Erlebnis, das langsam genossen werden möchte – getragen vom Rhythmus der Behandlungen und der Freude am eigenen Gleichgewicht.

Von Kopf bis Fuß. Vom Himmel zur Erde. Ein Ritual, um wieder zu sich selbst zu finden.`,
    "radici-armonia": `Ein Weg zu tiefer Entspannung und umfassendem Wohlbefinden – ein Ritual, das Körper, Geist und Sinne einbezieht.

Ein vollständiges Erlebnis aus nährenden und reinigenden Behandlungen für Gesicht, Kopfhaut und Haarlängen, begleitet von sanften Gesichts- und Kopfmassagen.

Die Reise setzt sich mit Aromatherapie aus ätherischen Ölen und den harmonischen Schwingungen einer tibetischen Klangschale fort. Zum Abschluss sorgt das Styling dafür, Spannungen loszulassen und Leichtigkeit, Balance und tiefe Harmonie wiederzufinden.`,
    "abbandono-sensoriale": `Ein Ritual der Erneuerung, das den ganzen Körper von den Extremitäten bis zur Kopfhaut durchzieht und in tiefe Entspannung führt.

Ideal, wenn ein Neuanfang guttut. Das Sinnesbad mit Düften und Blüten vollendet das Erlebnis vollkommener Harmonie.`,
    "wine-essence": `Wine Essence ist ein HEAD-SPA-Ritual mit Trauben – ein sinnliches Erlebnis, das das Wohlbefinden von Haar und Kopfhaut mit dem Genuss und der Essenz des Weins verbindet.

Die Reise beginnt mit einem Willkommensritual und Aromatherapie, um Körper und Geist auf die Entspannung vorzubereiten. Es folgen eine ganzheitliche Massage, eine traubenbasierte HEAD-SPA-Behandlung für Kopfhaut und Haar sowie eine entspannende Handmassage.

Zum Abschluss laden eine Weinverkostung und ein Glas Wein dazu ein, die Atmosphäre des Rituals ganz auszukosten, gefolgt vom finalen Styling.`,
    "abbraccio-vita": `Ein Wohlfühlritual, das Frauen während der Schwangerschaft begleitet und einen Moment tiefer Entspannung, Fürsorge und bewusster Körperwahrnehmung schenkt.

Die Behandlung verbindet eine sanfte Körpermassage mit umhüllenden Streichbewegungen, die angenehme Leichtigkeit und Entspannung fördern, mit einem nährenden Verwöhnritual für die Haut.

Anschließend widmet sich ein besonderer Moment der Entspannung von Kopfhaut und Haar. Sanfte, umhüllende Berührungen helfen, Spannungen und Gedanken loszulassen, und machen die Behandlung zu einer echten Wohlfühlpause.`,
    carezza: `Ein wesentlicher Weg, auf dem Berührung zur Pflege wird. Sanfte Reinigung, Wasser und leichte Griffe führen Kopf und Kopfhaut zu einem unmittelbaren Gefühl von Komfort.

Die Bewegungen sind weich, achtsam und fließend – ideal, um das HEAD-SPA-Erlebnis unkompliziert kennenzulernen oder sich eine kurze, echte Pause zu schenken.

Eine Berührung, die die Zeit verlangsamt und Leichtigkeit, Ruhe und Präsenz zurückbringt.`,
    "two-souls": `Ein Weg, um das Gleichgewicht wiederzufinden, zu entspannen und einen besonderen Moment zu zweit in einer Atmosphäre vollkommenen Wohlbefindens zu teilen.

Für sie — Ritual Wurzeln der Harmonie
Ein umhüllendes Ritual für neue Balance und die Verbindung mit sich selbst, das Leichtigkeit, Harmonie und tiefe Entspannung schenkt.

Für ihn — Relax Experience
Eine angenehme entspannende Ganzkörpermassage, gefolgt von einem regenerierenden Swedana-Dampfbad und einer Gesichtsbehandlung mit Black-Mus-Schlamm, für ein umfassendes Wohlgefühl.

Der gemeinsame Abschluss — Together Time
Das Erlebnis endet gemeinsam in einem stimmungsvollen Whirlpool. Wasser und die Ruhe des Moments verwöhnen beide, begleitet von einer raffinierten Verkostung.`,
  },
};

const experienceCopy: Record<Language, { eyebrow: string; heading: string; intro: string; aria: string; imageAlt: string; badge: string; kicker: string; action: string }> = {
  it: { eyebrow: "02 · Esperienze", heading: "Un mondo di benessere.", intro: "Esplora le nostre esperienze principali. Dentro ognuna trovi rituali e trattamenti pensati per esigenze diverse.", aria: "Scopri tutti i trattamenti HEAD SPA", imageAlt: "Atmosfera rilassante dell’esperienza HEAD SPA", badge: "01 · Esperienza principale", kicker: "Virginia SPA", action: "Scopri l’esperienza" },
  en: { eyebrow: "02 · Experiences", heading: "A world of wellbeing.", intro: "Explore our signature experiences. Inside each one, discover rituals and treatments created for different needs.", aria: "Discover all HEAD SPA treatments", imageAlt: "Relaxing atmosphere of the HEAD SPA experience", badge: "01 · Signature experience", kicker: "Virginia SPA", action: "Discover the experience" },
  es: { eyebrow: "02 · Experiencias", heading: "Un mundo de bienestar.", intro: "Explora nuestras experiencias principales. En cada una encontrarás rituales y tratamientos pensados para distintas necesidades.", aria: "Descubre todos los tratamientos HEAD SPA", imageAlt: "Ambiente relajante de la experiencia HEAD SPA", badge: "01 · Experiencia principal", kicker: "Virginia SPA", action: "Descubre la experiencia" },
  fr: { eyebrow: "02 · Expériences", heading: "Un monde de bien-être.", intro: "Explorez nos expériences signatures. Chacune réunit des rituels et des soins adaptés à différents besoins.", aria: "Découvrir tous les soins HEAD SPA", imageAlt: "Atmosphère relaxante de l’expérience HEAD SPA", badge: "01 · Expérience signature", kicker: "Virginia SPA", action: "Découvrir l’expérience" },
  de: { eyebrow: "02 · Erlebnisse", heading: "Eine Welt des Wohlbefindens.", intro: "Entdecke unsere wichtigsten Erlebnisse. In jedem erwarten dich Rituale und Behandlungen für unterschiedliche Bedürfnisse.", aria: "Alle HEAD-SPA-Behandlungen entdecken", imageAlt: "Entspannende Atmosphäre des HEAD-SPA-Erlebnisses", badge: "01 · Haupterlebnis", kicker: "Virginia SPA", action: "Erlebnis entdecken" },
};

const treatmentCopy: Record<Language, { eyebrow: string; heading: string; intro: string; read: string; close: string; closeAria: string; kicker: string; back: string }> = {
  it: { eyebrow: "HEAD SPA · Trattamenti", heading: "Scegli il tuo rituale.", intro: "Scopri durata, benefici e prezzo. L’acquisto online è un voucher: data e orario si definiscono dopo, contattando Virginia SPA.", read: "Leggi la descrizione", close: "Chiudi", closeAria: "Chiudi la descrizione di", kicker: "HEAD SPA · Il rituale", back: "Torna al trattamento" },
  en: { eyebrow: "HEAD SPA · Treatments", heading: "Choose your ritual.", intro: "Discover duration, benefits and price. Online purchase is a voucher: date and time are arranged afterwards by contacting Virginia SPA.", read: "Read description", close: "Close", closeAria: "Close the description of", kicker: "HEAD SPA · The ritual", back: "Back to treatment" },
  es: { eyebrow: "HEAD SPA · Tratamientos", heading: "Elige tu ritual.", intro: "Descubre duración, beneficios y precio. La compra online es un bono: fecha y hora se acuerdan después contactando con Virginia SPA.", read: "Leer descripción", close: "Cerrar", closeAria: "Cerrar la descripción de", kicker: "HEAD SPA · El ritual", back: "Volver al tratamiento" },
  fr: { eyebrow: "HEAD SPA · Soins", heading: "Choisissez votre rituel.", intro: "Découvrez durée, bienfaits et prix. L’achat en ligne est un bon : date et horaire se définissent ensuite auprès de Virginia SPA.", read: "Lire la description", close: "Fermer", closeAria: "Fermer la description de", kicker: "HEAD SPA · Le rituel", back: "Retour au soin" },
  de: { eyebrow: "HEAD SPA · Behandlungen", heading: "Wähle dein Ritual.", intro: "Entdecke Dauer, Wirkung und Preis. Der Onlinekauf ist ein Gutschein: Datum und Uhrzeit vereinbarst du danach mit Virginia SPA.", read: "Beschreibung lesen", close: "Schließen", closeAria: "Beschreibung schließen von", kicker: "HEAD SPA · Das Ritual", back: "Zurück zur Behandlung" },
};

const catalogCopy: Record<Language, { family: string; familyCopy: string; demo: string; items: [string, string, string][] }> = {
  it: { family: "Percorso", familyCopy: "Sette modi diversi di ritrovare leggerezza, equilibrio e presenza attraverso la cura della testa, dei sensi e del respiro.", demo: "Durate e prezzi attualmente dimostrativi", items: products.map(({ subtitle, description, sessions }) => [subtitle, description, sessions]) },
  en: { family: "Journey", familyCopy: "Seven ways to rediscover lightness, balance and presence through care for the head, senses and breath.", demo: "Durations and prices are currently illustrative", items: [
    ["HEAD SPA · Balance", "A balancing ritual connecting head, breath and grounding to restore presence and lightness.", "1 ritual · 75 min"], ["HEAD SPA · Harmony", "Slow, enveloping techniques for scalp, neck and shoulders to release tension and promote deep balance.", "1 ritual · 60 min"], ["HEAD SPA · Deep relaxation", "A sensory journey created to let go of noise, slow the rhythm and rediscover complete stillness.", "1 ritual · 90 min"], ["HEAD SPA · Antioxidant ritual", "An experience inspired by grape essence, with aromatic gestures for rich, sophisticated wellbeing.", "1 ritual · 75 min"], ["HEAD SPA · Mother-to-be", "A gentle, reassuring ritual designed to accompany a special moment with comfort, listening and care.", "1 ritual · 60 min"], ["HEAD SPA · Delicate care", "An essential, gentle journey that transforms touch into a pause of authentic wellbeing.", "1 ritual · 45 min"], ["HEAD SPA · Couple ritual", "A shared experience: two synchronised rituals to slow down together and create a special memory.", "2 people · 90 min"]
  ] },
  es: { family: "Recorrido", familyCopy: "Siete formas de recuperar ligereza, equilibrio y presencia mediante el cuidado de la cabeza, los sentidos y la respiración.", demo: "Duraciones y precios actualmente orientativos", items: [
    ["HEAD SPA · Equilibrio", "Un ritual que conecta cabeza, respiración y arraigo para recuperar presencia y ligereza.", "1 ritual · 75 min"], ["HEAD SPA · Armonía", "Maniobras lentas para cuero cabelludo, nuca y hombros que liberan tensiones y favorecen el equilibrio.", "1 ritual · 60 min"], ["HEAD SPA · Relajación profunda", "Un viaje sensorial para dejar ir el ruido, ralentizar el ritmo y encontrar una calma completa.", "1 ritual · 90 min"], ["HEAD SPA · Ritual antioxidante", "Una experiencia inspirada en la esencia de la uva, con gestos aromáticos para un bienestar sofisticado.", "1 ritual · 75 min"], ["HEAD SPA · Dulce espera", "Un ritual delicado pensado para acompañar un momento especial con confort, escucha y cuidado.", "1 ritual · 60 min"], ["HEAD SPA · Delicadeza", "Un recorrido esencial y amable que convierte el tacto en una pausa de auténtico bienestar.", "1 ritual · 45 min"], ["HEAD SPA · Ritual en pareja", "Una experiencia compartida: dos rituales sincronizados para bajar el ritmo juntos.", "2 personas · 90 min"]
  ] },
  fr: { family: "Parcours", familyCopy: "Sept façons de retrouver légèreté, équilibre et présence grâce au soin de la tête, des sens et du souffle.", demo: "Durées et prix actuellement indicatifs", items: [
    ["HEAD SPA · Équilibre", "Un rituel qui relie la tête, le souffle et l’ancrage pour retrouver présence et légèreté.", "1 rituel · 75 min"], ["HEAD SPA · Harmonie", "Des gestes lents pour le cuir chevelu, la nuque et les épaules afin de libérer les tensions.", "1 rituel · 60 min"], ["HEAD SPA · Relaxation profonde", "Un voyage sensoriel pour laisser le bruit derrière soi, ralentir et retrouver un calme profond.", "1 rituel · 90 min"], ["HEAD SPA · Rituel antioxydant", "Une expérience inspirée de l’essence du raisin, aux gestes aromatiques et enveloppants.", "1 rituel · 75 min"], ["HEAD SPA · Future maman", "Un rituel délicat conçu pour accompagner un moment précieux avec confort, écoute et soin.", "1 rituel · 60 min"], ["HEAD SPA · Douceur", "Un parcours essentiel et délicat qui transforme le toucher en pause de bien-être authentique.", "1 rituel · 45 min"], ["HEAD SPA · Rituel en duo", "Une expérience à partager : deux rituels synchronisés pour ralentir ensemble.", "2 personnes · 90 min"]
  ] },
  de: { family: "Wellnessweg", familyCopy: "Sieben Wege zu Leichtigkeit, Balance und Präsenz durch die Pflege von Kopf, Sinnen und Atem.", demo: "Dauer und Preise derzeit beispielhaft", items: [
    ["HEAD SPA · Balance", "Ein ausgleichendes Ritual, das Kopf, Atem und Erdung verbindet und neue Leichtigkeit schenkt.", "1 Ritual · 75 Min."], ["HEAD SPA · Harmonie", "Langsame, umhüllende Griffe für Kopfhaut, Nacken und Schultern lösen Spannungen und fördern Balance.", "1 Ritual · 60 Min."], ["HEAD SPA · Tiefe Entspannung", "Eine Sinnesreise, um Lärm loszulassen, das Tempo zu drosseln und vollkommene Ruhe zu finden.", "1 Ritual · 90 Min."], ["HEAD SPA · Antioxidatives Ritual", "Ein von Traubenessenz inspiriertes Erlebnis mit aromatischen Berührungen für anspruchsvolles Wohlbefinden.", "1 Ritual · 75 Min."], ["HEAD SPA · Schwangerschaft", "Ein sanftes Ritual, das einen besonderen Moment mit Geborgenheit und Fürsorge begleitet.", "1 Ritual · 60 Min."], ["HEAD SPA · Sanfte Pflege", "Ein essentielles, behutsames Erlebnis, das Berührung in eine echte Wohlfühlpause verwandelt.", "1 Ritual · 45 Min."], ["HEAD SPA · Paarritual", "Ein gemeinsames Erlebnis: zwei synchronisierte Rituale, um zusammen zu entschleunigen.", "2 Personen · 90 Min."]
  ] },
};

const localizedTitles: Record<Language, string[]> = {
  it: ["Cielo & Terra", "Radici di Armonia", "Abbandono Sensoriale", "Wine Essence", "Abbraccio di Vita", "Carezza", "Two Souls Ritual"],
  en: ["Sky & Earth", "Roots of Harmony", "Sensory Surrender", "Wine Essence", "Embrace of Life", "Gentle Touch", "Two Souls Ritual"],
  es: ["Cielo y Tierra", "Raíces de Armonía", "Abandono Sensorial", "Wine Essence", "Abrazo de Vida", "Caricia", "Ritual Dos Almas"],
  fr: ["Ciel & Terre", "Racines d’Harmonie", "Abandon Sensoriel", "Wine Essence", "Étreinte de Vie", "Caresse", "Rituel Deux Âmes"],
  de: ["Himmel & Erde", "Wurzeln der Harmonie", "Sinnliche Hingabe", "Wine Essence", "Umarmung des Lebens", "Sanfte Berührung", "Ritual der zwei Seelen"],
};

const labels: Record<Language, Record<string, string>> = {
  it: { shop: "Shop benessere", heading: "Scegli con chiarezza.", intro: "Non un semplice catalogo: parti da come vuoi sentirti e scopri i percorsi più adatti a te.", all: "Tutti", relax: "Rilassarmi", skin: "Pelle luminosa", body: "Corpo e forma", couple: "Tempo insieme", add: "Aggiungi al carrello", included: "Cosa include", featured: "Il più scelto", cart: "Carrello", empty: "Il tuo carrello è ancora vuoto.", total: "Totale", checkout: "Vai al checkout", remove: "Rimuovi", giftTitle: "Componi un regalo che parla di chi lo riceve.", giftIntro: "Scegli il valore e scrivi il tuo messaggio. Acquisti una Gift Card digitale: la ricevi subito dopo il pagamento. Data e orario del rituale si definiscono dopo, contattando Virginia SPA.", amount: "Valore del regalo", recipient: "Per chi è?", sender: "Da parte di", message: "Il tuo messaggio", delivery: "Quando consegnarlo", now: "Subito", date: "In una data speciale", addGift: "Aggiungi la Gift Card", checkoutTitle: "Completa l’ordine", contact: "I tuoi dati", name: "Nome e cognome", email: "Email", phone: "Telefono", payment: "Pagamento", card: "Numero carta", expiry: "Scadenza", cvc: "CVC", demo: "Pagamento dimostrativo: nessun importo verrà addebitato.", pay: "Conferma e paga", success: "Il tuo regalo di benessere è pronto.", successCopy: "Ordine confermato. Puoi scaricare il voucher e lo ricevi anche via email.", voucher: "Scarica il voucher", continue: "Continua a esplorare", close: "Chiudi", order: "Ordine" },
  en: { shop: "Wellness shop", heading: "Choose with clarity.", intro: "More than a catalogue: start from how you want to feel and discover the right journey for you.", all: "All", relax: "Relax", skin: "Radiant skin", body: "Body & shape", couple: "Time together", add: "Add to cart", included: "What's included", featured: "Most loved", cart: "Cart", empty: "Your cart is still empty.", total: "Total", checkout: "Go to checkout", remove: "Remove", giftTitle: "Create a gift that feels personal.", giftIntro: "Choose the value and write your message. You are buying a digital Gift Card delivered right after payment. Date and time are arranged afterwards by contacting Virginia SPA.", amount: "Gift value", recipient: "Recipient", sender: "From", message: "Your message", delivery: "Delivery", now: "Now", date: "On a special date", addGift: "Add Gift Card", checkoutTitle: "Complete your order", contact: "Your details", name: "Full name", email: "Email", phone: "Phone", payment: "Payment", card: "Card number", expiry: "Expiry", cvc: "CVC", demo: "Demo payment: no charge will be made.", pay: "Confirm and pay", success: "Your wellbeing gift is ready.", successCopy: "Order confirmed. Download your digital voucher now; the final version will also arrive by email.", voucher: "Download voucher", continue: "Keep exploring", close: "Close", order: "Order" },
  es: { shop: "Tienda bienestar", heading: "Elige con claridad.", intro: "Más que un catálogo: parte de cómo quieres sentirte y descubre el recorrido adecuado.", all: "Todos", relax: "Relajarme", skin: "Piel luminosa", body: "Cuerpo y forma", couple: "Tiempo juntos", add: "Añadir al carrito", included: "Qué incluye", featured: "Más elegido", cart: "Carrito", empty: "Tu carrito está vacío.", total: "Total", checkout: "Ir al pago", remove: "Eliminar", giftTitle: "Crea un regalo realmente personal.", giftIntro: "Elige el valor y escribe tu mensaje. Compras una tarjeta regalo digital que recibes justo después del pago. Fecha y hora se acuerdan después contactando con Virginia SPA.", amount: "Valor del regalo", recipient: "Destinatario", sender: "De parte de", message: "Tu mensaje", delivery: "Entrega", now: "Ahora", date: "En una fecha especial", addGift: "Añadir tarjeta regalo", checkoutTitle: "Completa el pedido", contact: "Tus datos", name: "Nombre completo", email: "Email", phone: "Teléfono", payment: "Pago", card: "Número de tarjeta", expiry: "Caducidad", cvc: "CVC", demo: "Pago de demostración: no se realizará ningún cargo.", pay: "Confirmar y pagar", success: "Tu regalo de bienestar está listo.", successCopy: "Pedido confirmado. Ya puedes descargar el bono digital.", voucher: "Descargar bono", continue: "Seguir explorando", close: "Cerrar", order: "Pedido" },
  fr: { shop: "Boutique bien-être", heading: "Choisissez en toute clarté.", intro: "Plus qu’un catalogue : partez de ce que vous souhaitez ressentir et découvrez le parcours adapté.", all: "Tous", relax: "Me détendre", skin: "Peau lumineuse", body: "Corps et forme", couple: "Temps à deux", add: "Ajouter au panier", included: "Ce qui est inclus", featured: "Le plus choisi", cart: "Panier", empty: "Votre panier est vide.", total: "Total", checkout: "Passer au paiement", remove: "Supprimer", giftTitle: "Composez un cadeau vraiment personnel.", giftIntro: "Choisissez la valeur et écrivez votre message. Vous achetez une carte cadeau numérique remise juste après le paiement. Date et horaire se définissent ensuite auprès de Virginia SPA.", amount: "Valeur du cadeau", recipient: "Destinataire", sender: "De la part de", message: "Votre message", delivery: "Livraison", now: "Maintenant", date: "À une date spéciale", addGift: "Ajouter la carte cadeau", checkoutTitle: "Finalisez la commande", contact: "Vos coordonnées", name: "Nom complet", email: "E-mail", phone: "Téléphone", payment: "Paiement", card: "Numéro de carte", expiry: "Expiration", cvc: "CVC", demo: "Paiement de démonstration : aucun débit ne sera effectué.", pay: "Confirmer et payer", success: "Votre cadeau bien-être est prêt.", successCopy: "Commande confirmée. Vous pouvez télécharger votre bon numérique.", voucher: "Télécharger le bon", continue: "Continuer à explorer", close: "Fermer", order: "Commande" },
  de: { shop: "Wellness-Shop", heading: "Klar und sicher wählen.", intro: "Mehr als ein Katalog: Beginne mit deinem Wunschgefühl und entdecke den passenden Weg.", all: "Alle", relax: "Entspannen", skin: "Strahlende Haut", body: "Körper & Form", couple: "Zeit zu zweit", add: "In den Warenkorb", included: "Enthalten", featured: "Am beliebtesten", cart: "Warenkorb", empty: "Dein Warenkorb ist noch leer.", total: "Gesamt", checkout: "Zur Kasse", remove: "Entfernen", giftTitle: "Gestalte ein persönliches Geschenk.", giftIntro: "Wähle den Wert und schreibe deine Nachricht. Du kaufst eine digitale Geschenkkarte, die direkt nach der Zahlung bereitsteht. Datum und Uhrzeit vereinbarst du danach mit Virginia SPA.", amount: "Geschenkwert", recipient: "Für", sender: "Von", message: "Deine Nachricht", delivery: "Übergabe", now: "Sofort", date: "An einem besonderen Tag", addGift: "Geschenkkarte hinzufügen", checkoutTitle: "Bestellung abschließen", contact: "Deine Daten", name: "Vollständiger Name", email: "E-Mail", phone: "Telefon", payment: "Zahlung", card: "Kartennummer", expiry: "Gültig bis", cvc: "CVC", demo: "Demo-Zahlung: Es wird nichts belastet.", pay: "Bestätigen und bezahlen", success: "Dein Wellness-Geschenk ist bereit.", successCopy: "Bestellung bestätigt. Du kannst den digitalen Gutschein jetzt herunterladen.", voucher: "Gutschein herunterladen", continue: "Weiter entdecken", close: "Schließen", order: "Bestellung" },
};

const giftPlaceholders: Record<Language, { recipient: string; sender: string; message: string; previewRecipient: string; previewMessage: string; dedication: string }> = {
  it: { recipient: "Nome", sender: "Il tuo nome", message: "Scrivi una dedica personale...", previewRecipient: "Per una persona speciale", previewMessage: "Un tempo solo tuo.", dedication: "Una persona speciale" },
  en: { recipient: "Name", sender: "Your name", message: "Write a personal message...", previewRecipient: "For someone special", previewMessage: "Time just for you.", dedication: "Someone special" },
  es: { recipient: "Nombre", sender: "Tu nombre", message: "Escribe una dedicatoria personal...", previewRecipient: "Para una persona especial", previewMessage: "Un tiempo solo para ti.", dedication: "Una persona especial" },
  fr: { recipient: "Prénom", sender: "Votre nom", message: "Écrivez un message personnel...", previewRecipient: "Pour une personne spéciale", previewMessage: "Un moment rien que pour vous.", dedication: "Une personne spéciale" },
  de: { recipient: "Name", sender: "Dein Name", message: "Schreibe eine persönliche Nachricht...", previewRecipient: "Für einen besonderen Menschen", previewMessage: "Zeit nur für dich.", dedication: "Ein besonderer Mensch" },
};

const numberLocales: Record<Language, string> = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" };
const stripeCheckoutCopy: Record<Language, { secure: string; note: string; redirect: string; error: string }> = {
  it: { secure: "Checkout sicuro · Stripe", note: "Il pagamento avviene sulla pagina protetta di Stripe. I dati della carta non transitano su questo sito.", redirect: "Continua con Stripe", error: "Non è stato possibile avviare il pagamento. Riprova tra poco." },
  en: { secure: "Secure checkout · Stripe", note: "Payment takes place on Stripe’s secure page. Card details never pass through this website.", redirect: "Continue with Stripe", error: "We could not start the payment. Please try again shortly." },
  es: { secure: "Pago seguro · Stripe", note: "El pago se realiza en la página protegida de Stripe. Los datos de la tarjeta no pasan por este sitio.", redirect: "Continuar con Stripe", error: "No se ha podido iniciar el pago. Inténtalo de nuevo en unos instantes." },
  fr: { secure: "Paiement sécurisé · Stripe", note: "Le paiement s’effectue sur la page sécurisée de Stripe. Les données de carte ne transitent jamais par ce site.", redirect: "Continuer avec Stripe", error: "Impossible de démarrer le paiement. Veuillez réessayer dans quelques instants." },
  de: { secure: "Sicherer Checkout · Stripe", note: "Die Zahlung erfolgt auf der geschützten Stripe-Seite. Kartendaten werden nicht über diese Website übertragen.", redirect: "Weiter mit Stripe", error: "Die Zahlung konnte nicht gestartet werden. Bitte versuche es gleich noch einmal." },
};

export default function CommerceExperience({ language, mode = "overview" }: { language: Language; mode?: "overview" | "treatments" | "gift" }) {
  const l = labels[language];
  const placeholders = giftPlaceholders[language];
  const catalog = catalogCopy[language];
  const experience = experienceCopy[language];
  const treatment = treatmentCopy[language];
  const stripeCopy = stripeCheckoutCopy[language];
  const euro = useMemo(() => new Intl.NumberFormat(numberLocales[language], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }), [language]);
  const [need, setNeed] = useState<Need>("all");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [stage, setStage] = useState<"cart" | "checkout">("cart");
  const [giftAmount, setGiftAmount] = useState(100);
  const [gift, setGift] = useState({ to: "", from: "", message: "", delivery: "now" });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [cartReady, setCartReady] = useState(false);
  const visible = need === "all" ? products : products.filter((product) => product.need === need);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setCart(readStoredCart());
      if (new URLSearchParams(window.location.search).get("cart") === "open") {
        setStage("cart");
        setCartOpen(true);
      }
      setCartReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (cartReady) writeStoredCart(cart);
  }, [cart, cartReady]);

  const addProduct = (product: Product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      return existing ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { id: product.id, title: product.title, detail: product.sessions, price: product.price, quantity: 1 }];
    });
    setStage("cart");
    setCartOpen(true);
  };

  const addGift = () => {
    setCart((items) => [...items, { id: `gift-${Date.now()}`, title: "Virginia SPA Gift Card", detail: gift.to ? `${l.recipient}: ${gift.to}` : l.amount, price: giftAmount, quantity: 1, gift: { ...gift, delivery: "now" } }]);
    setStage("cart");
    setCartOpen(true);
  };

  const completeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckoutLoading(true); setCheckoutError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), phone: form.get("phone"), language, items: cart, acceptedTerms: form.get("acceptedTerms") === "on" }) });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || stripeCopy.error);
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : stripeCopy.error);
      setCheckoutLoading(false);
    }
  };

  return (
    <section id={mode === "gift" ? "gift-atelier" : "shop"} className={mode === "gift" ? "commerce-section gift-commerce-page" : "commerce-section"}>
      {mode === "overview" && <>
      <div className="commerce-heading experience-overview-heading">
        <p className="eyebrow"><span /> {experience.eyebrow}</p>
        <h2>{experience.heading}</h2>
        <p>{experience.intro}</p>
        <button className="cart-trigger" type="button" onClick={() => { setStage("cart"); setCartOpen(true); }} aria-label={`${l.cart}: ${count}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2 11h10l2-7H7M9 20h.01M17 20h.01" /></svg>
          <span>{l.cart}</span><i>{count}</i>
        </button>
      </div>
      <div className="experience-grid"><Link className="experience-card" href="/head-spa" aria-label={experience.aria}>
        <div className="experience-card-image">
          <Image src="/water-stilllife.webp" alt={experience.imageAlt} fill unoptimized sizes="(max-width: 700px) 100vw, 55vw" />
          <span>{experience.badge}</span>
        </div>
        <div className="experience-card-copy">
          <p>{experience.kicker}</p><h3>HEAD <em>SPA</em></h3>
          <span className="experience-card-action">{experience.action} <b aria-hidden="true">→</b></span>
        </div>
      </Link>{ritualExperiences.map((ritual, index) => {
        const localizedRitual = ritual.locales[language];
        return <Link className="experience-card" href={`/esperienze/${ritual.slug}`} aria-label={`${experience.action}: ${localizedRitual.title}`} key={ritual.slug}>
          <div className="experience-card-image"><Image src={ritual.image} alt={localizedRitual.title} fill unoptimized sizes="(max-width: 700px) 100vw, 33vw" /><span>{String(index + 2).padStart(2, "0")} · {experience.badge.split("·").at(-1)?.trim()}</span></div>
          <div className="experience-card-copy"><p>{experience.kicker}</p><h3>{localizedRitual.title}</h3><span className="experience-card-action">{experience.action} <b aria-hidden="true">→</b></span></div>
        </Link>;
      })}</div>
      </>}

      {mode === "treatments" && <>
      <div className="commerce-heading">
        <p className="eyebrow"><span /> {treatment.eyebrow}</p>
        <h2>{treatment.heading}</h2>
        <p>{treatment.intro}</p>
        {pricesAreProvisional && <p className="catalog-provisional">{catalog.demo}</p>}
        <button className="cart-trigger" type="button" onClick={() => { setStage("cart"); setCartOpen(true); }} aria-label={`${l.cart}: ${count}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2 11h10l2-7H7M9 20h.01M17 20h.01" /></svg>
          <span>{l.cart}</span><i>{count}</i>
        </button>
      </div>
      <PurchaseNotice language={language} />

      <div className="need-filters" role="group" aria-label={translate("Filtra per esigenza", language)}>
        {(["all", "relax", "skin", "body", "couple"] as Need[]).map((item) => <button type="button" key={item} className={need === item ? "active" : ""} onClick={() => setNeed(item)}>{l[item]}</button>)}
      </div>

      <div className="product-grid">
        {visible.map((product) => {
          const productIndex = products.findIndex(({ id }) => id === product.id);
          const localized = catalog.items[productIndex];
          const localizedTitle = localizedTitles[language][productIndex];
          return (
          <article className={`${product.featured ? "product-card featured" : "product-card"}${expandedProduct === product.id ? " is-description-open" : ""}`} key={product.id}>
            <div className="product-image"><Image src={product.image} alt={localizedTitle} fill unoptimized sizes="(max-width: 700px) 100vw, 33vw" />{product.featured && <span>{l.featured}</span>}</div>
            <div className="product-copy"><p>{localized[0]}</p><h3>{localizedTitle}</h3><span>{localized[1]}</span><div><small>{localized[2]}</small><strong>{euro.format(product.price)}</strong></div><button className="product-description-trigger" type="button" aria-expanded={expandedProduct === product.id} aria-controls={`description-${product.id}`} onClick={() => setExpandedProduct((current) => current === product.id ? null : product.id)}>{treatment.read}<span>→</span></button><button type="button" onClick={() => addProduct({ ...product, title: localizedTitle, subtitle: localized[0], description: localized[1], sessions: localized[2] })}>{l.add}<span>＋</span></button></div>
            <div className="product-description-overlay" id={`description-${product.id}`} aria-hidden={expandedProduct !== product.id}>
              <button className="product-description-close" type="button" onClick={() => setExpandedProduct(null)} aria-label={`${treatment.closeAria} ${localizedTitle}`}>{treatment.close} <span aria-hidden="true">×</span></button>
              <p>{treatment.kicker}</p>
              <h3>{localizedTitle}</h3>
              <div>{(language === "it" ? detailedDescriptions[product.id] : translatedDetailedDescriptions[language][product.id]).split("\n\n").map((paragraph) => {
                const [sectionTitle, ...sectionBody] = paragraph.split("\n");
                return sectionBody.length ? <div className="description-part" key={paragraph}><strong>{sectionTitle}</strong><p>{sectionBody.join(" ")}</p></div> : <p key={paragraph}>{paragraph}</p>;
              })}</div>
              <button className="product-description-back" type="button" onClick={() => setExpandedProduct(null)}>{treatment.back} <span aria-hidden="true">←</span></button>
            </div>
          </article>
        )})}
      </div>
      </>}

      {mode === "gift" &&
      <div className="gift-builder">
        <div className="gift-builder-copy"><p className="section-index">{translate("Gift atelier", language)}</p><h2>{l.giftTitle}</h2><p>{l.giftIntro}</p></div>
        <div className="gift-preview" aria-label={translate("Gift Card preview", language)}><span>Virginia <em>SPA</em></span><p>{gift.message || placeholders.previewMessage}</p><strong>{gift.to || placeholders.previewRecipient}</strong><i>{euro.format(giftAmount)}</i></div>
        <div className="gift-form">
          <PurchaseNotice language={language} />
          <fieldset><legend>{l.amount}</legend><div className="amount-options">{giftAmountEuros.map((amount) => <button type="button" key={amount} className={giftAmount === amount ? "active" : ""} onClick={() => setGiftAmount(amount)}>{euro.format(amount)}</button>)}</div></fieldset>
          <label>{l.recipient}<input maxLength={80} value={gift.to} onChange={(event) => setGift({ ...gift, to: event.target.value })} placeholder={placeholders.recipient} /></label>
          <label>{l.sender}<input maxLength={80} value={gift.from} onChange={(event) => setGift({ ...gift, from: event.target.value })} placeholder={placeholders.sender} /></label>
          <label>{l.message}<textarea maxLength={120} value={gift.message} onChange={(event) => setGift({ ...gift, message: event.target.value })} placeholder={placeholders.message} /><small>{gift.message.length}/120</small></label>
          <button className="button button-primary" type="button" onClick={addGift}>{l.addGift}<span>→</span></button>
        </div>
      </div>
      }

      {cartOpen && <div className="commerce-backdrop" onMouseDown={() => setCartOpen(false)}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="commerce-close" type="button" onClick={() => setCartOpen(false)} aria-label={l.close}>×</button>
        {stage === "cart" && <><p className="section-index">{translate("Virginia SPA Shop", language)}</p><h2 id="cart-title">{l.cart}</h2><PurchaseNotice language={language} />{cart.length === 0 ? <div className="cart-empty"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2 11h10l2-7H7M9 20h.01M17 20h.01" /></svg><p>{l.empty}</p></div> : <><div className="cart-items">{cart.map((item) => <article key={item.id}><div><h3>{item.title}</h3><p>{item.detail}</p><button type="button" onClick={() => setCart((items) => items.filter(({ id }) => id !== item.id))}>{l.remove}</button></div><strong>{euro.format(item.price * item.quantity)}</strong></article>)}</div><div className="cart-total"><span>{l.total}</span><strong>{euro.format(total)}</strong></div><button className="button button-primary commerce-primary" type="button" onClick={() => setStage("checkout")}>{l.checkout}<span>→</span></button></>}</>}
        {stage === "checkout" && <form className="checkout-form" onSubmit={completeOrder}><p className="section-index">{stripeCopy.secure}</p><h2 id="cart-title">{l.checkoutTitle}</h2><PurchaseNotice language={language} /><fieldset><legend>{l.contact}</legend><label>{l.name}<input name="name" required autoComplete="name" maxLength={120} /></label><label>{l.email}<input name="email" required type="email" autoComplete="email" maxLength={254} /></label><label>{l.phone}<input name="phone" required type="tel" autoComplete="tel" maxLength={40} /></label></fieldset><label className="privacy-check"><input name="acceptedTerms" type="checkbox" required />{language === "it" ? <>Ho letto l’<a href="/privacy" target="_blank" rel="noopener noreferrer">informativa privacy</a> e i <a href="/termini" target="_blank" rel="noopener noreferrer">termini di vendita</a>.</> : language === "en" ? <>I have read the <a href="/privacy" target="_blank" rel="noopener noreferrer">privacy notice</a> and the <a href="/termini" target="_blank" rel="noopener noreferrer">terms of sale</a>.</> : language === "es" ? <>He leído la <a href="/privacy" target="_blank" rel="noopener noreferrer">política de privacidad</a> y las <a href="/termini" target="_blank" rel="noopener noreferrer">condiciones de venta</a>.</> : language === "fr" ? <>J’ai lu l’<a href="/privacy" target="_blank" rel="noopener noreferrer">informativa privacy</a> et les <a href="/termini" target="_blank" rel="noopener noreferrer">conditions de vente</a>.</> : <>Ich habe die <a href="/privacy" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a> und die <a href="/termini" target="_blank" rel="noopener noreferrer">Verkaufsbedingungen</a> gelesen.</>}</label><p className="demo-payment"><span>✓</span>{stripeCopy.note}</p>{checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}<div className="checkout-summary"><span>{l.total}</span><strong>{euro.format(total)}</strong></div><button className="button button-primary commerce-primary" type="submit" disabled={checkoutLoading}>{checkoutLoading ? "Stripe…" : stripeCopy.redirect}<span>→</span></button></form>}
      </aside></div>}
    </section>
  );
}
