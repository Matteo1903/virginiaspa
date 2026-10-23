import type { Language } from "./i18n";

export const ayurvedaFilterIds = ["all", "relax", "warmth", "lightness", "harmony"] as const;
export type AyurvedaFilter = typeof ayurvedaFilterIds[number];
type AyurvedaNeed = Exclude<AyurvedaFilter, "all">;

export const ayurvedaFilterCopy: Record<Language, Record<AyurvedaFilter | "label", string>> = {
  it: { label: "Filtra i rituali Ayurveda", all: "Tutti", relax: "Relax e distensione", warmth: "Calore e oli", lightness: "Pelle e leggerezza", harmony: "Armonia interiore" },
  en: { label: "Filter Ayurveda rituals", all: "All", relax: "Relaxation and release", warmth: "Warmth and oils", lightness: "Skin and lightness", harmony: "Inner harmony" },
  es: { label: "Filtrar los rituales Ayurveda", all: "Todos", relax: "Relajación y descanso", warmth: "Calor y aceites", lightness: "Piel y ligereza", harmony: "Armonía interior" },
  fr: { label: "Filtrer les rituels Ayurveda", all: "Tous", relax: "Détente et relaxation", warmth: "Chaleur et huiles", lightness: "Peau et légèreté", harmony: "Harmonie intérieure" },
  de: { label: "Ayurveda-Rituale filtern", all: "Alle", relax: "Entspannung und Ruhe", warmth: "Wärme und Öle", lightness: "Haut und Leichtigkeit", harmony: "Innere Harmonie" },
};

type AyurvedaPageCopy = {
  intro: string; doshaTitle: string; doshaText: string; pillarsTitle: string;
  pillars: { title: string; text: string }[]; approach: string;
  jump: string; ritualsTitle: string; ritualsIntro: string; count: string;
  read: string; close: string; closeAria: string; back: string; ask: string;
  completeTitle: string; completeText: string; buy: string; duration: string; price: string;
};

