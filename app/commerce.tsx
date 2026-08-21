"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { translate, type Language } from "./i18n";

type Need = "all" | "relax" | "skin" | "body" | "couple";
type Product = { id: string; title: string; subtitle: string; description: string; need: Exclude<Need, "all">; sessions: string; price: number; image: string; featured?: boolean };
type CartItem = { id: string; title: string; detail: string; price: number; quantity: number; gift?: { to: string; from: string; message: string; delivery: string } };

const products: Product[] = [
  { id: "cielo-terra", title: "Cielo & Terra", subtitle: "HEAD SPA · Equilibrio", description: "Un rituale riequilibrante che unisce testa, respiro e radicamento per ritrovare presenza e leggerezza.", need: "relax", sessions: "1 rituale · 75 min", price: 110, image: "/water-stilllife.webp", featured: true },
  { id: "radici-armonia", title: "Radici di Armonia", subtitle: "HEAD SPA · Riequilibrio", description: "Manualità lente e avvolgenti dedicate a cute, nuca e spalle per sciogliere le tensioni e favorire un profondo equilibrio.", need: "relax", sessions: "1 rituale · 60 min", price: 90, image: "/hero-ritual.webp" },
  { id: "abbandono-sensoriale", title: "Abbandono Sensoriale", subtitle: "HEAD SPA · Relax profondo", description: "Un viaggio sensoriale pensato per lasciare andare il rumore, rallentare il ritmo e ritrovare una quiete completa.", need: "relax", sessions: "1 rituale · 90 min", price: 130, image: "/face-treatment.webp" },
  { id: "wine-essence", title: "Wine Essence", subtitle: "HEAD SPA · Rituale antiossidante", description: "Un’esperienza ispirata all’essenza dell’uva, con gesti aromatici e avvolgenti per un benessere ricco e sofisticato.", need: "skin", sessions: "1 rituale · 75 min", price: 125, image: "/water-stilllife.webp" },
  { id: "abbraccio-vita", title: "Abbraccio di Vita", subtitle: "HEAD SPA · Dolce attesa", description: "Un rituale delicato e rassicurante, pensato per accompagnare un momento speciale con comfort, ascolto e cura.", need: "body", sessions: "1 rituale · 60 min", price: 95, image: "/hero-ritual.webp" },
  { id: "carezza", title: "Carezza", subtitle: "HEAD SPA · Delicatezza", description: "Un percorso essenziale e gentile che trasforma il tocco in una pausa di autentico benessere.", need: "skin", sessions: "1 rituale · 45 min", price: 75, image: "/face-treatment.webp" },
  { id: "two-souls", title: "Two Souls Ritual", subtitle: "HEAD SPA · Rituale di coppia", description: "Un’esperienza da condividere: due rituali sincronizzati per rallentare insieme e custodire un ricordo speciale.", need: "couple", sessions: "2 persone · 90 min", price: 240, image: "/hero-ritual.webp" },
];

const detailedDescriptions: Record<string, string> = {
  "cielo-terra": `Un viaggio di benessere dalla testa ai piedi, pensato per riequilibrare corpo e mente attraverso un’esperienza avvolgente e profondamente rilassante.

Cielo è la testa: il punto da cui tutto inizia. Un rituale dedicato al cuoio capelluto e alla testa, fatto di detersione, massaggi e gesti delicati che aiutano a sciogliere le tensioni, liberare la mente e ritrovare una piacevole sensazione di leggerezza.

Terra sono i piedi: il nostro punto di contatto con il mondo. Un trattamento dedicato a questa parte del corpo, con rituali e massaggi studiati per regalare comfort, distensione e una sensazione di radicamento.

Cielo e Terra si incontrano in un unico percorso, creando un equilibrio tra leggerezza e radicamento, energia e abbandono, mente e corpo.

Un’esperienza da vivere lentamente, lasciandosi guidare dal ritmo dei trattamenti e dal piacere di ritrovare il proprio equilibrio.

Dalla testa ai piedi. Dal Cielo alla Terra. Un rituale per ritrovare sé stessi.`,
  "radici-armonia": `Un rituale che parte dalle radici per riportare armonia in tutto il corpo. La cute, la nuca e le spalle vengono accolte da manualità lente e avvolgenti, pensate per sciogliere le tensioni accumulate e alleggerire la mente.

La detersione delicata e il massaggio del cuoio capelluto si alternano a gesti distensivi, creando una pausa profonda in cui il respiro ritrova il suo ritmo naturale.

Un percorso essenziale e completo per sentirsi più presenti, leggeri e in equilibrio.`,
  "abbandono-sensoriale": `Un invito a lasciare andare il rumore e affidarsi completamente alle sensazioni. Acqua, profumi, calore e manualità profonde accompagnano il corpo verso uno stato di quiete intensa.

Il rituale coinvolge testa, cuoio capelluto, nuca e spalle con gesti lenti e continui, studiati per favorire il rilassamento e liberare lo spazio mentale.

Un’esperienza immersiva da vivere senza fretta, per ritrovare silenzio, presenza e un autentico senso di abbandono.`,
  "wine-essence": `Un rituale sensoriale ispirato alla ricchezza dell’uva e alle sue note avvolgenti. Le gestualità aromatiche incontrano la cura della cute e della testa in un percorso raffinato, distensivo e antiossidante.

Il massaggio favorisce una piacevole sensazione di vitalità, mentre profumi e consistenze trasformano ogni passaggio in un momento di benessere sofisticato.

Un’esperienza intensa e preziosa, pensata per chi desidera ritrovare energia, luminosità e piacere attraverso i sensi.`,
  "abbraccio-vita": `Un rituale delicato, rassicurante e profondamente accogliente, pensato per accompagnare il tempo speciale della dolce attesa.

Le manualità vengono adattate con cura e rispetto, concentrandosi su testa, cute, nuca e zone che desiderano maggiore comfort. Ogni gesto invita a rallentare, respirare e sentirsi sostenute.

Una pausa di ascolto e benessere dedicata alla mamma, da vivere come un abbraccio gentile per il corpo e per la mente.`,
  carezza: `Un percorso essenziale in cui il tocco diventa cura. Detersione delicata, acqua e manualità leggere accompagnano la testa e il cuoio capelluto verso una sensazione immediata di comfort.

I gesti sono morbidi, misurati e continui, ideali per chi desidera avvicinarsi all’esperienza HEAD SPA con semplicità o concedersi una pausa breve ma autentica.

Una carezza che rallenta il tempo e restituisce leggerezza, calma e presenza.`,
  "two-souls": `Un’esperienza pensata per essere condivisa. Due rituali HEAD SPA si svolgono in armonia, seguendo lo stesso ritmo di acqua, profumi e manualità avvolgenti.

Testa, cute, nuca e spalle vengono accompagnate verso un rilassamento profondo, mentre la presenza dell’altra persona trasforma il trattamento in un ricordo comune.

Un tempo sospeso per rallentare insieme, ritrovare complicità e custodire una sensazione di benessere che continua oltre il rituale.`,
};

