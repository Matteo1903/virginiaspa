import { translate, type Language } from "../app/i18n";
import { checkoutCatalog, headSpaStartingPriceEuros } from "./catalog";
import { ayurvedaPageCopy } from "../app/ayurveda-content";

export const quizQuestions = [
  {
    question: "Come vuoi sentirti quando esci da Virginia SPA?",
    options: ["Leggera e rilassata", "Energica e tonica", "Luminosa e rinnovata"],
  },
  {
    question: "Quanto tempo vuoi dedicarti?",
    options: ["Un’ora tutta per me", "Una pausa essenziale", "Un percorso completo", "Tre ore di benessere"],
  },
  {
    question: "Da dove vuoi iniziare?",
    options: ["Corpo e tensioni", "Pelle e luminosità", "Mente e respiro", "Pelle e longevità", "Equilibrio ayurvedico"],
  },
];

export function recommendRitual(answers: string[], language: Language = "it") {
  const [feeling, time, focus] = answers;
  const ritual = (productId: string, slug: string, copy: string) => {
    const product = checkoutCatalog[productId];
    return { productId, title: product.titles?.[language] || product.title, href: `/esperienze/${slug}`, copy: translate(copy, language), price: product.unitAmount / 100, duration: product.duration, fromPrice: false };
  };
  const ayurveda = () => ({
    productId: null, title: checkoutCatalog["percorso-ayurveda"].titles?.[language] || "Ayurveda", href: "/esperienze/ayurveda",
    copy: translate("Desideri ritrovare equilibrio tra corpo, mente e sensi. Esplora i 15 rituali Ayurveda e scegli con la SPA l’esperienza più adatta a te.", language),
    price: null, duration: ayurvedaPageCopy[language].count, fromPrice: false,
  });
  if (focus === "Equilibrio ayurvedico") return ayurveda();
  if (focus === "Pelle e luminosità" || focus === "Pelle e longevità") {
    if (time === "Un’ora tutta per me" || time === "Una pausa essenziale") {
      return ritual("rituale-peel-longevity", "peel-longevity", "Cerchi un momento dedicato alla luminosità e al rinnovamento della pelle. Peel Longevity unisce Rose de Mer e Muse in un rituale viso di un’ora.");
    }
    if (focus === "Pelle e longevità") {
      return ritual("rituale-longevity-muse", "longevity-muse", "Desideri prenderti cura della qualità della pelle nel tempo. Longevity Muse dedica novanta minuti a elasticità, comfort e luminosità del viso.");
    }
    return ritual("rituale-rosa", "rosa", "Dalle tue risposte emerge il desiderio di luminosità e cura della pelle. Un rituale delicato per rinnovarti.");
  }
  if (time === "Tre ore di benessere") {
    return ayurveda();
  }
  if (feeling === "Energica e tonica") {
    return ritual("rituale-surya", "surya", "Cerchi energia, vitalità e leggerezza. Il calore del sole e le note tropicali accompagnano corpo e sensi verso una nuova carica.");
  }
  if (focus === "Mente e respiro" && time === "Un percorso completo") {
    return ritual("rituale-luna", "luna", "Desideri rallentare profondamente e ritrovare calma. Un percorso avvolgente dedicato a mente, corpo e sensi.");
  }
  if (focus === "Corpo e tensioni" && time === "Un percorso completo") {
    return ritual("rituale-terra", "terra", "Dalle tue risposte emerge il bisogno di radicamento e presenza. Un percorso corpo-mente per ritrovare equilibrio.");
  }
  if (feeling === "Leggera e rilassata" && time === "Una pausa essenziale") {
    return ritual("rituale-luce-ambra", "luce-ambra", "Cerchi calore, nutrimento e una pausa avvolgente. La luce della candela accompagna un’esperienza lenta e sensoriale.");
  }
  return { productId: null, title: "HEAD SPA", href: "/head-spa", copy: translate("Dalle tue risposte emerge il desiderio di liberare la mente e sciogliere le tensioni. Scopri il percorso HEAD SPA più adatto a te.", language), price: headSpaStartingPriceEuros, duration: translate("6 percorsi · da 45 min", language), fromPrice: true };
}
