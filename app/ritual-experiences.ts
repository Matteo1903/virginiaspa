import type { Language } from "./i18n";
import { checkoutCatalog } from "../lib/catalog";

export type RitualBlock = { title?: string; text: string };
export type RitualLocale = { title: string; intro: string; meta?: string[]; blocks: RitualBlock[]; closing: string };
export type RitualExperience = { slug: string; productId: string; price: number; duration: number; image: string; locales: Record<Language, RitualLocale> };

// Copy adapted from RITUALI.pdf and the supplied experience photographs.
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
  ritual("ayurveda", "percorso-ayurveda", "/hero-ritual.webp", {
    it: {
      intro: "Il Percorso Ayurveda è un’esperienza esclusiva che racchiude più rituali ayurvedici in un unico viaggio di benessere.\n\nCalore, oli, erbe e vibrazioni sonore accompagnano corpo, mente e sensi verso una profonda sensazione di quiete e abbandono.",
      blocks: [
        { title: "Nada Ananda", text: "Lasciati cullare da onde sonore profonde e vibrazioni armoniche. Un rituale sensoriale che avvolge il corpo, invita a lasciare andare le tensioni e libera la mente per un’intensa sensazione di pace e profondo relax." },
        { title: "Kadhi Vasti", text: "Un’esperienza calda e rilassante dedicata alla zona lombare. L’olio caldo fluisce lentamente e viene raccolto in un delicato contenitore naturale, regalando calore e comfort. Un invito a lasciare andare le tensioni della giornata e ad abbandonarsi a un momento di quiete." },
        { title: "Urovasti", text: "Un rituale avvolgente dedicato alla zona del cuore e del torace. Un morbido calore viene custodito in un piccolo spazio naturale, creando un momento di raccoglimento e benessere. Il calore degli oli e la lentezza del trattamento invitano a respirare, rallentare e ritrovare equilibrio e apertura." },
        { title: "Padma", text: "Un massaggio di viso e testa con i Kansa Wand, manipoli in lega di rame e ottone, uniti al ghee. Gesti delicati accompagnano la mente verso l’armonia e il viso verso una piacevole sensazione di distensione, valorizzandone i contorni." },
        { title: "Pindasweda", text: "Un antico rituale di benessere che avvolge il corpo attraverso il calore, il profumo delle erbe e il gesto lento e armonioso del massaggio." },
        { title: "Kithzi", text: "Il calore dei fagottini incontra la morbidezza dell’olio caldo, scivolando sulla pelle con movimenti lenti e avvolgenti. Calore, profumi e manualità si fondono in un rituale profondamente sensoriale, accompagnando il corpo verso una piacevole sensazione di rilassamento." },
        { title: "Othadam", text: "Un rituale intenso e avvolgente eseguito senza olio, attraverso fagottini caldi che incontrano il corpo con pressioni e movimenti ritmici. Il calore e il contatto regalano una sensazione di vitalità e leggerezza, per un momento energizzante e rigenerante." },
      ],
    },
    en: {
      intro: "The Ayurveda Journey is an exclusive experience bringing several Ayurvedic rituals together in a single journey of wellbeing.\n\nWarmth, oils, herbs and sound vibrations guide body, mind and senses towards a deep feeling of stillness and surrender.",
      blocks: [
        { title: "Nada Ananda", text: "Let deep sound waves and harmonious vibrations soothe you. A sensory ritual that envelops the body, invites you to release tension and clears the mind for an intense feeling of peace and deep relaxation." },
        { title: "Kadhi Vasti", text: "A warm, relaxing experience devoted to the lower back. Warm oil flows slowly and is held in a delicate natural enclosure, offering warmth and comfort. An invitation to let go of the day’s tension and surrender to a moment of stillness." },
        { title: "Urovasti", text: "An enveloping ritual devoted to the heart and chest area. Gentle warmth is held within a small natural enclosure, creating a moment of reflection and wellbeing. The warmth of the oils and the unhurried treatment invite you to breathe, slow down and rediscover balance and openness." },
        { title: "Padma", text: "A face and head massage with Kansa Wands, copper and brass alloy tools, used with ghee. Gentle movements guide the mind towards harmony and leave the face feeling relaxed, enhancing its contours." },
        { title: "Pindasweda", text: "An ancient wellbeing ritual that envelops the body through warmth, the scent of herbs and the slow, harmonious movements of massage." },
        { title: "Kithzi", text: "The warmth of herbal compresses meets the softness of warm oil, gliding over the skin with slow, enveloping movements. Warmth, scents and massage techniques come together in a deeply sensory ritual, guiding the body towards a pleasant feeling of relaxation." },
        { title: "Othadam", text: "An intense, enveloping ritual performed without oil, using warm compresses applied to the body with pressure and rhythmic movements. Warmth and touch offer a feeling of vitality and lightness for an energising, restorative moment." },
      ],
    },
    es: {
      intro: "El Recorrido Ayurveda es una experiencia exclusiva que reúne varios rituales ayurvédicos en un único viaje de bienestar.\n\nEl calor, los aceites, las hierbas y las vibraciones sonoras acompañan cuerpo, mente y sentidos hacia una profunda sensación de calma y abandono.",
      blocks: [
        { title: "Nada Ananda", text: "Déjate mecer por ondas sonoras profundas y vibraciones armoniosas. Un ritual sensorial que envuelve el cuerpo, invita a soltar las tensiones y libera la mente para una intensa sensación de paz y relajación profunda." },
        { title: "Kadhi Vasti", text: "Una experiencia cálida y relajante dedicada a la zona lumbar. El aceite caliente fluye lentamente y se recoge en un delicado recipiente natural, aportando calor y confort. Una invitación a soltar las tensiones del día y entregarse a un momento de calma." },
        { title: "Urovasti", text: "Un ritual envolvente dedicado a la zona del corazón y del tórax. Un calor suave se conserva en un pequeño espacio natural, creando un momento de recogimiento y bienestar. El calor de los aceites y la lentitud del tratamiento invitan a respirar, bajar el ritmo y recuperar equilibrio y apertura." },
        { title: "Padma", text: "Un masaje de rostro y cabeza con Kansa Wands, herramientas de aleación de cobre y latón, junto con ghee. Gestos delicados acompañan la mente hacia la armonía y dejan una agradable sensación de relajación en el rostro, realzando sus contornos." },
        { title: "Pindasweda", text: "Un antiguo ritual de bienestar que envuelve el cuerpo a través del calor, el aroma de las hierbas y los movimientos lentos y armoniosos del masaje." },
        { title: "Kithzi", text: "El calor de las bolsitas de hierbas se une a la suavidad del aceite caliente, deslizándose sobre la piel con movimientos lentos y envolventes. Calor, aromas y técnicas de masaje se funden en un ritual profundamente sensorial que acompaña el cuerpo hacia una agradable sensación de relajación." },
        { title: "Othadam", text: "Un ritual intenso y envolvente realizado sin aceite, con bolsitas calientes que se aplican al cuerpo mediante presiones y movimientos rítmicos. El calor y el contacto aportan una sensación de vitalidad y ligereza, para un momento energizante y reparador." },
      ],
    },
    fr: {
      intro: "Le Parcours Ayurveda est une expérience exclusive qui réunit plusieurs rituels ayurvédiques dans un seul voyage de bien-être.\n\nChaleur, huiles, plantes et vibrations sonores accompagnent le corps, l’esprit et les sens vers une profonde sensation de quiétude et d’abandon.",
      blocks: [
        { title: "Nada Ananda", text: "Laissez-vous bercer par des ondes sonores profondes et des vibrations harmonieuses. Un rituel sensoriel qui enveloppe le corps, invite à relâcher les tensions et libère l’esprit pour une intense sensation de paix et de relaxation profonde." },
        { title: "Kadhi Vasti", text: "Une expérience chaude et relaxante dédiée à la région lombaire. L’huile chaude s’écoule lentement et est recueillie dans un délicat réceptacle naturel, apportant chaleur et confort. Une invitation à laisser les tensions de la journée derrière soi et à s’abandonner à un moment de quiétude." },
        { title: "Urovasti", text: "Un rituel enveloppant dédié à la région du cœur et du thorax. Une douce chaleur est conservée dans un petit espace naturel, créant un moment de recueillement et de bien-être. La chaleur des huiles et la lenteur du soin invitent à respirer, à ralentir et à retrouver équilibre et ouverture." },
        { title: "Padma", text: "Un massage du visage et de la tête avec les Kansa Wands, des accessoires en alliage de cuivre et de laiton, associés au ghee. Des gestes délicats accompagnent l’esprit vers l’harmonie et apportent au visage une agréable sensation de détente, en mettant ses contours en valeur." },
        { title: "Pindasweda", text: "Un rituel ancestral de bien-être qui enveloppe le corps à travers la chaleur, le parfum des plantes et les gestes lents et harmonieux du massage." },
        { title: "Kithzi", text: "La chaleur des pochons rencontre la douceur de l’huile chaude, glissant sur la peau en mouvements lents et enveloppants. Chaleur, parfums et gestes de massage se fondent dans un rituel profondément sensoriel, accompagnant le corps vers une agréable sensation de relaxation." },
        { title: "Othadam", text: "Un rituel intense et enveloppant réalisé sans huile, à l’aide de pochons chauds appliqués sur le corps par pressions et mouvements rythmiques. La chaleur et le contact apportent une sensation de vitalité et de légèreté, pour un moment énergisant et ressourçant." },
      ],
    },
    de: {
      intro: "Das Ayurveda-Erlebnis ist ein exklusives Erlebnis, das mehrere ayurvedische Rituale zu einer einzigen Reise des Wohlbefindens verbindet.\n\nWärme, Öle, Kräuter und Klangschwingungen begleiten Körper, Geist und Sinne zu einem tiefen Gefühl von Ruhe und Loslassen.",
      blocks: [
        { title: "Nada Ananda", text: "Lass dich von tiefen Klangwellen und harmonischen Schwingungen tragen. Ein sinnliches Ritual, das den Körper umhüllt, zum Loslassen von Spannungen einlädt und den Geist für ein intensives Gefühl von Frieden und tiefer Entspannung befreit." },
        { title: "Kadhi Vasti", text: "Ein warmes, entspannendes Erlebnis für den unteren Rücken. Warmes Öl fließt langsam und wird in einer sanften natürlichen Einfassung aufgefangen, die Wärme und Geborgenheit schenkt. Eine Einladung, die Anspannung des Tages loszulassen und sich einem Moment der Ruhe hinzugeben." },
        { title: "Urovasti", text: "Ein umhüllendes Ritual für die Herz- und Brustregion. Sanfte Wärme wird in einer kleinen natürlichen Einfassung bewahrt und schafft einen Moment der Besinnung und des Wohlbefindens. Die Wärme der Öle und die Ruhe der Behandlung laden zum Atmen und Entschleunigen ein und schenken ein Gefühl von Balance und Offenheit." },
        { title: "Padma", text: "Eine Gesichts- und Kopfmassage mit Kansa Wands, Werkzeugen aus einer Kupfer-Messing-Legierung, in Verbindung mit Ghee. Sanfte Bewegungen begleiten den Geist zur Harmonie und schenken dem Gesicht ein angenehmes Gefühl der Entspannung, während seine Konturen zur Geltung kommen." },
        { title: "Pindasweda", text: "Ein überliefertes Wohlfühlritual, das den Körper durch Wärme, Kräuterdüfte und langsame, harmonische Massagebewegungen umhüllt." },
        { title: "Kithzi", text: "Die Wärme der Kräuterstempel trifft auf die Geschmeidigkeit warmen Öls und gleitet mit langsamen, umhüllenden Bewegungen über die Haut. Wärme, Düfte und Massagegriffe verbinden sich zu einem tief sinnlichen Ritual und begleiten den Körper zu einem angenehmen Gefühl der Entspannung." },
        { title: "Othadam", text: "Ein intensives, umhüllendes Ritual ohne Öl, bei dem warme Stempel mit Druck und rhythmischen Bewegungen auf den Körper aufgesetzt werden. Wärme und Berührung schenken ein Gefühl von Vitalität und Leichtigkeit für einen belebenden, erholsamen Moment." },
      ],
    },
  }),
  ritual("peel-longevity", "rituale-peel-longevity", "/face-treatment.webp", {
    it: {
      intro: "Un rituale viso che unisce Rose de Mer e Muse in un’esperienza dedicata alla luminosità e alla qualità della pelle.\n\nUn’ora di cura per ritrovare un incarnato più fresco, uniforme e una piacevole sensazione di compattezza.",
      blocks: [
        { title: "La sinergia Rose de Mer e Muse", text: "Peel Longevity nasce dall’incontro di due trattamenti iconici. Una sinergia pensata per accompagnare i naturali processi di rinnovamento della pelle e preservarne vitalità e luminosità." },
        { title: "Rinnovamento e luminosità", text: "Un trattamento dedicato ad affinare la grana della pelle e ad attenuare l’aspetto dei segni di stanchezza. Il viso ritrova un aspetto più luminoso, levigato e uniforme." },
        { title: "Elasticità e protezione", text: "La cura prosegue con un’attenzione alla compattezza, all’elasticità e alla barriera cutanea, per una pelle dall’aspetto più resistente e vitale." },
        { title: "Una cura che continua", text: "Indicato a partire dai 20–25 anni e per tutti i tipi di pelle, ad eccezione dei casi con acne infiammatoria attiva.\n\nPer prolungare i benefici, il rituale può essere accompagnato da una routine domiciliare specifica, dedicata a idratazione, barriera cutanea e luminosità tra un trattamento e l’altro." },
      ],
    },
    en: {
      intro: "A facial ritual bringing Rose de Mer and Muse together in an experience devoted to skin radiance and quality.\n\nAn hour of care for a fresher, more even-looking complexion and a pleasant feeling of firmness.",
      blocks: [
        { title: "The Rose de Mer and Muse synergy", text: "Peel Longevity brings together two iconic treatments. A synergy designed to support the skin’s natural renewal processes and preserve its vitality and radiance." },
        { title: "Renewal and radiance", text: "A treatment devoted to refining skin texture and softening the appearance of signs of tiredness. The face looks brighter, smoother and more even." },
        { title: "Elasticity and protection", text: "Care continues with attention to firmness, elasticity and the skin barrier, for skin that looks more resilient and full of vitality." },
        { title: "Care that continues", text: "Suitable from the age of 20–25 and for all skin types, except those with active inflammatory acne.\n\nTo extend the benefits, the ritual can be complemented by a tailored home-care routine focused on hydration, the skin barrier and radiance between treatments." },
      ],
    },
    es: {
      intro: "Un ritual facial que une Rose de Mer y Muse en una experiencia dedicada a la luminosidad y a la calidad de la piel.\n\nUna hora de cuidado para recuperar un cutis de aspecto más fresco y uniforme, con una agradable sensación de firmeza.",
      blocks: [
        { title: "La sinergia de Rose de Mer y Muse", text: "Peel Longevity nace del encuentro de dos tratamientos icónicos. Una sinergia pensada para acompañar los procesos naturales de renovación de la piel y preservar su vitalidad y luminosidad." },
        { title: "Renovación y luminosidad", text: "Un tratamiento dedicado a afinar la textura de la piel y atenuar el aspecto de los signos de cansancio. El rostro recupera un aspecto más luminoso, liso y uniforme." },
        { title: "Elasticidad y protección", text: "El cuidado continúa prestando atención a la firmeza, la elasticidad y la barrera cutánea, para una piel de aspecto más resistente y vital." },
        { title: "Un cuidado que continúa", text: "Indicado a partir de los 20–25 años y para todos los tipos de piel, excepto en casos de acné inflamatorio activo.\n\nPara prolongar los beneficios, el ritual puede acompañarse de una rutina específica en casa, dedicada a la hidratación, la barrera cutánea y la luminosidad entre tratamientos." },
      ],
    },
    fr: {
      intro: "Un rituel visage qui associe Rose de Mer et Muse dans une expérience dédiée à l’éclat et à la qualité de la peau.\n\nUne heure de soin pour retrouver un teint d’apparence plus frais et uniforme et une agréable sensation de fermeté.",
      blocks: [
        { title: "La synergie Rose de Mer et Muse", text: "Peel Longevity naît de la rencontre de deux soins iconiques. Une synergie conçue pour accompagner les processus naturels de renouvellement de la peau et préserver sa vitalité et son éclat." },
        { title: "Renouvellement et éclat", text: "Un soin dédié à affiner le grain de peau et à atténuer l’apparence des signes de fatigue. Le visage retrouve un aspect plus lumineux, lisse et uniforme." },
        { title: "Élasticité et protection", text: "Le soin se poursuit avec une attention portée à la fermeté, à l’élasticité et à la barrière cutanée, pour une peau d’apparence plus résistante et pleine de vitalité." },
        { title: "Un soin qui se prolonge", text: "Indiqué à partir de 20–25 ans et pour tous les types de peau, à l’exception des cas d’acné inflammatoire active.\n\nPour prolonger les bienfaits, le rituel peut s’accompagner d’une routine spécifique à domicile, dédiée à l’hydratation, à la barrière cutanée et à l’éclat entre deux soins." },
      ],
    },
    de: {
      intro: "Ein Gesichtsritual, das Rose de Mer und Muse zu einem Erlebnis für die Ausstrahlung und Qualität der Haut verbindet.\n\nEine Stunde Pflege für einen frischeren, ebenmäßigeren Teint und ein angenehmes Gefühl von Festigkeit.",
      blocks: [
        { title: "Die Synergie von Rose de Mer und Muse", text: "Peel Longevity vereint zwei ikonische Behandlungen. Eine Synergie, die die natürlichen Erneuerungsprozesse der Haut begleiten und ihre Vitalität und Ausstrahlung bewahren soll." },
        { title: "Erneuerung und Ausstrahlung", text: "Eine Behandlung zur Verfeinerung des Hautbildes und zur Milderung sichtbarer Zeichen von Müdigkeit. Das Gesicht wirkt strahlender, glatter und ebenmäßiger." },
        { title: "Elastizität und Schutz", text: "Die Pflege setzt sich mit besonderem Augenmerk auf Festigkeit, Elastizität und Hautbarriere fort, damit die Haut widerstandsfähiger und vitaler wirkt." },
        { title: "Pflege, die weitergeht", text: "Geeignet ab einem Alter von 20–25 Jahren und für alle Hauttypen, außer bei aktiver entzündlicher Akne.\n\nUm die Wirkung zu verlängern, kann das Ritual durch eine gezielte Pflegeroutine zu Hause ergänzt werden, die zwischen den Behandlungen Feuchtigkeit, Hautbarriere und Ausstrahlung in den Mittelpunkt stellt." },
      ],
    },
  }),
  ritual("longevity-muse", "rituale-longevity-muse", "/face-treatment.webp", {
    it: {
      intro: "Un rituale viso dedicato alla longevità cutanea, dove la cura incontra le biotecnologie della linea Muse.\n\nNovanta minuti per accompagnare la pelle verso una sensazione di comfort, elasticità e luminosità, valorizzando la naturale armonia del viso.",
      blocks: [
        { title: "Rinnovare con delicatezza", text: "Stress ossidativo, perdita di idratazione e alterazioni della barriera cutanea possono incidere sull’aspetto della pelle. Muse è pensato per sostenere i suoi processi di rigenerazione e riparazione, con un approccio dedicato alla qualità cutanea nel tempo." },
        { title: "Elasticità, contorni e luce", text: "Un’attenzione mirata alla barriera cutanea, all’elasticità e alla densità della pelle. Il rituale mira ad attenuare l’aspetto delle rughe e a valorizzare i contorni del viso, per una pelle dall’aspetto più compatto, luminoso e vitale." },
        { title: "La tecnologia Muse", text: "La linea utilizza biotecnologie avanzate, tra cui esosomi da cellule staminali di Goji e Telosense Active. Attivi pensati per sostenere la comunicazione cellulare, la rigenerazione e la longevità cutanea, all’interno di un’esperienza di cura completa." },
      ],
    },
    en: {
      intro: "A facial ritual devoted to skin longevity, where care meets the biotechnology of the Muse range.\n\nNinety minutes to guide the skin towards a feeling of comfort, elasticity and radiance, enhancing the face’s natural harmony.",
      blocks: [
        { title: "Gentle renewal", text: "Oxidative stress, loss of hydration and changes to the skin barrier can affect the appearance of the skin. Muse is designed to support its regeneration and repair processes, with an approach devoted to skin quality over time." },
        { title: "Elasticity, contours and radiance", text: "Targeted attention to the skin barrier, elasticity and skin density. The ritual aims to soften the appearance of wrinkles and enhance facial contours, for skin that looks firmer, brighter and full of vitality." },
        { title: "Muse technology", text: "The range uses advanced biotechnology, including exosomes from Goji stem cells and Telosense Active. These active ingredients are designed to support cellular communication, regeneration and skin longevity within a complete care experience." },
      ],
    },
    es: {
      intro: "Un ritual facial dedicado a la longevidad cutánea, donde el cuidado se une a las biotecnologías de la línea Muse.\n\nNoventa minutos para acompañar la piel hacia una sensación de confort, elasticidad y luminosidad, realzando la armonía natural del rostro.",
      blocks: [
        { title: "Renovar con delicadeza", text: "El estrés oxidativo, la pérdida de hidratación y las alteraciones de la barrera cutánea pueden influir en el aspecto de la piel. Muse está pensado para apoyar sus procesos de regeneración y reparación, con un enfoque dedicado a la calidad cutánea a lo largo del tiempo." },
        { title: "Elasticidad, contornos y luz", text: "Una atención específica a la barrera cutánea, la elasticidad y la densidad de la piel. El ritual busca atenuar el aspecto de las arrugas y realzar los contornos del rostro, para una piel de aspecto más firme, luminoso y vital." },
        { title: "La tecnología Muse", text: "La línea utiliza biotecnologías avanzadas, entre ellas exosomas de células madre de Goji y Telosense Active. Activos pensados para apoyar la comunicación celular, la regeneración y la longevidad cutánea dentro de una experiencia de cuidado completa." },
      ],
    },
    fr: {
      intro: "Un rituel visage dédié à la longévité cutanée, où le soin rencontre les biotechnologies de la gamme Muse.\n\nQuatre-vingt-dix minutes pour accompagner la peau vers une sensation de confort, d’élasticité et d’éclat, en mettant en valeur l’harmonie naturelle du visage.",
      blocks: [
        { title: "Renouveler en douceur", text: "Le stress oxydatif, la perte d’hydratation et les altérations de la barrière cutanée peuvent influencer l’apparence de la peau. Muse est conçu pour soutenir ses processus de régénération et de réparation, avec une approche dédiée à la qualité cutanée au fil du temps." },
        { title: "Élasticité, contours et lumière", text: "Une attention ciblée à la barrière cutanée, à l’élasticité et à la densité de la peau. Le rituel vise à atténuer l’apparence des rides et à mettre en valeur les contours du visage, pour une peau d’apparence plus ferme, lumineuse et pleine de vitalité." },
        { title: "La technologie Muse", text: "La gamme utilise des biotechnologies avancées, dont des exosomes issus de cellules souches de Goji et Telosense Active. Des actifs conçus pour soutenir la communication cellulaire, la régénération et la longévité cutanée dans une expérience de soin complète." },
      ],
    },
    de: {
      intro: "Ein Gesichtsritual für die Langlebigkeit der Haut, bei dem Pflege auf die Biotechnologie der Muse-Linie trifft.\n\nNeunzig Minuten für ein Gefühl von Geborgenheit, Elastizität und Ausstrahlung, das die natürliche Harmonie des Gesichts unterstreicht.",
      blocks: [
        { title: "Sanfte Erneuerung", text: "Oxidativer Stress, Feuchtigkeitsverlust und Veränderungen der Hautbarriere können das Erscheinungsbild der Haut beeinflussen. Muse soll ihre Regenerations- und Reparaturprozesse unterstützen und legt den Fokus auf die langfristige Hautqualität." },
        { title: "Elastizität, Konturen und Ausstrahlung", text: "Gezielte Aufmerksamkeit für Hautbarriere, Elastizität und Hautdichte. Das Ritual soll das Erscheinungsbild von Falten mildern und die Gesichtskonturen betonen, damit die Haut fester, strahlender und vitaler wirkt." },
        { title: "Die Muse-Technologie", text: "Die Linie verwendet fortschrittliche Biotechnologie, darunter Exosomen aus Goji-Stammzellen und Telosense Active. Diese Wirkstoffe sollen die Zellkommunikation, Regeneration und Langlebigkeit der Haut im Rahmen eines umfassenden Pflegeerlebnisses unterstützen." },
      ],
    },
  }),
];

export const getRitualExperience = (slug: string) => ritualExperiences.find((experience) => experience.slug === slug);
