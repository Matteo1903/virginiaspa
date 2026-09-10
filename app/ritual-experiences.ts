import type { Language } from "./i18n";
import { checkoutCatalog } from "../lib/catalog";

export type RitualBlock = { title?: string; text: string };
export type RitualLocale = { title: string; intro: string; meta?: string[]; blocks: RitualBlock[]; closing: string };
export type RitualExperience = { slug: string; productId: string; price: number; duration: number; image: string; locales: Record<Language, RitualLocale> };

// Definitive copy from RITUALI.pdf; punctuation, accents and obvious typos normalized.
// Prices, durations and localized names share the same source as checkout.
type RitualCopy = { intro: string; blocks: RitualBlock[] };
function ritual(slug: string, productId: string, image: string, copy: Record<Language, RitualCopy>): RitualExperience {
  const product = checkoutCatalog[productId];
  const locales = Object.fromEntries(Object.entries(copy).map(([language, value]) => [
    language, { ...value, title: product.titles?.[language as Language] || product.title, closing: "" },
  ])) as Record<Language, RitualLocale>;
  return { slug, productId, image, price: product.unitAmount / 100, duration: Number.parseInt(product.duration, 10), locales };
}

export const ritualExperiences: RitualExperience[] = [
  ritual("terra", "rituale-terra", "/water-stilllife.webp", {
  "it": {
    "intro": "Un viaggio lento e profondo ispirato alla forza primordiale della Terra.\n\nUn rituale che invita a rallentare, lasciare andare le tensioni e ritrovare il proprio centro attraverso profumi, calore, argille e gesti antichi.",
    "blocks": [
      {
        "title": "Bagno dei Passi",
        "text": "Un pediluvio caldo e aromatico in cui cannella, vetiver e zenzero avvolgono i sensi.\n\nIl calore dell’acqua accoglie i piedi e prepara il corpo al rituale, mentre le note speziate e terrose accompagnano verso un profondo stato di rilassamento."
      },
      {
        "title": "Hot Stone Massage",
        "text": "Pietre calde scivolano lentamente sulla pelle. Il massaggio diventa un dialogo tra il calore delle pietre e il corpo, aiutando a sciogliere le tensioni.\n\nIl fango su viso e schiena è accompagnato dal calore umido dello Swedana, che dilata i sensi e crea un’atmosfera quasi ancestrale, come essere immersi nel cuore della Terra."
      },
      {
        "title": "Degustazione Karkadè",
        "text": "Al termine il ritmo rallenta ancora con un’infusione dal colore rubino da sorseggiare in uno spazio di quiete."
      }
    ]
  },
  "en": {
    "intro": "A slow, deep journey inspired by the primordial strength of the Earth.\n\nA ritual that invites you to slow down, release tension and rediscover your centre through scents, warmth, clays and ancient gestures.",
    "blocks": [
      {
        "title": "Bath of the Steps",
        "text": "A warm, aromatic foot bath in which cinnamon, vetiver and ginger envelop the senses.\n\nThe warmth of the water welcomes the feet and prepares the body for the ritual, while spicy, earthy notes guide you towards a state of deep relaxation."
      },
      {
        "title": "Hot Stone Massage",
        "text": "Warm stones glide slowly over the skin. The massage becomes a dialogue between the warmth of the stones and the body, helping to release tension.\n\nMud on the face and back is accompanied by the moist warmth of Swedana, which opens the senses and creates an almost ancestral atmosphere, as if immersed in the heart of the Earth."
      },
      {
        "title": "Karkadè tasting",
        "text": "At the end, the pace slows further with a ruby-coloured infusion to sip in a space of stillness."
      }
    ]
  },
  "es": {
    "intro": "Un viaje lento y profundo inspirado en la fuerza primordial de la Tierra.\n\nUn ritual que invita a bajar el ritmo, soltar las tensiones y recuperar el propio centro a través de aromas, calor, arcillas y gestos ancestrales.",
    "blocks": [
      {
        "title": "Baño de los Pasos",
        "text": "Un pediluvio cálido y aromático en el que la canela, el vetiver y el jengibre envuelven los sentidos.\n\nEl calor del agua acoge los pies y prepara el cuerpo para el ritual, mientras las notas especiadas y terrosas acompañan hacia un profundo estado de relajación."
      },
      {
        "title": "Masaje con piedras calientes",
        "text": "Piedras calientes se deslizan lentamente sobre la piel. El masaje se convierte en un diálogo entre el calor de las piedras y el cuerpo, ayudando a liberar las tensiones.\n\nEl barro sobre el rostro y la espalda se acompaña del calor húmedo del Swedana, que expande los sentidos y crea una atmósfera casi ancestral, como estar sumergido en el corazón de la Tierra."
      },
      {
        "title": "Degustación de karkadé",
        "text": "Al finalizar, el ritmo se ralentiza aún más con una infusión de color rubí para saborear en un espacio de quietud."
      }
    ]
  },
  "fr": {
    "intro": "Un voyage lent et profond inspiré par la force primordiale de la Terre.\n\nUn rituel qui invite à ralentir, à relâcher les tensions et à retrouver son centre à travers les parfums, la chaleur, les argiles et les gestes ancestraux.",
    "blocks": [
      {
        "title": "Bain des Pas",
        "text": "Un bain de pieds chaud et aromatique où la cannelle, le vétiver et le gingembre enveloppent les sens.\n\nLa chaleur de l’eau accueille les pieds et prépare le corps au rituel, tandis que les notes épicées et terreuses accompagnent vers un état de relaxation profonde."
      },
      {
        "title": "Massage aux pierres chaudes",
        "text": "Des pierres chaudes glissent lentement sur la peau. Le massage devient un dialogue entre la chaleur des pierres et le corps, aidant à dénouer les tensions.\n\nLa boue appliquée sur le visage et le dos s’accompagne de la chaleur humide du Swedana, qui éveille les sens et crée une atmosphère presque ancestrale, comme une immersion au cœur de la Terre."
      },
      {
        "title": "Dégustation de karkadé",
        "text": "À la fin, le rythme ralentit encore avec une infusion couleur rubis à siroter dans un espace de quiétude."
      }
    ]
  },
  "de": {
    "intro": "Eine langsame, tiefgehende Reise, inspiriert von der ursprünglichen Kraft der Erde.\n\nEin Ritual, das dazu einlädt, langsamer zu werden, Spannungen loszulassen und durch Düfte, Wärme, Tonerden und überlieferte Berührungen die eigene Mitte wiederzufinden.",
    "blocks": [
      {
        "title": "Bad der Schritte",
        "text": "Ein warmes, aromatisches Fußbad, bei dem Zimt, Vetiver und Ingwer die Sinne umhüllen.\n\nDie Wärme des Wassers empfängt die Füße und bereitet den Körper auf das Ritual vor, während würzige und erdige Noten in einen Zustand tiefer Entspannung führen."
      },
      {
        "title": "Hot-Stone-Massage",
        "text": "Warme Steine gleiten langsam über die Haut. Die Massage wird zu einem Dialog zwischen der Wärme der Steine und dem Körper und hilft, Spannungen zu lösen.\n\nDer Schlamm auf Gesicht und Rücken wird von der feuchten Wärme des Swedana begleitet, die die Sinne öffnet und eine beinahe urzeitliche Atmosphäre schafft, als würde man ins Herz der Erde eintauchen."
      },
      {
        "title": "Karkadè-Verkostung",
        "text": "Zum Abschluss verlangsamt sich der Rhythmus weiter bei einem rubinroten Aufguss, der in einem Raum der Stille in kleinen Schlucken genossen wird."
      }
    ]
  }
}),
  ritual("luna", "rituale-luna", "/hero-ritual.webp", {
  "it": {
    "intro": "Un rituale sensoriale e avvolgente per concedersi una pausa dalla frenesia quotidiana e ritrovare un profondo senso di calma e armonia.\n\nManualità, profumi e piccoli gesti di cura accompagnano il corpo verso una piacevole sensazione di abbandono.",
    "blocks": [
      {
        "title": "Rito del Primo Passo",
        "text": "Pediluvio Flowerfall, fiori di lavanda."
      },
      {
        "title": "Carezza Onirica",
        "text": "Un delicato massaggio della testa con movimenti lenti e avvolgenti accompagna la mente verso uno stato di profondo relax."
      },
      {
        "title": "Abbraccio di Luna",
        "text": "Manualità lente e armoniose, sinergie rilassanti avvolgono il corpo creando un’esperienza piacevole e profondamente sensoriale.\n\nAmetista e pietra di luna accompagnano l’esperienza come elementi simbolici legati alla quiete, alla luce della notte e all’introspezione."
      },
      {
        "title": "Momento del Sé",
        "text": "Il rituale si conclude con una tisana Relax servita in un’atmosfera raccolta e tranquilla."
      }
    ]
  },
  "en": {
    "intro": "An enveloping sensory ritual to take a break from the rush of everyday life and rediscover a deep sense of calm and harmony.\n\nMassage techniques, scents and small gestures of care guide the body towards a pleasant feeling of letting go.",
    "blocks": [
      {
        "title": "Rite of the First Step",
        "text": "Flowerfall foot bath, lavender flowers."
      },
      {
        "title": "Dreamlike Caress",
        "text": "A gentle head massage with slow, enveloping movements guides the mind towards a state of deep relaxation."
      },
      {
        "title": "Moon Embrace",
        "text": "Slow, harmonious massage techniques and relaxing blends envelop the body, creating a pleasant, deeply sensory experience.\n\nAmethyst and moonstone accompany the experience as symbolic elements associated with stillness, the light of the night and introspection."
      },
      {
        "title": "A Moment for Yourself",
        "text": "The ritual concludes with a Relax herbal tea served in an intimate, peaceful atmosphere."
      }
    ]
  },
  "es": {
    "intro": "Un ritual sensorial y envolvente para concederse una pausa del ajetreo cotidiano y recuperar una profunda sensación de calma y armonía.\n\nTécnicas de masaje, aromas y pequeños gestos de cuidado acompañan el cuerpo hacia una agradable sensación de abandono.",
    "blocks": [
      {
        "title": "Rito del Primer Paso",
        "text": "Pediluvio Flowerfall, flores de lavanda."
      },
      {
        "title": "Caricia Onírica",
        "text": "Un delicado masaje de cabeza con movimientos lentos y envolventes acompaña la mente hacia un estado de profunda relajación."
      },
      {
        "title": "Abrazo de Luna",
        "text": "Técnicas de masaje lentas y armoniosas y mezclas relajantes envuelven el cuerpo, creando una experiencia agradable y profundamente sensorial.\n\nLa amatista y la piedra de luna acompañan la experiencia como elementos simbólicos vinculados a la quietud, la luz de la noche y la introspección."
      },
      {
        "title": "Un Momento para Ti",
        "text": "El ritual concluye con una infusión Relax servida en una atmósfera íntima y tranquila."
      }
    ]
  },
  "fr": {
    "intro": "Un rituel sensoriel et enveloppant pour s’accorder une pause loin de la frénésie quotidienne et retrouver un profond sentiment de calme et d’harmonie.\n\nGestes de massage, parfums et petites attentions accompagnent le corps vers une agréable sensation d’abandon.",
    "blocks": [
      {
        "title": "Rite du Premier Pas",
        "text": "Bain de pieds Flowerfall, fleurs de lavande."
      },
      {
        "title": "Caresse Onirique",
        "text": "Un délicat massage de la tête aux mouvements lents et enveloppants accompagne l’esprit vers un état de relaxation profonde."
      },
      {
        "title": "Étreinte de Lune",
        "text": "Des gestes lents et harmonieux et des synergies relaxantes enveloppent le corps, créant une expérience agréable et profondément sensorielle.\n\nL’améthyste et la pierre de lune accompagnent l’expérience comme éléments symboliques liés à la quiétude, à la lumière de la nuit et à l’introspection."
      },
      {
        "title": "Un Moment pour Soi",
        "text": "Le rituel se termine par une tisane Relax servie dans une atmosphère intime et paisible."
      }
    ]
  },
  "de": {
    "intro": "Ein sinnliches, umhüllendes Ritual, um sich eine Pause von der Hektik des Alltags zu gönnen und ein tiefes Gefühl von Ruhe und Harmonie wiederzufinden.\n\nMassagegriffe, Düfte und kleine Gesten der Fürsorge begleiten den Körper zu einem angenehmen Gefühl des Loslassens.",
    "blocks": [
      {
        "title": "Ritus des Ersten Schrittes",
        "text": "Flowerfall-Fußbad, Lavendelblüten."
      },
      {
        "title": "Traumhafte Berührung",
        "text": "Eine sanfte Kopfmassage mit langsamen, umhüllenden Bewegungen führt den Geist in einen Zustand tiefer Entspannung."
      },
      {
        "title": "Umarmung des Mondes",
        "text": "Langsame, harmonische Massagegriffe und entspannende Mischungen umhüllen den Körper und schaffen ein angenehmes, tief sinnliches Erlebnis.\n\nAmethyst und Mondstein begleiten das Erlebnis als symbolische Elemente der Stille, des nächtlichen Lichts und der Innenschau."
      },
      {
        "title": "Ein Moment für Dich",
        "text": "Das Ritual endet mit einem Relax-Kräutertee, serviert in einer geborgenen, ruhigen Atmosphäre."
      }
    ]
  }
}),
  ritual("rosa", "rituale-rosa", "/face-treatment.webp", {
  "it": {
    "intro": "Un momento di benvenuto per rilassare e preparare il corpo al rituale.",
    "blocks": [
      {
        "title": "Pediluvio ai petali di rosa",
        "text": "Un momento di benvenuto per rilassare e preparare il corpo al rituale."
      },
      {
        "title": "Trattamento viso alle rose più pregiate",
        "text": "Detersione, trattamento nutriente ed idratante con preziosi attivi della rosa."
      },
      {
        "title": "Massaggio viso con roll al quarzo rosa",
        "text": "Delicati movimenti distensivi e drenanti per regalare luminosità e una piacevole sensazione di freschezza."
      },
      {
        "title": "Styling finale",
        "text": ""
      }
    ]
  },
  "en": {
    "intro": "A welcoming moment to relax and prepare the body for the ritual.",
    "blocks": [
      {
        "title": "Rose-petal foot bath",
        "text": "A welcoming moment to relax and prepare the body for the ritual."
      },
      {
        "title": "Facial treatment with the finest roses",
        "text": "Cleansing, nourishing and hydrating treatment with precious rose-derived active ingredients."
      },
      {
        "title": "Rose-quartz roller facial massage",
        "text": "Gentle smoothing and draining movements to bring radiance and a pleasant feeling of freshness."
      },
      {
        "title": "Final styling",
        "text": ""
      }
    ]
  },
  "es": {
    "intro": "Un momento de bienvenida para relajar y preparar el cuerpo para el ritual.",
    "blocks": [
      {
        "title": "Pediluvio con pétalos de rosa",
        "text": "Un momento de bienvenida para relajar y preparar el cuerpo para el ritual."
      },
      {
        "title": "Tratamiento facial con las rosas más preciadas",
        "text": "Limpieza, tratamiento nutritivo e hidratante con valiosos activos de la rosa."
      },
      {
        "title": "Masaje facial con rodillo de cuarzo rosa",
        "text": "Delicados movimientos relajantes y drenantes para aportar luminosidad y una agradable sensación de frescura."
      },
      {
        "title": "Peinado final",
        "text": ""
      }
    ]
  },
  "fr": {
    "intro": "Un moment de bienvenue pour détendre et préparer le corps au rituel.",
    "blocks": [
      {
        "title": "Bain de pieds aux pétales de rose",
        "text": "Un moment de bienvenue pour détendre et préparer le corps au rituel."
      },
      {
        "title": "Soin du visage aux roses les plus précieuses",
        "text": "Nettoyage, soin nourrissant et hydratant aux précieux actifs de la rose."
      },
      {
        "title": "Massage du visage au rouleau de quartz rose",
        "text": "Des mouvements délicats, défroissants et drainants pour apporter de l’éclat et une agréable sensation de fraîcheur."
      },
      {
        "title": "Coiffage final",
        "text": ""
      }
    ]
  },
  "de": {
    "intro": "Ein Moment des Willkommens, um zu entspannen und den Körper auf das Ritual vorzubereiten.",
    "blocks": [
      {
        "title": "Fußbad mit Rosenblütenblättern",
        "text": "Ein Moment des Willkommens, um zu entspannen und den Körper auf das Ritual vorzubereiten."
      },
      {
        "title": "Gesichtsbehandlung mit den edelsten Rosen",
        "text": "Reinigung sowie nährende und feuchtigkeitsspendende Pflege mit kostbaren Rosenwirkstoffen."
      },
      {
        "title": "Gesichtsmassage mit Rosenquarzroller",
        "text": "Sanfte, entspannende und drainierende Bewegungen für Ausstrahlung und ein angenehmes Frischegefühl."
      },
      {
        "title": "Abschließendes Styling",
        "text": ""
      }
    ]
  }
}),
  ritual("surya", "rituale-surya", "/hero-ritual.webp", {
  "it": {
    "intro": "Un rituale energizzante ispirato al calore del sole, ai profumi tropicali e alla leggerezza delle note fresche.",
    "blocks": [
      {
        "title": "Bagno dei Passi Lime e Menta",
        "text": "Un’immersione fresca e aromatica per preparare corpo e sensi al rituale."
      },
      {
        "title": "Scrub al Cocco",
        "text": "Un’esfoliazione delicata che lascia la pelle morbida, levigata e piacevolmente profumata."
      },
      {
        "title": "Massaggio Hawaiano",
        "text": "Movimenti fluidi e avvolgenti ispirati alla tradizione hawaiana, per un profondo senso di rilassamento e armonia."
      },
      {
        "title": "Messaggio del Sole",
        "text": "Un invito alla meditazione, alla cura del sé."
      },
      {
        "title": "Estratto Energizzante",
        "text": "L’energia del sole, il piacere di ritrovare nuova vitalità."
      }
    ]
  },
  "en": {
    "intro": "An energising ritual inspired by the warmth of the sun, tropical scents and the lightness of fresh notes.",
    "blocks": [
      {
        "title": "Lime and Mint Bath of the Steps",
        "text": "A fresh, aromatic immersion to prepare body and senses for the ritual."
      },
      {
        "title": "Coconut Scrub",
        "text": "A gentle exfoliation that leaves the skin soft, smooth and pleasantly scented."
      },
      {
        "title": "Hawaiian Massage",
        "text": "Flowing, enveloping movements inspired by Hawaiian tradition, for a deep sense of relaxation and harmony."
      },
      {
        "title": "Message of the Sun",
        "text": "An invitation to meditation and self-care."
      },
      {
        "title": "Energising Extract",
        "text": "The energy of the sun, the pleasure of rediscovering new vitality."
      }
    ]
  },
  "es": {
    "intro": "Un ritual energizante inspirado en el calor del sol, los aromas tropicales y la ligereza de las notas frescas.",
    "blocks": [
      {
        "title": "Baño de los Pasos de Lima y Menta",
        "text": "Una inmersión fresca y aromática para preparar el cuerpo y los sentidos para el ritual."
      },
      {
        "title": "Exfoliante de Coco",
        "text": "Una exfoliación delicada que deja la piel suave, lisa y agradablemente perfumada."
      },
      {
        "title": "Masaje Hawaiano",
        "text": "Movimientos fluidos y envolventes inspirados en la tradición hawaiana, para una profunda sensación de relajación y armonía."
      },
      {
        "title": "Mensaje del Sol",
        "text": "Una invitación a la meditación y al cuidado de uno mismo."
      },
      {
        "title": "Extracto Energizante",
        "text": "La energía del sol, el placer de recuperar una nueva vitalidad."
      }
    ]
  },
  "fr": {
    "intro": "Un rituel énergisant inspiré par la chaleur du soleil, les parfums tropicaux et la légèreté des notes fraîches.",
    "blocks": [
      {
        "title": "Bain des Pas au Citron Vert et à la Menthe",
        "text": "Une immersion fraîche et aromatique pour préparer le corps et les sens au rituel."
      },
      {
        "title": "Gommage à la Noix de Coco",
        "text": "Une exfoliation délicate qui laisse la peau douce, lisse et agréablement parfumée."
      },
      {
        "title": "Massage Hawaïen",
        "text": "Des mouvements fluides et enveloppants inspirés de la tradition hawaïenne, pour une profonde sensation de détente et d’harmonie."
      },
      {
        "title": "Message du Soleil",
        "text": "Une invitation à la méditation et au soin de soi."
      },
      {
        "title": "Extrait Énergisant",
        "text": "L’énergie du soleil, le plaisir de retrouver une nouvelle vitalité."
      }
    ]
  },
  "de": {
    "intro": "Ein belebendes Ritual, inspiriert von der Wärme der Sonne, tropischen Düften und der Leichtigkeit frischer Noten.",
    "blocks": [
      {
        "title": "Bad der Schritte mit Limette und Minze",
        "text": "Ein frisches, aromatisches Eintauchen, um Körper und Sinne auf das Ritual vorzubereiten."
      },
      {
        "title": "Kokospeeling",
        "text": "Ein sanftes Peeling, das die Haut weich, glatt und angenehm duftend hinterlässt."
      },
      {
        "title": "Hawaiianische Massage",
        "text": "Fließende, umhüllende Bewegungen nach hawaiianischer Tradition für ein tiefes Gefühl von Entspannung und Harmonie."
      },
      {
        "title": "Botschaft der Sonne",
        "text": "Eine Einladung zur Meditation und zur Selbstfürsorge."
      },
      {
        "title": "Belebender Extrakt",
        "text": "Die Energie der Sonne und die Freude, neue Vitalität zu finden."
      }
    ]
  }
}),
  ritual("luce-ambra", "rituale-luce-ambra", "/water-stilllife.webp", {
  "it": {
    "intro": "Un’immersione calda, avvolgente e aromatica alle note di zagara per lasciare fuori la quotidianità e concedersi all’esperienza.",
    "blocks": [
      {
        "title": "Bagno dei Passi",
        "text": "Un’immersione calda, avvolgente e aromatica alle note di zagara per lasciare fuori la quotidianità e concedersi all’esperienza."
      },
      {
        "title": "Passione",
        "text": "Massaggio testa e corpo con candela nutriente.\n\nIl calore della candela si fonde con la pelle in un massaggio lento e avvolgente, lasciandola morbida, nutrita e delicatamente profumata. Ogni carezza diventa un gesto d’amore per il proprio benessere, mentre la fiamma danza delicatamente e rilascia un caldo balsamo avvolgente."
      },
      {
        "title": "Purificazione e Nutrimento",
        "text": "Un momento dedicato alla detersione delicata e al nutrimento profondo."
      },
      {
        "title": "Momento del Tè",
        "text": ""
      },
      {
        "title": "Styling finale",
        "text": ""
      }
    ]
  },
  "en": {
    "intro": "A warm, enveloping and aromatic immersion with notes of orange blossom to leave everyday life behind and surrender to the experience.",
    "blocks": [
      {
        "title": "Bath of the Steps",
        "text": "A warm, enveloping and aromatic immersion with notes of orange blossom to leave everyday life behind and surrender to the experience."
      },
      {
        "title": "Passion",
        "text": "Head and body massage with a nourishing candle.\n\nThe warmth of the candle melts into the skin through a slow, enveloping massage, leaving it soft, nourished and delicately scented. Every caress becomes a gesture of love for your own well-being, while the flame dances gently and releases a warm, enveloping balm."
      },
      {
        "title": "Purification and Nourishment",
        "text": "A moment devoted to gentle cleansing and deep nourishment."
      },
      {
        "title": "Tea Moment",
        "text": ""
      },
      {
        "title": "Final styling",
        "text": ""
      }
    ]
  },
  "es": {
    "intro": "Una inmersión cálida, envolvente y aromática con notas de azahar para dejar atrás la vida cotidiana y entregarse a la experiencia.",
    "blocks": [
      {
        "title": "Baño de los Pasos",
        "text": "Una inmersión cálida, envolvente y aromática con notas de azahar para dejar atrás la vida cotidiana y entregarse a la experiencia."
      },
      {
        "title": "Pasión",
        "text": "Masaje de cabeza y cuerpo con una vela nutritiva.\n\nEl calor de la vela se funde con la piel en un masaje lento y envolvente, dejándola suave, nutrida y delicadamente perfumada. Cada caricia se convierte en un gesto de amor por el propio bienestar, mientras la llama danza suavemente y libera un bálsamo cálido y envolvente."
      },
      {
        "title": "Purificación y Nutrición",
        "text": "Un momento dedicado a una limpieza delicada y a una nutrición profunda."
      },
      {
        "title": "Momento del Té",
        "text": ""
      },
      {
        "title": "Peinado final",
        "text": ""
      }
    ]
  },
  "fr": {
    "intro": "Une immersion chaude, enveloppante et aromatique aux notes de fleur d’oranger pour laisser le quotidien derrière soi et s’abandonner à l’expérience.",
    "blocks": [
      {
        "title": "Bain des Pas",
        "text": "Une immersion chaude, enveloppante et aromatique aux notes de fleur d’oranger pour laisser le quotidien derrière soi et s’abandonner à l’expérience."
      },
      {
        "title": "Passion",
        "text": "Massage de la tête et du corps à la bougie nourrissante.\n\nLa chaleur de la bougie se fond sur la peau dans un massage lent et enveloppant, la laissant douce, nourrie et délicatement parfumée. Chaque caresse devient un geste d’amour pour son propre bien-être, tandis que la flamme danse délicatement et libère un baume chaud et enveloppant."
      },
      {
        "title": "Purification et Nutrition",
        "text": "Un moment consacré à un nettoyage délicat et à une nutrition profonde."
      },
      {
        "title": "Moment du Thé",
        "text": ""
      },
      {
        "title": "Coiffage final",
        "text": ""
      }
    ]
  },
  "de": {
    "intro": "Ein warmes, umhüllendes und aromatisches Eintauchen mit Orangenblütennoten, um den Alltag hinter sich zu lassen und sich dem Erlebnis hinzugeben.",
    "blocks": [
      {
        "title": "Bad der Schritte",
        "text": "Ein warmes, umhüllendes und aromatisches Eintauchen mit Orangenblütennoten, um den Alltag hinter sich zu lassen und sich dem Erlebnis hinzugeben."
      },
      {
        "title": "Leidenschaft",
        "text": "Kopf- und Körpermassage mit einer nährenden Kerze.\n\nDie Wärme der Kerze verschmilzt bei einer langsamen, umhüllenden Massage mit der Haut und hinterlässt sie weich, gepflegt und zart duftend. Jede Berührung wird zu einer liebevollen Geste für das eigene Wohlbefinden, während die Flamme sanft tanzt und einen warmen, umhüllenden Balsam freisetzt."
      },
      {
        "title": "Reinigung und nährende Pflege",
        "text": "Ein Moment für sanfte Reinigung und tief nährende Pflege."
      },
      {
        "title": "Teemoment",
        "text": ""
      },
      {
        "title": "Abschließendes Styling",
        "text": ""
      }
    ]
  }
}),
];

export const getRitualExperience = (slug: string) => ritualExperiences.find((experience) => experience.slug === slug);