// Copy from the 17 photographs supplied on 23 October 2026, with spelling normalized.
export const ayurvedaPageCopy: Record<Language, AyurvedaPageCopy> = {
  it: {
    intro: "Ayus, la vita. Veda, la conoscenza.\n\nUn viaggio dentro di sé, per ascoltare ciò che il corpo sussurra e le emozioni raccontano. Attraverso l’antica saggezza dell’Ayurveda, riscopriamo uno spazio di ascolto, presenza e armonia, dove corpo, mente e sensi possono tornare a fluire in equilibrio.",
    doshaTitle: "Dosha ed equilibrio", doshaText: "Secondo la tradizione ayurvedica, le molteplici funzioni del corpo, dalle più evidenti alle più sottili, sono governate da tre principi fondamentali chiamati dosha: Vata, Pitta e Kapha. La ricerca del loro equilibrio accompagna il percorso di benessere.",
    pillarsTitle: "I quattro obiettivi dell’Ayurveda · Purusartha",
    pillars: [
      { title: "Dharma · La via dell’armonia", text: "Dovere: principi etici e morali che danno ordine alla vita e invitano alla responsabilità." },
      { title: "Artha · Il valore della vita", text: "Scopo: la ricerca di ciò che rende la vita significativa e prospera, attraverso stabilità, realizzazione e benessere." },
      { title: "Kama · Il piacere dei sensi", text: "Desiderio: la capacità di vivere la bellezza, le emozioni e i piaceri della vita in modo consapevole." },
      { title: "Moksha · Libertà interiore", text: "Liberazione dai condizionamenti che legano l’essere umano all’esistenza." },
    ],
    approach: "Il massaggio accarezza il corpo e invita a prendersene cura. I cristalli accompagnano simbolicamente l’ascolto delle emozioni. Lo Shirodhara offre una pausa dal flusso dei pensieri; respiro e meditazione invitano a ritrovare il proprio centro. Un viaggio dentro di te, dove corpo, mente, emozioni e anima ritrovano armonia e benessere.",
    jump: "Scopri i rituali", ritualsTitle: "Il tuo spazio di equilibrio.", ritualsIntro: "Esplora i rituali della tradizione ayurvedica. Leggi ogni descrizione e contatta la SPA per scegliere il trattamento, la durata e i dettagli più adatti a te.", count: "15 rituali ayurvedici",
    read: "Leggi la descrizione", close: "Chiudi", closeAria: "Chiudi la descrizione di", back: "Torna al rituale", ask: "Richiedi informazioni",
    completeTitle: "Il percorso completo", completeText: "Un’esperienza di tre ore che unisce più rituali ayurvedici. Corpo, mente e sensi si incontrano in un viaggio di cura e profondo abbandono; concorda con la SPA i dettagli del tuo percorso.", buy: "Acquista il voucher", duration: "Durata", price: "Prezzo",
  },
  en: {
    intro: "Ayus, life. Veda, knowledge.\n\nA journey within, to listen to what the body whispers and emotions reveal. Through the ancient wisdom of Ayurveda, rediscover a space of listening, presence and harmony, where body, mind and senses can flow in balance once more.",
    doshaTitle: "Doshas and balance", doshaText: "According to Ayurvedic tradition, the body’s many functions, from the most apparent to the most subtle, are governed by three fundamental principles called doshas: Vata, Pitta and Kapha. The search for their balance accompanies the journey towards wellbeing.",
    pillarsTitle: "The four aims of Ayurveda · Purusartha",
    pillars: [
      { title: "Dharma · The path of harmony", text: "Duty: ethical and moral principles that bring order to life and encourage responsibility." },
      { title: "Artha · The value of life", text: "Purpose: seeking what makes life meaningful and prosperous through stability, fulfilment and wellbeing." },
      { title: "Kama · The pleasure of the senses", text: "Desire: the ability to experience beauty, emotions and life’s pleasures with awareness." },
      { title: "Moksha · Inner freedom", text: "Release from the conditioning that binds human beings to existence." },
    ],
    approach: "Massage caresses the body and invites you to care for it. Crystals symbolically accompany the exploration of emotions. Shirodhara offers a pause from the flow of thoughts; breathing and meditation invite you to rediscover your centre. A journey within, where body, mind, emotions and soul rediscover harmony and wellbeing.",
    jump: "Discover the rituals", ritualsTitle: "Your space for balance.", ritualsIntro: "Explore the rituals of Ayurvedic tradition. Read each description and contact the SPA to choose the treatment, duration and details best suited to you.", count: "15 Ayurvedic rituals",
    read: "Read the description", close: "Close", closeAria: "Close the description of", back: "Back to the ritual", ask: "Request information",
    completeTitle: "The complete journey", completeText: "A three-hour experience bringing several Ayurvedic rituals together. Body, mind and senses meet in a journey of care and deep surrender; arrange the details of your journey with the SPA.", buy: "Buy the voucher", duration: "Duration", price: "Price",
  },
  es: {
    intro: "Ayus, la vida. Veda, el conocimiento.\n\nUn viaje hacia el interior para escuchar lo que el cuerpo susurra y las emociones cuentan. A través de la antigua sabiduría del Ayurveda, redescubrimos un espacio de escucha, presencia y armonía, donde cuerpo, mente y sentidos pueden volver a fluir en equilibrio.",
    doshaTitle: "Doshas y equilibrio", doshaText: "Según la tradición ayurvédica, las múltiples funciones del cuerpo, desde las más evidentes hasta las más sutiles, están gobernadas por tres principios fundamentales llamados doshas: Vata, Pitta y Kapha. La búsqueda de su equilibrio acompaña el recorrido de bienestar.",
    pillarsTitle: "Los cuatro objetivos del Ayurveda · Purusartha",
    pillars: [
      { title: "Dharma · El camino de la armonía", text: "Deber: principios éticos y morales que dan orden a la vida e invitan a la responsabilidad." },
      { title: "Artha · El valor de la vida", text: "Propósito: la búsqueda de lo que hace la vida significativa y próspera mediante la estabilidad, la realización y el bienestar." },
      { title: "Kama · El placer de los sentidos", text: "Deseo: la capacidad de vivir la belleza, las emociones y los placeres de la vida de forma consciente." },
      { title: "Moksha · Libertad interior", text: "Liberación de los condicionamientos que vinculan al ser humano con la existencia." },
    ],
    approach: "El masaje acaricia el cuerpo e invita a cuidarlo. Los cristales acompañan simbólicamente la escucha de las emociones. El Shirodhara ofrece una pausa del flujo de pensamientos; la respiración y la meditación invitan a recuperar el propio centro. Un viaje interior donde cuerpo, mente, emociones y alma recuperan armonía y bienestar.",
    jump: "Descubre los rituales", ritualsTitle: "Tu espacio de equilibrio.", ritualsIntro: "Explora los rituales de la tradición ayurvédica. Lee cada descripción y contacta con el SPA para elegir el tratamiento, la duración y los detalles más adecuados para ti.", count: "15 rituales ayurvédicos",
    read: "Leer la descripción", close: "Cerrar", closeAria: "Cerrar la descripción de", back: "Volver al ritual", ask: "Solicitar información",
    completeTitle: "El recorrido completo", completeText: "Una experiencia de tres horas que reúne varios rituales ayurvédicos. Cuerpo, mente y sentidos se encuentran en un viaje de cuidado y profundo abandono; acuerda los detalles de tu recorrido con el SPA.", buy: "Comprar el bono", duration: "Duración", price: "Precio",
  },
  fr: {
    intro: "Ayus, la vie. Veda, la connaissance.\n\nUn voyage intérieur pour écouter ce que le corps murmure et ce que les émotions racontent. À travers la sagesse ancestrale de l’Ayurveda, redécouvrez un espace d’écoute, de présence et d’harmonie, où le corps, l’esprit et les sens peuvent à nouveau trouver leur équilibre.",
    doshaTitle: "Doshas et équilibre", doshaText: "Selon la tradition ayurvédique, les multiples fonctions du corps, des plus évidentes aux plus subtiles, sont gouvernées par trois principes fondamentaux appelés doshas : Vata, Pitta et Kapha. La recherche de leur équilibre accompagne le parcours de bien-être.",
    pillarsTitle: "Les quatre objectifs de l’Ayurveda · Purusartha",
    pillars: [
      { title: "Dharma · La voie de l’harmonie", text: "Devoir : des principes éthiques et moraux qui donnent un ordre à la vie et invitent à la responsabilité." },
      { title: "Artha · La valeur de la vie", text: "But : rechercher ce qui rend la vie riche de sens et prospère, à travers la stabilité, l’accomplissement et le bien-être." },
      { title: "Kama · Le plaisir des sens", text: "Désir : la capacité de vivre la beauté, les émotions et les plaisirs de la vie en pleine conscience." },
      { title: "Moksha · Liberté intérieure", text: "La libération des conditionnements qui lient l’être humain à l’existence." },
    ],
    approach: "Le massage caresse le corps et invite à en prendre soin. Les cristaux accompagnent symboliquement l’écoute des émotions. Le Shirodhara offre une pause dans le flux des pensées ; la respiration et la méditation invitent à retrouver son centre. Un voyage intérieur où le corps, l’esprit, les émotions et l’âme retrouvent harmonie et bien-être.",
    jump: "Découvrez les rituels", ritualsTitle: "Votre espace d’équilibre.", ritualsIntro: "Explorez les rituels de la tradition ayurvédique. Lisez chaque description et contactez le SPA pour choisir le soin, la durée et les détails qui vous conviennent.", count: "15 rituels ayurvédiques",
    read: "Lire la description", close: "Fermer", closeAria: "Fermer la description de", back: "Retour au rituel", ask: "Demander des informations",
    completeTitle: "Le parcours complet", completeText: "Une expérience de trois heures qui réunit plusieurs rituels ayurvédiques. Corps, esprit et sens se rencontrent dans un voyage de soin et d’abandon profond ; convenez des détails de votre parcours avec le SPA.", buy: "Acheter le bon", duration: "Durée", price: "Prix",
  },
  de: {
    intro: "Ayus, das Leben. Veda, das Wissen.\n\nEine Reise nach innen, um zu hören, was der Körper flüstert und die Gefühle erzählen. Durch die überlieferte Weisheit des Ayurveda entdecken wir einen Raum des Zuhörens, der Präsenz und der Harmonie, in dem Körper, Geist und Sinne wieder ins Gleichgewicht finden können.",
    doshaTitle: "Doshas und Gleichgewicht", doshaText: "Nach ayurvedischer Tradition werden die vielfältigen Funktionen des Körpers, von den offensichtlichsten bis zu den feinsten, von drei grundlegenden Prinzipien bestimmt, den Doshas: Vata, Pitta und Kapha. Die Suche nach ihrem Gleichgewicht begleitet den Weg zum Wohlbefinden.",
    pillarsTitle: "Die vier Ziele des Ayurveda · Purusartha",
    pillars: [
      { title: "Dharma · Der Weg der Harmonie", text: "Pflicht: ethische und moralische Prinzipien, die dem Leben Ordnung geben und zu Verantwortung einladen." },
      { title: "Artha · Der Wert des Lebens", text: "Ziel: die Suche nach dem, was das Leben durch Stabilität, Erfüllung und Wohlbefinden sinnvoll und reich macht." },
      { title: "Kama · Die Freude der Sinne", text: "Verlangen: die Fähigkeit, Schönheit, Gefühle und die Freuden des Lebens bewusst zu erleben." },
      { title: "Moksha · Innere Freiheit", text: "Befreiung von den Prägungen, die den Menschen an das Dasein binden." },
    ],
    approach: "Die Massage streichelt den Körper und lädt zur Fürsorge ein. Kristalle begleiten symbolisch das Wahrnehmen von Gefühlen. Shirodhara bietet eine Pause vom Gedankenfluss; Atmung und Meditation laden dazu ein, die eigene Mitte wiederzufinden. Eine Reise nach innen, bei der Körper, Geist, Gefühle und Seele Harmonie und Wohlbefinden wiederentdecken.",
    jump: "Rituale entdecken", ritualsTitle: "Dein Raum für Balance.", ritualsIntro: "Entdecke die Rituale der ayurvedischen Tradition. Lies jede Beschreibung und kontaktiere das SPA, um die passende Behandlung, Dauer und Einzelheiten zu vereinbaren.", count: "15 ayurvedische Rituale",
    read: "Beschreibung lesen", close: "Schließen", closeAria: "Beschreibung schließen von", back: "Zurück zum Ritual", ask: "Informationen anfragen",
    completeTitle: "Das vollständige Erlebnis", completeText: "Ein dreistündiges Erlebnis, das mehrere ayurvedische Rituale vereint. Körper, Geist und Sinne begegnen sich auf einer Reise der Fürsorge und des tiefen Loslassens; vereinbare die Einzelheiten deines Erlebnisses mit dem SPA.", buy: "Gutschein kaufen", duration: "Dauer", price: "Preis",
  },
};