const translatedDetailedDescriptions: Record<Exclude<Language, "it">, Record<string, string>> = {
  en: {
    "cielo-terra": `A wellbeing journey from head to toe, designed to rebalance body and mind through an enveloping, deeply relaxing experience.

Sky is the head: the point where everything begins. A ritual for the scalp and head, combining cleansing, massage and delicate gestures that help release tension, clear the mind and restore a pleasant feeling of lightness.

Earth is the feet: our point of contact with the world. A treatment dedicated to this part of the body, with rituals and massages designed to offer comfort, relaxation and a sense of grounding.

Sky and Earth meet in one journey, creating balance between lightness and grounding, energy and surrender, mind and body.

An experience to enjoy slowly, guided by the rhythm of the treatments and the pleasure of rediscovering your own balance.

From head to toe. From Sky to Earth. A ritual to find yourself again.`,
    "radici-armonia": `A ritual that begins at the roots to restore harmony throughout the body. The scalp, neck and shoulders are embraced by slow, enveloping techniques designed to release built-up tension and lighten the mind.

Gentle cleansing and scalp massage alternate with relaxing gestures, creating a deep pause in which the breath returns to its natural rhythm.

An essential, complete journey to feel more present, lighter and balanced.`,
    "abbandono-sensoriale": `An invitation to let go of noise and surrender completely to sensation. Water, fragrance, warmth and deep techniques guide the body towards a state of profound calm.

The ritual embraces the head, scalp, neck and shoulders with slow, continuous gestures designed to encourage relaxation and free mental space.

An immersive experience to enjoy without rushing, rediscovering silence, presence and true surrender.`,
    "wine-essence": `A sensory ritual inspired by the richness of grapes and their enveloping notes. Aromatic gestures meet scalp and head care in a refined, relaxing and antioxidant journey.

Massage encourages a pleasant sense of vitality, while fragrances and textures turn every step into a sophisticated wellbeing moment.

An intense, precious experience for those wishing to rediscover energy, radiance and pleasure through the senses.`,
    "abbraccio-vita": `A delicate, reassuring and deeply welcoming ritual created for the special time of pregnancy.

Every technique is carefully adapted, focusing on the head, scalp, neck and areas seeking greater comfort. Each gesture invites you to slow down, breathe and feel supported.

A pause of care and wellbeing devoted to the mother, experienced as a gentle embrace for body and mind.`,
    carezza: `An essential journey in which touch becomes care. Gentle cleansing, water and light techniques guide the head and scalp towards an immediate feeling of comfort.

The gestures are soft, measured and continuous—ideal for discovering the HEAD SPA experience with simplicity or enjoying a short but authentic pause.

A caress that slows time and restores lightness, calm and presence.`,
    "two-souls": `An experience created to be shared. Two HEAD SPA rituals unfold in harmony, following the same rhythm of water, fragrance and enveloping techniques.

Head, scalp, neck and shoulders are guided towards deep relaxation, while the other person’s presence turns the treatment into a shared memory.

A suspended moment to slow down together, rediscover connection and preserve a feeling of wellbeing that continues beyond the ritual.`,
  },
  es: {
    "cielo-terra": `Un viaje de bienestar de la cabeza a los pies, pensado para reequilibrar cuerpo y mente mediante una experiencia envolvente y profundamente relajante.

Cielo es la cabeza: el punto donde todo comienza. Un ritual dedicado al cuero cabelludo y la cabeza, con limpieza, masajes y gestos delicados que ayudan a liberar tensiones, despejar la mente y recuperar una agradable sensación de ligereza.

Tierra son los pies: nuestro punto de contacto con el mundo. Un tratamiento dedicado a esta parte del cuerpo, con rituales y masajes diseñados para brindar confort, relajación y una sensación de arraigo.

Cielo y Tierra se encuentran en un único recorrido, creando equilibrio entre ligereza y arraigo, energía y abandono, mente y cuerpo.

Una experiencia para vivir lentamente, dejándose guiar por el ritmo de los tratamientos y el placer de recuperar el propio equilibrio.

De la cabeza a los pies. Del Cielo a la Tierra. Un ritual para reencontrarse.`,
    "radici-armonia": `Un ritual que nace en las raíces para devolver la armonía a todo el cuerpo. El cuero cabelludo, la nuca y los hombros reciben maniobras lentas y envolventes que liberan tensiones y aligeran la mente.

La limpieza delicada y el masaje capilar se alternan con gestos relajantes, creando una pausa profunda en la que la respiración recupera su ritmo natural.

Un recorrido esencial y completo para sentirse presente, ligero y en equilibrio.`,
    "abbandono-sensoriale": `Una invitación a soltar el ruido y confiar plenamente en las sensaciones. Agua, aromas, calor y maniobras profundas acompañan al cuerpo hacia una calma intensa.

El ritual envuelve cabeza, cuero cabelludo, nuca y hombros con gestos lentos y continuos que favorecen la relajación y liberan espacio mental.

Una experiencia inmersiva para vivir sin prisa y recuperar silencio, presencia y auténtico abandono.`,
    "wine-essence": `Un ritual sensorial inspirado en la riqueza de la uva y sus notas envolventes. Los gestos aromáticos se unen al cuidado del cuero cabelludo y la cabeza en un recorrido refinado, relajante y antioxidante.

El masaje aporta vitalidad, mientras aromas y texturas convierten cada paso en un sofisticado momento de bienestar.

Una experiencia intensa y preciosa para recuperar energía, luminosidad y placer a través de los sentidos.`,
    "abbraccio-vita": `Un ritual delicado, tranquilizador y profundamente acogedor, creado para acompañar el momento especial del embarazo.

Las maniobras se adaptan con cuidado y respeto, concentrándose en cabeza, cuero cabelludo, nuca y zonas que buscan mayor confort. Cada gesto invita a bajar el ritmo, respirar y sentirse acompañada.

Una pausa de escucha y bienestar dedicada a la madre, como un abrazo amable para cuerpo y mente.`,
    carezza: `Un recorrido esencial donde el tacto se convierte en cuidado. Limpieza delicada, agua y maniobras ligeras llevan la cabeza y el cuero cabelludo hacia una sensación inmediata de confort.

Los gestos son suaves, medidos y continuos, ideales para acercarse con sencillez a la experiencia HEAD SPA o regalarse una pausa breve pero auténtica.

Una caricia que ralentiza el tiempo y devuelve ligereza, calma y presencia.`,
    "two-souls": `Una experiencia creada para compartir. Dos rituales HEAD SPA se desarrollan en armonía, siguiendo el mismo ritmo de agua, aromas y maniobras envolventes.

Cabeza, cuero cabelludo, nuca y hombros avanzan hacia una relajación profunda, mientras la presencia de la otra persona convierte el tratamiento en un recuerdo compartido.

Un tiempo suspendido para bajar el ritmo juntos, recuperar la complicidad y conservar un bienestar que continúa después del ritual.`,
  },
  fr: {
    "cielo-terra": `Un voyage de bien-être de la tête aux pieds, conçu pour rééquilibrer le corps et l’esprit grâce à une expérience enveloppante et profondément relaxante.

Le Ciel, c’est la tête : le point de départ de tout. Un rituel consacré au cuir chevelu et à la tête, composé de nettoyage, de massages et de gestes délicats qui aident à libérer les tensions, dégager l’esprit et retrouver une agréable légèreté.

La Terre, ce sont les pieds : notre point de contact avec le monde. Un soin dédié à cette partie du corps, avec des rituels et des massages conçus pour offrir confort, détente et ancrage.

Le Ciel et la Terre se rejoignent dans un même parcours, créant un équilibre entre légèreté et ancrage, énergie et abandon, esprit et corps.

Une expérience à vivre lentement, guidée par le rythme des soins et le plaisir de retrouver son équilibre.

De la tête aux pieds. Du Ciel à la Terre. Un rituel pour se retrouver.`,
    "radici-armonia": `Un rituel qui part des racines pour ramener l’harmonie dans tout le corps. Le cuir chevelu, la nuque et les épaules sont enveloppés de gestes lents conçus pour libérer les tensions et alléger l’esprit.

Le nettoyage délicat et le massage du cuir chevelu alternent avec des gestes relaxants, créant une pause profonde où le souffle retrouve son rythme naturel.

Un parcours essentiel et complet pour se sentir plus présent, léger et équilibré.`,
    "abbandono-sensoriale": `Une invitation à laisser le bruit derrière soi et à s’abandonner pleinement aux sensations. Eau, parfums, chaleur et gestes profonds guident le corps vers un calme intense.

Le rituel enveloppe la tête, le cuir chevelu, la nuque et les épaules de mouvements lents et continus favorisant la détente et libérant l’espace mental.

Une expérience immersive à vivre sans hâte pour retrouver silence, présence et véritable lâcher-prise.`,
    "wine-essence": `Un rituel sensoriel inspiré par la richesse du raisin et ses notes enveloppantes. Les gestes aromatiques rencontrent le soin du cuir chevelu et de la tête dans un parcours raffiné, relaxant et antioxydant.

Le massage procure une agréable vitalité, tandis que parfums et textures transforment chaque étape en un moment de bien-être sophistiqué.

Une expérience intense et précieuse pour retrouver énergie, éclat et plaisir par les sens.`,
    "abbraccio-vita": `Un rituel délicat, rassurant et profondément accueillant, conçu pour accompagner le temps précieux de la grossesse.

Les gestes sont adaptés avec soin et respect, en privilégiant la tête, le cuir chevelu, la nuque et les zones en quête de confort. Chaque mouvement invite à ralentir, respirer et se sentir soutenue.

Une pause d’écoute et de bien-être dédiée à la future maman, comme une douce étreinte pour le corps et l’esprit.`,
    carezza: `Un parcours essentiel où le toucher devient soin. Nettoyage délicat, eau et gestes légers guident la tête et le cuir chevelu vers une sensation immédiate de confort.

Les mouvements sont doux, mesurés et continus, idéals pour découvrir simplement l’expérience HEAD SPA ou s’offrir une pause brève mais authentique.

Une caresse qui ralentit le temps et restitue légèreté, calme et présence.`,
    "two-souls": `Une expérience conçue pour être partagée. Deux rituels HEAD SPA se déroulent en harmonie, au même rythme d’eau, de parfums et de gestes enveloppants.

La tête, le cuir chevelu, la nuque et les épaules sont guidés vers une détente profonde, tandis que la présence de l’autre transforme le soin en souvenir commun.

Un temps suspendu pour ralentir ensemble, retrouver la complicité et préserver un bien-être qui se prolonge après le rituel.`,
  },
  de: {
    "cielo-terra": `Eine Wellnessreise von Kopf bis Fuß, die Körper und Geist durch ein umhüllendes, tief entspannendes Erlebnis wieder ins Gleichgewicht bringt.

Der Himmel ist der Kopf: der Punkt, an dem alles beginnt. Ein Ritual für Kopfhaut und Kopf mit Reinigung, Massage und sanften Berührungen, die Spannungen lösen, den Geist befreien und angenehme Leichtigkeit schenken.

Die Erde sind die Füße: unser Kontaktpunkt mit der Welt. Eine Behandlung für diesen Körperbereich mit Ritualen und Massagen, die Komfort, Entspannung und ein Gefühl der Erdung schenken.

Himmel und Erde begegnen sich in einem einzigen Weg und schaffen Balance zwischen Leichtigkeit und Erdung, Energie und Loslassen, Geist und Körper.

Ein Erlebnis, das langsam genossen werden möchte – getragen vom Rhythmus der Behandlungen und der Freude am eigenen Gleichgewicht.

Von Kopf bis Fuß. Vom Himmel zur Erde. Ein Ritual, um wieder zu sich selbst zu finden.`,
    "radici-armonia": `Ein Ritual, das an den Wurzeln beginnt und dem ganzen Körper Harmonie schenkt. Kopfhaut, Nacken und Schultern werden mit langsamen, umhüllenden Griffen behandelt, die angestaute Spannungen lösen und den Geist erleichtern.

Sanfte Reinigung und Kopfhautmassage wechseln sich mit entspannenden Berührungen ab. So entsteht eine tiefe Pause, in der der Atem seinen natürlichen Rhythmus wiederfindet.

Ein wesentlicher, vollständiger Weg zu mehr Präsenz, Leichtigkeit und Balance.`,
    "abbandono-sensoriale": `Eine Einladung, den Lärm loszulassen und sich den Empfindungen ganz anzuvertrauen. Wasser, Düfte, Wärme und tiefe Griffe führen den Körper in intensive Ruhe.

Das Ritual umfasst Kopf, Kopfhaut, Nacken und Schultern mit langsamen, kontinuierlichen Bewegungen, die Entspannung fördern und geistigen Raum schaffen.

Ein immersives Erlebnis ohne Eile, um Stille, Präsenz und echtes Loslassen wiederzufinden.`,
    "wine-essence": `Ein sinnliches Ritual, inspiriert vom Reichtum der Traube und ihren umhüllenden Noten. Aromatische Berührungen verbinden sich mit Kopfhaut- und Kopfpflege zu einem raffinierten, entspannenden und antioxidativen Weg.

Die Massage schenkt angenehme Vitalität, während Düfte und Texturen jeden Schritt in einen anspruchsvollen Wohlfühlmoment verwandeln.

Ein intensives, kostbares Erlebnis für neue Energie, Ausstrahlung und sinnlichen Genuss.`,
    "abbraccio-vita": `Ein sanftes, beruhigendes und besonders geborgenes Ritual für die kostbare Zeit der Schwangerschaft.

Alle Griffe werden achtsam angepasst und konzentrieren sich auf Kopf, Kopfhaut, Nacken und Bereiche, die mehr Komfort wünschen. Jede Berührung lädt dazu ein, langsamer zu werden, zu atmen und sich getragen zu fühlen.

Eine Pause voller Achtsamkeit und Wohlbefinden für die werdende Mutter – wie eine sanfte Umarmung für Körper und Geist.`,
    carezza: `Ein wesentlicher Weg, auf dem Berührung zur Pflege wird. Sanfte Reinigung, Wasser und leichte Griffe führen Kopf und Kopfhaut zu einem unmittelbaren Gefühl von Komfort.

Die Bewegungen sind weich, achtsam und fließend – ideal, um das HEAD-SPA-Erlebnis unkompliziert kennenzulernen oder sich eine kurze, echte Pause zu schenken.

Eine Berührung, die die Zeit verlangsamt und Leichtigkeit, Ruhe und Präsenz zurückbringt.`,
    "two-souls": `Ein Erlebnis zum Teilen. Zwei HEAD-SPA-Rituale verlaufen harmonisch im gleichen Rhythmus aus Wasser, Düften und umhüllenden Berührungen.

Kopf, Kopfhaut, Nacken und Schultern werden in tiefe Entspannung geführt, während die Anwesenheit des anderen die Behandlung zu einer gemeinsamen Erinnerung macht.

Ein Augenblick außerhalb der Zeit, um gemeinsam langsamer zu werden, Nähe wiederzufinden und ein Wohlgefühl zu bewahren, das über das Ritual hinaus anhält.`,
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
  it: { eyebrow: "HEAD SPA · Trattamenti", heading: "Scegli il tuo rituale.", intro: "Scopri durata, benefici e prezzo di ogni trattamento HEAD SPA.", read: "Leggi la descrizione", close: "Chiudi", closeAria: "Chiudi la descrizione di", kicker: "HEAD SPA · Il rituale", back: "Torna al trattamento" },
  en: { eyebrow: "HEAD SPA · Treatments", heading: "Choose your ritual.", intro: "Discover the duration, benefits and price of every HEAD SPA treatment.", read: "Read description", close: "Close", closeAria: "Close the description of", kicker: "HEAD SPA · The ritual", back: "Back to treatment" },
  es: { eyebrow: "HEAD SPA · Tratamientos", heading: "Elige tu ritual.", intro: "Descubre la duración, los beneficios y el precio de cada tratamiento HEAD SPA.", read: "Leer descripción", close: "Cerrar", closeAria: "Cerrar la descripción de", kicker: "HEAD SPA · El ritual", back: "Volver al tratamiento" },
  fr: { eyebrow: "HEAD SPA · Soins", heading: "Choisissez votre rituel.", intro: "Découvrez la durée, les bienfaits et le prix de chaque soin HEAD SPA.", read: "Lire la description", close: "Fermer", closeAria: "Fermer la description de", kicker: "HEAD SPA · Le rituel", back: "Retour au soin" },
  de: { eyebrow: "HEAD SPA · Behandlungen", heading: "Wähle dein Ritual.", intro: "Entdecke Dauer, Wirkung und Preis jeder HEAD-SPA-Behandlung.", read: "Beschreibung lesen", close: "Schließen", closeAria: "Beschreibung schließen von", kicker: "HEAD SPA · Das Ritual", back: "Zurück zur Behandlung" },
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
  it: { shop: "Shop benessere", heading: "Scegli con chiarezza.", intro: "Non un semplice catalogo: parti da come vuoi sentirti e scopri i percorsi più adatti a te.", all: "Tutti", relax: "Rilassarmi", skin: "Pelle luminosa", body: "Corpo e forma", couple: "Tempo insieme", add: "Aggiungi al carrello", included: "Cosa include", featured: "Il più scelto", cart: "Carrello", empty: "Il tuo carrello è ancora vuoto.", total: "Totale", checkout: "Vai al checkout", remove: "Rimuovi", giftTitle: "Componi un regalo che parla di chi lo riceve.", giftIntro: "Scegli il valore, scrivi il tuo messaggio e decidi quando consegnarlo. Dopo l’acquisto potrai scaricare il voucher digitale.", amount: "Valore del regalo", recipient: "Per chi è?", sender: "Da parte di", message: "Il tuo messaggio", delivery: "Quando consegnarlo", now: "Subito", date: "In una data speciale", addGift: "Aggiungi la Gift Card", checkoutTitle: "Completa l’ordine", contact: "I tuoi dati", name: "Nome e cognome", email: "Email", phone: "Telefono", payment: "Pagamento", card: "Numero carta", expiry: "Scadenza", cvc: "CVC", demo: "Pagamento dimostrativo: nessun importo verrà addebitato.", pay: "Conferma e paga", success: "Il tuo regalo di benessere è pronto.", successCopy: "Ordine confermato. Puoi scaricare subito il voucher digitale; nella versione finale verrà inviato anche via email.", voucher: "Scarica il voucher", continue: "Continua a esplorare", close: "Chiudi", order: "Ordine" },
  en: { shop: "Wellness shop", heading: "Choose with clarity.", intro: "More than a catalogue: start from how you want to feel and discover the right journey for you.", all: "All", relax: "Relax", skin: "Radiant skin", body: "Body & shape", couple: "Time together", add: "Add to cart", included: "What's included", featured: "Most loved", cart: "Cart", empty: "Your cart is still empty.", total: "Total", checkout: "Go to checkout", remove: "Remove", giftTitle: "Create a gift that feels personal.", giftIntro: "Choose the value, write your message and schedule delivery. Download the digital voucher after purchase.", amount: "Gift value", recipient: "Recipient", sender: "From", message: "Your message", delivery: "Delivery", now: "Now", date: "On a special date", addGift: "Add Gift Card", checkoutTitle: "Complete your order", contact: "Your details", name: "Full name", email: "Email", phone: "Phone", payment: "Payment", card: "Card number", expiry: "Expiry", cvc: "CVC", demo: "Demo payment: no charge will be made.", pay: "Confirm and pay", success: "Your wellbeing gift is ready.", successCopy: "Order confirmed. Download your digital voucher now; the final version will also arrive by email.", voucher: "Download voucher", continue: "Keep exploring", close: "Close", order: "Order" },
  es: { shop: "Tienda bienestar", heading: "Elige con claridad.", intro: "Más que un catálogo: parte de cómo quieres sentirte y descubre el recorrido adecuado.", all: "Todos", relax: "Relajarme", skin: "Piel luminosa", body: "Cuerpo y forma", couple: "Tiempo juntos", add: "Añadir al carrito", included: "Qué incluye", featured: "Más elegido", cart: "Carrito", empty: "Tu carrito está vacío.", total: "Total", checkout: "Ir al pago", remove: "Eliminar", giftTitle: "Crea un regalo realmente personal.", giftIntro: "Elige el valor, escribe tu mensaje y programa la entrega. Descarga el bono digital tras la compra.", amount: "Valor del regalo", recipient: "Destinatario", sender: "De parte de", message: "Tu mensaje", delivery: "Entrega", now: "Ahora", date: "En una fecha especial", addGift: "Añadir tarjeta regalo", checkoutTitle: "Completa el pedido", contact: "Tus datos", name: "Nombre completo", email: "Email", phone: "Teléfono", payment: "Pago", card: "Número de tarjeta", expiry: "Caducidad", cvc: "CVC", demo: "Pago de demostración: no se realizará ningún cargo.", pay: "Confirmar y pagar", success: "Tu regalo de bienestar está listo.", successCopy: "Pedido confirmado. Ya puedes descargar el bono digital.", voucher: "Descargar bono", continue: "Seguir explorando", close: "Cerrar", order: "Pedido" },
  fr: { shop: "Boutique bien-être", heading: "Choisissez en toute clarté.", intro: "Plus qu’un catalogue : partez de ce que vous souhaitez ressentir et découvrez le parcours adapté.", all: "Tous", relax: "Me détendre", skin: "Peau lumineuse", body: "Corps et forme", couple: "Temps à deux", add: "Ajouter au panier", included: "Ce qui est inclus", featured: "Le plus choisi", cart: "Panier", empty: "Votre panier est vide.", total: "Total", checkout: "Passer au paiement", remove: "Supprimer", giftTitle: "Composez un cadeau vraiment personnel.", giftIntro: "Choisissez la valeur, écrivez votre message et planifiez la remise. Téléchargez le bon numérique après l’achat.", amount: "Valeur du cadeau", recipient: "Destinataire", sender: "De la part de", message: "Votre message", delivery: "Livraison", now: "Maintenant", date: "À une date spéciale", addGift: "Ajouter la carte cadeau", checkoutTitle: "Finalisez la commande", contact: "Vos coordonnées", name: "Nom complet", email: "E-mail", phone: "Téléphone", payment: "Paiement", card: "Numéro de carte", expiry: "Expiration", cvc: "CVC", demo: "Paiement de démonstration : aucun débit ne sera effectué.", pay: "Confirmer et payer", success: "Votre cadeau bien-être est prêt.", successCopy: "Commande confirmée. Vous pouvez télécharger votre bon numérique.", voucher: "Télécharger le bon", continue: "Continuer à explorer", close: "Fermer", order: "Commande" },
  de: { shop: "Wellness-Shop", heading: "Klar und sicher wählen.", intro: "Mehr als ein Katalog: Beginne mit deinem Wunschgefühl und entdecke den passenden Weg.", all: "Alle", relax: "Entspannen", skin: "Strahlende Haut", body: "Körper & Form", couple: "Zeit zu zweit", add: "In den Warenkorb", included: "Enthalten", featured: "Am beliebtesten", cart: "Warenkorb", empty: "Dein Warenkorb ist noch leer.", total: "Gesamt", checkout: "Zur Kasse", remove: "Entfernen", giftTitle: "Gestalte ein persönliches Geschenk.", giftIntro: "Wähle den Wert, schreibe deine Nachricht und plane die Übergabe. Nach dem Kauf kannst du den digitalen Gutschein herunterladen.", amount: "Geschenkwert", recipient: "Für", sender: "Von", message: "Deine Nachricht", delivery: "Übergabe", now: "Sofort", date: "An einem besonderen Tag", addGift: "Geschenkkarte hinzufügen", checkoutTitle: "Bestellung abschließen", contact: "Deine Daten", name: "Vollständiger Name", email: "E-Mail", phone: "Telefon", payment: "Zahlung", card: "Kartennummer", expiry: "Gültig bis", cvc: "CVC", demo: "Demo-Zahlung: Es wird nichts belastet.", pay: "Bestätigen und bezahlen", success: "Dein Wellness-Geschenk ist bereit.", successCopy: "Bestellung bestätigt. Du kannst den digitalen Gutschein jetzt herunterladen.", voucher: "Gutschein herunterladen", continue: "Weiter entdecken", close: "Schließen", order: "Bestellung" },
};

const giftPlaceholders: Record<Language, { recipient: string; sender: string; message: string; previewRecipient: string; previewMessage: string; dedication: string }> = {
  it: { recipient: "Nome", sender: "Il tuo nome", message: "Scrivi una dedica personale...", previewRecipient: "Per una persona speciale", previewMessage: "Un tempo solo tuo.", dedication: "Una persona speciale" },
  en: { recipient: "Name", sender: "Your name", message: "Write a personal message...", previewRecipient: "For someone special", previewMessage: "Time just for you.", dedication: "Someone special" },
  es: { recipient: "Nombre", sender: "Tu nombre", message: "Escribe una dedicatoria personal...", previewRecipient: "Para una persona especial", previewMessage: "Un tiempo solo para ti.", dedication: "Una persona especial" },
  fr: { recipient: "Prénom", sender: "Votre nom", message: "Écrivez un message personnel...", previewRecipient: "Pour une personne spéciale", previewMessage: "Un moment rien que pour vous.", dedication: "Une personne spéciale" },
  de: { recipient: "Name", sender: "Dein Name", message: "Schreibe eine persönliche Nachricht...", previewRecipient: "Für einen besonderen Menschen", previewMessage: "Zeit nur für dich.", dedication: "Ein besonderer Mensch" },
};

const numberLocales: Record<Language, string> = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" };

export default function CommerceExperience({ language, mode = "overview" }: { language: Language; mode?: "overview" | "treatments" | "gift" }) {
  const l = labels[language];
  const placeholders = giftPlaceholders[language];
  const catalog = catalogCopy[language];
  const experience = experienceCopy[language];
  const treatment = treatmentCopy[language];
  const euro = useMemo(() => new Intl.NumberFormat(numberLocales[language], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }), [language]);
  const [need, setNeed] = useState<Need>("all");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [stage, setStage] = useState<"cart" | "checkout" | "success">("cart");
  const [giftAmount, setGiftAmount] = useState(100);
  const [gift, setGift] = useState({ to: "", from: "", message: "", delivery: "now" });
  const [orderNumber, setOrderNumber] = useState("");
  const visible = need === "all" ? products : products.filter((product) => product.need === need);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const voucherGift = useMemo(() => cart.find((item) => item.gift)?.gift, [cart]);

  const addProduct = (product: Product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      return existing ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { id: product.id, title: product.title, detail: product.sessions, price: product.price, quantity: 1 }];
    });
    setStage("cart");
    setCartOpen(true);
  };

  const addGift = () => {
    setCart((items) => [...items, { id: `gift-${Date.now()}`, title: "Virginia SPA Gift Card", detail: gift.to ? `${l.recipient}: ${gift.to}` : l.amount, price: giftAmount, quantity: 1, gift: { ...gift } }]);
    setStage("cart");
    setCartOpen(true);
  };

  const completeOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderNumber(`VS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
    setStage("success");
  };

  const downloadVoucher = () => {
    const recipient = voucherGift?.to || placeholders.dedication;
    const sender = voucherGift?.from || translate("Con affetto", language);
    const message = voucherGift?.message || placeholders.previewMessage;
    const safe = (value: string) => value.replace(/[<>&]/g, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700"><rect width="1200" height="700" fill="#f5f0e7"/><rect x="34" y="34" width="1132" height="632" rx="36" fill="none" stroke="#b86145" stroke-width="2"/><circle cx="1020" cy="150" r="190" fill="#aab6a2" opacity=".32"/><text x="90" y="115" font-family="Georgia,serif" font-size="54" fill="#28382f">Virginia SPA</text><text x="90" y="200" font-family="Arial,sans-serif" font-size="18" letter-spacing="5" fill="#b86145">${translate("GIFT RITUAL · VOUCHER DIGITALE", language)}</text><text x="90" y="310" font-family="Georgia,serif" font-size="34" fill="#697169">${translate("Per", language)}</text><text x="90" y="370" font-family="Georgia,serif" font-size="64" fill="#28382f">${safe(recipient)}</text><text x="90" y="445" font-family="Georgia,serif" font-size="28" fill="#503044">${safe(message)}</text><text x="90" y="535" font-family="Arial,sans-serif" font-size="22" fill="#697169">${translate("Da", language)} ${safe(sender)}</text><text x="90" y="610" font-family="Arial,sans-serif" font-size="17" letter-spacing="2" fill="#697169">${safe(orderNumber)} · ${translate("VALORE", language)} ${euro.format(giftAmount)} · ${translate("VALIDITÀ 12 MESI", language)}</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Virginia-SPA-Voucher-${orderNumber}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id={mode === "gift" ? "gift-atelier" : "shop"} className={mode === "gift" ? "commerce-section gift-commerce-page" : "commerce-section"}>
      {mode === "overview" && <>
      <div className="commerce-heading experience-overview-heading">
        <p className="eyebrow"><span /> {experience.eyebrow}</p>
        <h2>{experience.heading}</h2>
        <p>{experience.intro}</p>
      </div>
      <Link className="experience-card" href="/head-spa" aria-label={experience.aria}>
        <div className="experience-card-image">
          <Image src="/water-stilllife.webp" alt={experience.imageAlt} fill unoptimized sizes="(max-width: 700px) 100vw, 55vw" />
          <span>{experience.badge}</span>
        </div>
        <div className="experience-card-copy">
          <p>{experience.kicker}</p><h3>HEAD <em>SPA</em></h3>
          <span className="experience-card-action">{experience.action} <b aria-hidden="true">→</b></span>
        </div>
      </Link>
      </>}

      {mode === "treatments" && <>
      <div className="commerce-heading">
        <p className="eyebrow"><span /> {treatment.eyebrow}</p>
        <h2>{treatment.heading}</h2>
        <p>{treatment.intro}</p>
        <button className="cart-trigger" type="button" onClick={() => { setStage("cart"); setCartOpen(true); }} aria-label={`${l.cart}: ${count}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2 11h10l2-7H7M9 20h.01M17 20h.01" /></svg>
          <span>{l.cart}</span><i>{count}</i>
        </button>
      </div>

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
              <div>{(language === "it" ? detailedDescriptions[product.id] : translatedDetailedDescriptions[language][product.id]).split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
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
          <fieldset><legend>{l.amount}</legend><div className="amount-options">{[50, 100, 150, 250].map((amount) => <button type="button" key={amount} className={giftAmount === amount ? "active" : ""} onClick={() => setGiftAmount(amount)}>{euro.format(amount)}</button>)}</div></fieldset>
          <label>{l.recipient}<input value={gift.to} onChange={(event) => setGift({ ...gift, to: event.target.value })} placeholder={placeholders.recipient} /></label>
          <label>{l.sender}<input value={gift.from} onChange={(event) => setGift({ ...gift, from: event.target.value })} placeholder={placeholders.sender} /></label>
          <label>{l.message}<textarea maxLength={120} value={gift.message} onChange={(event) => setGift({ ...gift, message: event.target.value })} placeholder={placeholders.message} /><small>{gift.message.length}/120</small></label>
          <fieldset><legend>{l.delivery}</legend><div className="delivery-options"><label><input type="radio" name="delivery" checked={gift.delivery === "now"} onChange={() => setGift({ ...gift, delivery: "now" })} />{l.now}</label><label><input type="radio" name="delivery" checked={gift.delivery === "date"} onChange={() => setGift({ ...gift, delivery: "date" })} />{l.date}</label></div></fieldset>
          {gift.delivery === "date" && <label>{l.date}<input type="date" /></label>}
          <button className="button button-primary" type="button" onClick={addGift}>{l.addGift}<span>→</span></button>
        </div>
      </div>
      }

      {cartOpen && <div className="commerce-backdrop" onMouseDown={() => setCartOpen(false)}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="commerce-close" type="button" onClick={() => setCartOpen(false)} aria-label={l.close}>×</button>
        {stage === "cart" && <><p className="section-index">{translate("Virginia SPA Shop", language)}</p><h2 id="cart-title">{l.cart}</h2>{cart.length === 0 ? <div className="cart-empty"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2 11h10l2-7H7M9 20h.01M17 20h.01" /></svg><p>{l.empty}</p></div> : <><div className="cart-items">{cart.map((item) => <article key={item.id}><div><h3>{item.title}</h3><p>{item.detail}</p><button type="button" onClick={() => setCart((items) => items.filter(({ id }) => id !== item.id))}>{l.remove}</button></div><strong>{euro.format(item.price * item.quantity)}</strong></article>)}</div><div className="cart-total"><span>{l.total}</span><strong>{euro.format(total)}</strong></div><button className="button button-primary commerce-primary" type="button" onClick={() => setStage("checkout")}>{l.checkout}<span>→</span></button></>}</>}
        {stage === "checkout" && <form className="checkout-form" onSubmit={completeOrder}><p className="section-index">{translate("Checkout sicuro · Demo", language)}</p><h2 id="cart-title">{l.checkoutTitle}</h2><fieldset><legend>{l.contact}</legend><label>{l.name}<input required autoComplete="name" /></label><label>{l.email}<input required type="email" autoComplete="email" /></label><label>{l.phone}<input required type="tel" autoComplete="tel" /></label></fieldset><fieldset><legend>{l.payment}</legend><label>{l.card}<input required inputMode="numeric" placeholder="4242 4242 4242 4242" pattern="[0-9 ]{16,19}" /></label><div><label>{l.expiry}<input required placeholder="MM/AA" /></label><label>{l.cvc}<input required inputMode="numeric" placeholder="123" /></label></div></fieldset><p className="demo-payment"><span>i</span>{l.demo}</p><div className="checkout-summary"><span>{l.total}</span><strong>{euro.format(total)}</strong></div><button className="button button-primary commerce-primary" type="submit">{l.pay}<span>→</span></button></form>}
        {stage === "success" && <div className="order-success"><span className="success-mark">✓</span><p className="section-index">{l.order} {orderNumber}</p><h2>{l.success}</h2><p>{l.successCopy}</p><button className="button button-primary commerce-primary" type="button" onClick={downloadVoucher}>{l.voucher}<span>↓</span></button><button className="text-link" type="button" onClick={() => { setCart([]); setCartOpen(false); }}>{l.continue}</button></div>}
      </aside></div>}
    </section>
  );
}