type RitualCopy = { subtitle: string; description: string };
function ritual(id: string, title: string, image: string, categories: AyurvedaNeed[], copy: Record<Language, [string, string]>) {
  const locales = Object.fromEntries(Object.entries(copy).map(([language, [subtitle, description]]) => [language, { subtitle, description }])) as Record<Language, RitualCopy>;
  return { id, title, image, categories, locales };
}

export const ayurvedaRituals = [
  ritual("snehana", "Snehana", "/hero-ritual.webp", ["relax", "warmth"], {
    it: ["Il rituale dell’olio e dell’accoglienza", "Un’esperienza di cura e ascolto dedicata al corpo e alla mente. Il calore dell’olio scivola sulla pelle con movimenti lenti, creando un abbraccio sensoriale che accompagna verso una profonda sensazione di rilassamento. La pelle ritrova morbidezza e luminosità."],
    en: ["The ritual of oil and welcome", "An experience of care and listening devoted to body and mind. Warm oil glides over the skin with slow movements, creating a sensory embrace that guides you towards a deep feeling of relaxation. The skin feels soft and looks radiant."],
    es: ["El ritual del aceite y la acogida", "Una experiencia de cuidado y escucha dedicada al cuerpo y a la mente. El calor del aceite se desliza sobre la piel con movimientos lentos, creando un abrazo sensorial que acompaña hacia una profunda sensación de relajación. La piel recupera suavidad y luminosidad."],
    fr: ["Le rituel de l’huile et de l’accueil", "Une expérience de soin et d’écoute dédiée au corps et à l’esprit. L’huile chaude glisse sur la peau en mouvements lents, créant une étreinte sensorielle qui accompagne vers une profonde sensation de relaxation. La peau retrouve douceur et éclat."],
    de: ["Das Ritual des Öls und der Geborgenheit", "Ein Erlebnis der Fürsorge und des Zuhörens für Körper und Geist. Warmes Öl gleitet mit langsamen Bewegungen über die Haut und schafft eine sinnliche Umarmung, die zu einem tiefen Gefühl der Entspannung führt. Die Haut fühlt sich weich an und strahlt."],
  }),
  ritual("pada-abhyanga", "Pada Abhyanga", "/water-stilllife.webp", ["relax"], {
    it: ["Pada, piede", "Un invito a rallentare il ritmo della quotidianità e a riconnettersi con sé stessi attraverso il tocco. Manovre lente, delicate e armoniose accarezzano i piedi: nella tradizione ayurvedica rappresentano il legame con la terra, il sostegno del nostro cammino e il punto da cui ritrovare stabilità ed equilibrio."],
    en: ["Pada, foot", "An invitation to slow the pace of everyday life and reconnect with yourself through touch. Slow, gentle and harmonious movements caress the feet: in Ayurvedic tradition they represent our connection with the earth, the support for our journey and a starting point for rediscovering stability and balance."],
    es: ["Pada, pie", "Una invitación a bajar el ritmo cotidiano y reconectar con uno mismo a través del tacto. Maniobras lentas, delicadas y armoniosas acarician los pies: en la tradición ayurvédica representan el vínculo con la tierra, el apoyo de nuestro camino y el punto desde el que recuperar estabilidad y equilibrio."],
    fr: ["Pada, le pied", "Une invitation à ralentir le rythme du quotidien et à se reconnecter à soi par le toucher. Des gestes lents, délicats et harmonieux caressent les pieds : dans la tradition ayurvédique, ils représentent le lien avec la terre, le soutien de notre chemin et le point de départ pour retrouver stabilité et équilibre."],
    de: ["Pada, der Fuß", "Eine Einladung, den Alltag zu entschleunigen und durch Berührung wieder zu sich selbst zu finden. Langsame, sanfte und harmonische Griffe streicheln die Füße: In der ayurvedischen Tradition stehen sie für die Verbindung zur Erde, den Halt auf unserem Weg und den Ausgangspunkt für Stabilität und Balance."],
  }),
  ritual("shirodhara", "Shirodhara", "/face-treatment.webp", ["relax", "warmth", "harmony"], {
    it: ["Il fluire della quiete", "Un antico rituale ayurvedico che invita ad abbandonarsi a un profondo senso di pace e armonia. Un filo continuo di olio tiepido scende delicatamente sulla fronte, accarezzando il punto simbolicamente legato al terzo occhio e accompagnando la mente verso uno stato di profondo rilassamento."],
    en: ["The flow of stillness", "An ancient Ayurvedic ritual inviting you to surrender to a deep sense of peace and harmony. A continuous stream of warm oil flows gently onto the forehead, caressing the point symbolically associated with the third eye and guiding the mind towards deep relaxation."],
    es: ["El fluir de la calma", "Un antiguo ritual ayurvédico que invita a entregarse a una profunda sensación de paz y armonía. Un hilo continuo de aceite tibio cae delicadamente sobre la frente, acariciando el punto simbólicamente vinculado al tercer ojo y acompañando la mente hacia una relajación profunda."],
    fr: ["Le flot de la quiétude", "Un rituel ayurvédique ancestral qui invite à s’abandonner à un profond sentiment de paix et d’harmonie. Un filet continu d’huile tiède coule délicatement sur le front, caressant le point symboliquement associé au troisième œil et accompagnant l’esprit vers une relaxation profonde."],
    de: ["Das Fließen der Ruhe", "Ein überliefertes ayurvedisches Ritual, das zu einem tiefen Gefühl von Frieden und Harmonie einlädt. Ein kontinuierlicher Strahl warmen Öls fließt sanft auf die Stirn, berührt den symbolisch mit dem dritten Auge verbundenen Punkt und begleitet den Geist in tiefe Entspannung."],
  }),
  ritual("abhyanga", "Abhyanga", "/hero-ritual.webp", ["relax", "warmth"], {
    it: ["Massaggio con olio", "Un rituale ayurvedico per eccellenza che invita a rallentare, lasciando andare tensioni e pensieri. Il calore dell’olio e il tocco delle mani regalano una profonda sensazione di abbandono. Un massaggio ispirato alla ricerca dell’equilibrio dei dosha, per ritrovare armonia tra corpo e mente."],
    en: ["Oil massage", "A quintessential Ayurvedic ritual that invites you to slow down and let go of tension and thoughts. The warmth of the oil and the touch of the hands offer a deep feeling of surrender. A massage inspired by the search for dosha balance, to rediscover harmony between body and mind."],
    es: ["Masaje con aceite", "Un ritual ayurvédico por excelencia que invita a bajar el ritmo y soltar tensiones y pensamientos. El calor del aceite y el tacto de las manos aportan una profunda sensación de abandono. Un masaje inspirado en la búsqueda del equilibrio de los doshas, para recuperar la armonía entre cuerpo y mente."],
    fr: ["Massage à l’huile", "Un rituel ayurvédique par excellence qui invite à ralentir et à relâcher tensions et pensées. La chaleur de l’huile et le toucher des mains offrent une profonde sensation d’abandon. Un massage inspiré de la recherche de l’équilibre des doshas, pour retrouver l’harmonie entre corps et esprit."],
    de: ["Ölmassage", "Ein klassisches ayurvedisches Ritual, das zum Entschleunigen und Loslassen von Anspannung und Gedanken einlädt. Die Wärme des Öls und die Berührung der Hände schenken ein tiefes Gefühl des Loslassens. Eine von der Suche nach dem Gleichgewicht der Doshas inspirierte Massage für Harmonie zwischen Körper und Geist."],
  }),
  ritual("garshan", "Garshan", "/water-stilllife.webp", ["lightness"], {
    it: ["Il risveglio della leggerezza", "Un rituale di risveglio e rinascita per lasciare andare la pesantezza, ritrovare la propria energia e riscoprire il piacere di sentirsi in sintonia con il proprio corpo. Attraverso movimenti ritmici, armoniosi e avvolgenti, Garshan stimola la pelle e invita a ritrovare il naturale equilibrio tra corpo e mente."],
    en: ["Awakening lightness", "A ritual of awakening and renewal to let go of heaviness, rediscover your energy and enjoy feeling in tune with your body. Through rhythmic, harmonious and enveloping movements, Garshan stimulates the skin and invites you to rediscover the natural balance between body and mind."],
    es: ["El despertar de la ligereza", "Un ritual de despertar y renovación para dejar atrás la pesadez, recuperar la energía y redescubrir el placer de sentirse en sintonía con el propio cuerpo. Mediante movimientos rítmicos, armoniosos y envolventes, Garshan estimula la piel e invita a recuperar el equilibrio natural entre cuerpo y mente."],
    fr: ["L’éveil de la légèreté", "Un rituel d’éveil et de renouveau pour laisser la lourdeur derrière soi, retrouver son énergie et redécouvrir le plaisir d’être en harmonie avec son corps. Par des mouvements rythmiques, harmonieux et enveloppants, Garshan stimule la peau et invite à retrouver l’équilibre naturel entre corps et esprit."],
    de: ["Das Erwachen der Leichtigkeit", "Ein Ritual des Erwachens und der Erneuerung, um Schwere loszulassen, neue Energie zu finden und sich wieder im Einklang mit dem eigenen Körper zu fühlen. Mit rhythmischen, harmonischen und umhüllenden Bewegungen regt Garshan die Haut an und lädt zu natürlicher Balance zwischen Körper und Geist ein."],
  }),
  ritual("udvarthana", "Udvarthana", "/water-stilllife.webp", ["lightness"], {
    it: ["Rituale purificante", "Un’esperienza rigenerante che unisce tradizione, natura e movimento, per una pelle più liscia e una rinnovata sensazione di benessere. Il corpo viene delicatamente levigato con una miscela di polveri botaniche, in un rituale dedicato alla cura della pelle e alla leggerezza."],
    en: ["Purifying ritual", "A restorative experience combining tradition, nature and movement for smoother skin and a renewed feeling of wellbeing. The body is gently polished with a blend of botanical powders in a ritual devoted to skin care and lightness."],
    es: ["Ritual purificante", "Una experiencia reparadora que une tradición, naturaleza y movimiento para una piel más lisa y una renovada sensación de bienestar. El cuerpo se exfolia suavemente con una mezcla de polvos botánicos en un ritual dedicado al cuidado de la piel y a la ligereza."],
    fr: ["Rituel purifiant", "Une expérience ressourçante qui allie tradition, nature et mouvement pour une peau plus lisse et une sensation de bien-être renouvelée. Le corps est délicatement exfolié avec un mélange de poudres botaniques, dans un rituel dédié au soin de la peau et à la légèreté."],
    de: ["Reinigendes Ritual", "Ein erholsames Erlebnis, das Tradition, Natur und Bewegung für glattere Haut und ein erneuertes Wohlgefühl verbindet. Der Körper wird mit einer Mischung botanischer Pulver sanft gepeelt, in einem Ritual für Hautpflege und Leichtigkeit."],
  }),
  ritual("swedhana", "Swedhana", "/hero-ritual.webp", ["warmth", "lightness"], {
    it: ["Il calore del vapore", "Un’esperienza sensoriale che rinnova la percezione di sé e regala una piacevole sensazione di vitalità e distensione. Lasciati avvolgere dal calore del vapore per ritrovare leggerezza e armonia, accompagnando il corpo verso una sensazione di maggiore flessibilità e agilità."],
    en: ["The warmth of steam", "A sensory experience that renews your sense of self and offers a pleasant feeling of vitality and ease. Let the warmth of steam envelop you to rediscover lightness and harmony, guiding the body towards a feeling of greater flexibility and freedom of movement."],
    es: ["El calor del vapor", "Una experiencia sensorial que renueva la percepción de uno mismo y aporta una agradable sensación de vitalidad y relajación. Déjate envolver por el calor del vapor para recuperar ligereza y armonía, acompañando el cuerpo hacia una sensación de mayor flexibilidad y agilidad."],
    fr: ["La chaleur de la vapeur", "Une expérience sensorielle qui renouvelle la perception de soi et offre une agréable sensation de vitalité et de détente. Laissez-vous envelopper par la chaleur de la vapeur pour retrouver légèreté et harmonie, en accompagnant le corps vers une sensation de souplesse et d’aisance."],
    de: ["Die Wärme des Dampfes", "Ein sinnliches Erlebnis, das die Selbstwahrnehmung erneuert und ein angenehmes Gefühl von Vitalität und Entspannung schenkt. Lass dich von der Wärme des Dampfes umhüllen, um Leichtigkeit und Harmonie wiederzufinden und ein Gefühl größerer Beweglichkeit und Geschmeidigkeit zu erleben."],
  }),
  ritual("pindasweda", "Pindasweda", "/hero-ritual.webp", ["warmth", "relax"], {
    it: ["Pinda, bolo · Sweda, sudare", "Un antico rituale di benessere che avvolge il corpo attraverso il calore, il profumo delle erbe e il gesto lento e armonioso del massaggio. I fagottini caldi accompagnano il tocco in un’esperienza sensoriale raccolta e avvolgente."],
    en: ["Pinda, bolus · Sweda, sweating", "An ancient wellbeing ritual that envelops the body through warmth, the scent of herbs and the slow, harmonious movements of massage. Warm compresses accompany the touch in an intimate, enveloping sensory experience."],
    es: ["Pinda, bolo · Sweda, sudar", "Un antiguo ritual de bienestar que envuelve el cuerpo mediante el calor, el aroma de las hierbas y los gestos lentos y armoniosos del masaje. Las bolsitas calientes acompañan el tacto en una experiencia sensorial íntima y envolvente."],
    fr: ["Pinda, boule · Sweda, transpirer", "Un rituel ancestral de bien-être qui enveloppe le corps par la chaleur, le parfum des plantes et les gestes lents et harmonieux du massage. Les pochons chauds accompagnent le toucher dans une expérience sensorielle intime et enveloppante."],
    de: ["Pinda, Ballen · Sweda, schwitzen", "Ein überliefertes Wohlfühlritual, das den Körper durch Wärme, Kräuterdüfte und langsame, harmonische Massagebewegungen umhüllt. Warme Stempel begleiten die Berührung in einem ruhigen, umhüllenden Sinneserlebnis."],
  }),
  ritual("kidhi", "Kidhi", "/water-stilllife.webp", ["warmth", "relax"], {
    it: ["Fagottini e olio caldo", "Il calore dei fagottini incontra la morbidezza dell’olio caldo, scivolando sulla pelle in movimenti lenti e avvolgenti. Un rituale profondamente sensoriale, in cui calore, profumi e manualità si fondono per accompagnare il corpo verso una piacevole sensazione di rilassamento."],
    en: ["Compresses and warm oil", "The warmth of compresses meets the softness of warm oil, gliding over the skin in slow, enveloping movements. A deeply sensory ritual in which warmth, scents and massage techniques come together to guide the body towards a pleasant feeling of relaxation."],
    es: ["Bolsitas y aceite caliente", "El calor de las bolsitas se une a la suavidad del aceite caliente, deslizándose sobre la piel con movimientos lentos y envolventes. Un ritual profundamente sensorial en el que calor, aromas y técnicas de masaje se funden para acompañar el cuerpo hacia una agradable sensación de relajación."],
    fr: ["Pochons et huile chaude", "La chaleur des pochons rencontre la douceur de l’huile chaude, glissant sur la peau en mouvements lents et enveloppants. Un rituel profondément sensoriel où chaleur, parfums et gestes de massage se fondent pour accompagner le corps vers une agréable sensation de relaxation."],
    de: ["Stempel und warmes Öl", "Die Wärme der Stempel trifft auf die Geschmeidigkeit warmen Öls und gleitet mit langsamen, umhüllenden Bewegungen über die Haut. Ein tief sinnliches Ritual, in dem Wärme, Düfte und Massagegriffe den Körper zu einem angenehmen Gefühl der Entspannung begleiten."],
  }),
  ritual("othadam", "Othadam", "/hero-ritual.webp", ["warmth", "lightness"], {
    it: ["Vitalità e leggerezza", "Un rituale intenso e avvolgente eseguito senza olio, attraverso fagottini caldi che incontrano il corpo con pressioni e movimenti ritmici. Il calore e il contatto donano una sensazione di vitalità e leggerezza, per un momento energizzante e rigenerante."],
    en: ["Vitality and lightness", "An intense, enveloping ritual performed without oil, using warm compresses applied to the body with pressure and rhythmic movements. Warmth and touch offer a feeling of vitality and lightness for an energising, restorative moment."],
    es: ["Vitalidad y ligereza", "Un ritual intenso y envolvente realizado sin aceite, con bolsitas calientes que se aplican al cuerpo mediante presiones y movimientos rítmicos. El calor y el contacto aportan una sensación de vitalidad y ligereza para un momento energizante y reparador."],
    fr: ["Vitalité et légèreté", "Un rituel intense et enveloppant réalisé sans huile, avec des pochons chauds appliqués sur le corps par pressions et mouvements rythmiques. La chaleur et le contact apportent une sensation de vitalité et de légèreté, pour un moment énergisant et ressourçant."],
    de: ["Vitalität und Leichtigkeit", "Ein intensives, umhüllendes Ritual ohne Öl, bei dem warme Stempel mit Druck und rhythmischen Bewegungen auf den Körper aufgesetzt werden. Wärme und Berührung schenken ein Gefühl von Vitalität und Leichtigkeit für einen belebenden, erholsamen Moment."],
  }),
  ritual("kadhivasti", "Kadhivasti", "/hero-ritual.webp", ["warmth", "relax"], {
    it: ["Calore e comfort per la zona lombare", "Un’esperienza calda e rilassante dedicata alla zona lombare. L’olio caldo viene lasciato fluire lentamente e raccolto in un delicato contenitore naturale, regalando un’intensa sensazione di calore e comfort."],
    en: ["Warmth and comfort for the lower back", "A warm, relaxing experience devoted to the lower back. Warm oil is allowed to flow slowly and is held in a delicate natural enclosure, offering an intense feeling of warmth and comfort."],
    es: ["Calor y confort para la zona lumbar", "Una experiencia cálida y relajante dedicada a la zona lumbar. El aceite caliente fluye lentamente y se recoge en un delicado recipiente natural, aportando una intensa sensación de calor y confort."],
    fr: ["Chaleur et confort pour la région lombaire", "Une expérience chaude et relaxante dédiée à la région lombaire. L’huile chaude s’écoule lentement et est recueillie dans un délicat réceptacle naturel, offrant une intense sensation de chaleur et de confort."],
    de: ["Wärme und Geborgenheit für den unteren Rücken", "Ein warmes, entspannendes Erlebnis für den unteren Rücken. Warmes Öl fließt langsam und wird in einer sanften natürlichen Einfassung aufgefangen, die ein intensives Gefühl von Wärme und Geborgenheit schenkt."],
  }),
  ritual("urovasti", "Urovasti", "/hero-ritual.webp", ["relax", "warmth", "harmony"], {
    it: ["Raccoglimento e apertura", "Un rituale avvolgente dedicato alla zona del cuore e del torace. Un morbido calore viene custodito in un piccolo spazio naturale, creando un momento di profondo raccoglimento e benessere. Il calore degli oli e la lentezza del trattamento invitano a respirare, rallentare e ritrovare una piacevole sensazione di equilibrio e apertura."],
    en: ["Reflection and openness", "An enveloping ritual devoted to the heart and chest area. Gentle warmth is held in a small natural enclosure, creating a moment of deep reflection and wellbeing. The warmth of the oils and the unhurried treatment invite you to breathe, slow down and rediscover a pleasant feeling of balance and openness."],
    es: ["Recogimiento y apertura", "Un ritual envolvente dedicado a la zona del corazón y del tórax. Un calor suave se conserva en un pequeño espacio natural, creando un momento de profundo recogimiento y bienestar. El calor de los aceites y la lentitud del tratamiento invitan a respirar, bajar el ritmo y recuperar una agradable sensación de equilibrio y apertura."],
    fr: ["Recueillement et ouverture", "Un rituel enveloppant dédié à la région du cœur et du thorax. Une douce chaleur est conservée dans un petit espace naturel, créant un moment de profond recueillement et de bien-être. La chaleur des huiles et la lenteur du soin invitent à respirer, à ralentir et à retrouver une agréable sensation d’équilibre et d’ouverture."],
    de: ["Besinnung und Offenheit", "Ein umhüllendes Ritual für die Herz- und Brustregion. Sanfte Wärme wird in einer kleinen natürlichen Einfassung bewahrt und schafft einen Moment tiefer Besinnung und des Wohlbefindens. Die Wärme der Öle und die Ruhe der Behandlung laden zum Atmen und Entschleunigen ein und schenken ein angenehmes Gefühl von Balance und Offenheit."],
  }),
  ritual("sound-bath", "Sound Bath", "/water-stilllife.webp", ["relax", "harmony"], {
    it: ["Onde sonore e armonia", "Lasciati cullare da onde sonore profonde e vibrazioni armoniche in un rituale sensoriale che avvolge il corpo. Un invito a lasciare andare le tensioni e liberare la mente, per un’intensa sensazione di pace e profondo relax."],
    en: ["Sound waves and harmony", "Let deep sound waves and harmonious vibrations soothe you in a sensory ritual that envelops the body. An invitation to release tension and clear the mind for an intense feeling of peace and deep relaxation."],
    es: ["Ondas sonoras y armonía", "Déjate mecer por ondas sonoras profundas y vibraciones armoniosas en un ritual sensorial que envuelve el cuerpo. Una invitación a soltar las tensiones y liberar la mente para una intensa sensación de paz y relajación profunda."],
    fr: ["Ondes sonores et harmonie", "Laissez-vous bercer par des ondes sonores profondes et des vibrations harmonieuses dans un rituel sensoriel qui enveloppe le corps. Une invitation à relâcher les tensions et à libérer l’esprit pour une intense sensation de paix et de relaxation profonde."],
    de: ["Klangwellen und Harmonie", "Lass dich von tiefen Klangwellen und harmonischen Schwingungen in einem sinnlichen Ritual tragen, das den Körper umhüllt. Eine Einladung, Spannungen loszulassen und den Geist für ein intensives Gefühl von Frieden und tiefer Entspannung zu befreien."],
  }),
  ritual("marma-ritual", "Marma Ritual", "/face-treatment.webp", ["harmony"], {
    it: ["Il tocco dell’energia", "Il rituale si concentra sui punti Marma, considerati nella tradizione ayurvedica luoghi di incontro tra corpo, mente ed energia vitale. Un’esperienza di ascolto attraverso il tocco, per ritrovare presenza e una piacevole sensazione di armonia."],
    en: ["The touch of energy", "The ritual focuses on Marma points, regarded in Ayurvedic tradition as meeting places of body, mind and vital energy. An experience of listening through touch, to rediscover presence and a pleasant feeling of harmony."],
    es: ["El toque de la energía", "El ritual se centra en los puntos Marma, considerados en la tradición ayurvédica lugares de encuentro entre cuerpo, mente y energía vital. Una experiencia de escucha a través del tacto para recuperar presencia y una agradable sensación de armonía."],
    fr: ["Le toucher de l’énergie", "Le rituel se concentre sur les points Marma, considérés dans la tradition ayurvédique comme des lieux de rencontre entre corps, esprit et énergie vitale. Une expérience d’écoute par le toucher pour retrouver présence et une agréable sensation d’harmonie."],
    de: ["Die Berührung der Energie", "Das Ritual konzentriert sich auf die Marma-Punkte, die in der ayurvedischen Tradition als Begegnungsorte von Körper, Geist und Lebensenergie gelten. Ein Erlebnis des Zuhörens durch Berührung, um Präsenz und ein angenehmes Gefühl von Harmonie wiederzufinden."],
  }),
  ritual("chakra-balancing", "Chakra Balancing", "/water-stilllife.webp", ["harmony"], {
    it: ["L’armonia dell’energia", "Un rituale ispirato alla ricerca dell’equilibrio interiore. Accompagna in un viaggio simbolico attraverso i sette chakra, i centri energetici descritti nella tradizione yogica, per dedicarsi uno spazio di ascolto e raccoglimento."],
    en: ["The harmony of energy", "A ritual inspired by the search for inner balance. It guides you on a symbolic journey through the seven chakras, the energy centres described in yogic tradition, offering a space for listening and reflection."],
    es: ["La armonía de la energía", "Un ritual inspirado en la búsqueda del equilibrio interior. Acompaña en un viaje simbólico por los siete chakras, los centros energéticos descritos en la tradición yóguica, para dedicarte un espacio de escucha y recogimiento."],
    fr: ["L’harmonie de l’énergie", "Un rituel inspiré de la recherche de l’équilibre intérieur. Il accompagne un voyage symbolique à travers les sept chakras, les centres énergétiques décrits dans la tradition yogique, pour s’offrir un espace d’écoute et de recueillement."],
    de: ["Die Harmonie der Energie", "Ein Ritual, inspiriert von der Suche nach innerem Gleichgewicht. Es begleitet dich auf einer symbolischen Reise durch die sieben Chakren, die in der yogischen Tradition beschriebenen Energiezentren, und bietet Raum für Zuhören und Besinnung."],
  }),
];

export const filterAyurvedaRituals = (filter: AyurvedaFilter) => filter === "all" ? ayurvedaRituals : ayurvedaRituals.filter((ritual) => ritual.categories.includes(filter));
