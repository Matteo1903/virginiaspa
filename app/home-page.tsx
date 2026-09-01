"use client";

import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Language, languages, translate } from "./i18n";
import CommerceExperience from "./commerce";
import LanguagePicker, { FlagIcon } from "./language-picker";
import { SiteBrand } from "./site-chrome";
import {
  spaCityLine,
  spaDaysDisplay,
  spaEmail,
  spaHoursDisplay,
  spaInstagramIsPlaceholder,
  spaInstagramUrl,
  spaPhoneDisplay,
  spaPhoneHref,
  spaPhoneIsPlaceholder,
} from "../lib/site";

const treatments = [
  {
    id: "spa",
    label: "Rituali SPA",
    number: "01",
    title: "Lascia fuori il rumore.",
    description:
      "Percorsi sensoriali, calore e manualità lente per ritrovare una calma che si sente anche sulla pelle.",
    detail: "Percorsi da 60 a 120 minuti",
    image: "/water-stilllife.webp",
  },
  {
    id: "corpo",
    label: "Corpo",
    number: "02",
    title: "Ritrova la tua forma.",
    description:
      "Trattamenti rimodellanti e massaggi su misura, costruiti intorno al tuo corpo e ai risultati che desideri.",
    detail: "Analisi e percorso personalizzato",
    image: "/hero-ritual.webp",
  },
  {
    id: "viso",
    label: "Viso",
    number: "03",
    title: "La luce parte da qui.",
    description:
      "Protocolli viso delicati e avanzati per idratare, distendere e restituire vitalità senza snaturarti.",
    detail: "Diagnosi della pelle inclusa",
    image: "/face-treatment.webp",
  },
];

const quizQuestions = [
  {
    question: "Come vuoi sentirti quando esci da Virginia SPA?",
    options: ["Leggera e rilassata", "Energica e tonica", "Luminosa e rinnovata"],
  },
  {
    question: "Quanto tempo vuoi dedicarti?",
    options: ["Un’ora tutta per me", "Una pausa essenziale", "Un percorso completo"],
  },
  {
    question: "Da dove vuoi iniziare?",
    options: ["Corpo e tensioni", "Pelle e luminosità", "Mente e respiro"],
  },
];

function recommendRitual(answers: string[]) {
  const [feeling, time, focus] = answers;
  if (focus === "Pelle e luminosità") {
    return { title: "Rituale della Rosa", href: "/esperienze/rosa", copy: "Dalle tue risposte emerge il desiderio di luminosità e cura della pelle. Un rituale delicato per rinnovarti." };
  }
  if (feeling === "Energica e tonica") {
    return { title: "Rituale Surya", href: "/esperienze/surya", copy: "Cerchi energia, vitalità e leggerezza. Il calore del sole e le note tropicali accompagnano corpo e sensi verso una nuova carica." };
  }
  if (focus === "Mente e respiro" && time === "Un percorso completo") {
    return { title: "Rituale della Luna", href: "/esperienze/luna", copy: "Desideri rallentare profondamente e ritrovare calma. Un percorso avvolgente dedicato a mente, corpo e sensi." };
  }
  if (focus === "Corpo e tensioni" && time === "Un percorso completo") {
    return { title: "Rituale della Terra", href: "/esperienze/terra", copy: "Dalle tue risposte emerge il bisogno di radicamento e presenza. Un percorso corpo-mente per ritrovare equilibrio." };
  }
  if (feeling === "Leggera e rilassata" && time === "Una pausa essenziale") {
    return { title: "Rituale Luce d’Ambra", href: "/esperienze/luce-ambra", copy: "Cerchi calore, nutrimento e una pausa avvolgente. La luce della candela accompagna un’esperienza lenta e sensoriale." };
  }
  return { title: "HEAD SPA", href: "/head-spa", copy: "Dalle tue risposte emerge il desiderio di liberare la mente e sciogliere le tensioni. Scopri il percorso HEAD SPA più adatto a te." };
}

function RitualFinder({ quizComplete, quizStep, quizAnswers, chooseQuizAnswer, resetQuiz }: {
  quizComplete: boolean;
  quizStep: number;
  quizAnswers: string[];
  chooseQuizAnswer: (answer: string) => void;
  resetQuiz: () => void;
}) {
  const recommendation = recommendRitual(quizAnswers);
  return (
    <section id="rituale" className="quiz-section">
      <div className="quiz-side">
        <p className="section-index">03 · Ritual finder</p>
        <span className="quiz-symbol">V</span>
        <h2>Di cosa hai<br />bisogno oggi?</h2>
        <p>Tre domande, meno di un minuto, un primo consiglio pensato per te.</p>
      </div>
      <div className="quiz-card" aria-live="polite">
        {!quizComplete ? <>
          <div className="quiz-progress"><span>Domanda {quizStep + 1} di {quizQuestions.length}</span><div><i style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }} /></div></div>
          <h3>{quizQuestions[quizStep].question}</h3>
          <div className="quiz-options">{quizQuestions[quizStep].options.map((option, index) => <button key={option} type="button" onClick={() => chooseQuizAnswer(option)}><span>{String.fromCharCode(65 + index)}</span>{option}<i>→</i></button>)}</div>
        </> : <div className="quiz-result">
          <span className="result-mark">✦</span><p>Il rituale che ti consigliamo</p><h3>{recommendation.title}</h3>
          <span>{recommendation.copy}</span>
          <div><a className="button button-primary" href={recommendation.href}>Scopri il rituale</a><button className="restart-quiz" type="button" onClick={resetQuiz}>Ricomincia</button></div>
        </div>}
      </div>
    </section>
  );
}

function GiftCardTeaser() {
  return (
    <section id="gift-card" className="gift-section">
      <div className="gift-card-visual"><div className="gift-card-front"><span>Virginia <em>SPA</em></span><p>Un tempo solo tuo.</p><i>Gift ritual · 90 minuti</i></div><div className="gift-card-back" /></div>
      <div className="gift-copy">
        <p className="eyebrow"><span /> 04 · Regala benessere</p><h2>Un regalo che<br /><em>si sente.</em></h2>
        <p>Scegli un rituale oppure lascia libera la persona che ami. Acquisti una Gift Card digitale: chi la riceve contatta poi Virginia SPA per data, orario e dettagli del rituale.</p>
        <a className="button button-secondary" href="/gift-card">Crea la tua Gift Card <span>→</span></a>
      </div>
    </section>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("it");
  const [languageOpen, setLanguageOpen] = useState(false);
  const originalText = useRef(new WeakMap<Node, string>());
  const originalAttributes = useRef(new WeakMap<Element, Record<string, string>>());
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("virginia-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;
    const frame = window.requestAnimationFrame(() => {
      setIsDark(shouldUseDark);
      document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!bookingOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBookingOpen(false);
    };
    document.body.classList.add("modal-lock");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("modal-lock");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [bookingOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.classList.add("menu-lock");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("menu-lock");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const saved = window.localStorage.getItem("virginia-language") as Language | null;
    const frame = window.requestAnimationFrame(() => {
      if (saved && languages.some(({ code }) => code === saved)) setLanguage(saved);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("virginia-language", language);
    const root = document.querySelector("main");
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const current = node.nodeValue ?? "";
      if (current.trim() && !node.parentElement?.closest(".commerce-section")) {
        if (!originalText.current.has(node)) originalText.current.set(node, current);
        const source = originalText.current.get(node) ?? current;
        node.nodeValue = translate(source.trim(), language);
      }
      node = walker.nextNode();
    }
    root.querySelectorAll("[aria-label], [title], [placeholder]").forEach((element) => {
      if (element.closest(".commerce-section")) return;
      // Keep dynamic labels (menu open/close, theme) out of the static translation cache.
      if (element.matches(".menu-toggle, .theme-toggle")) return;
      let originals = originalAttributes.current.get(element);
      if (!originals) {
        originals = {};
        for (const attribute of ["aria-label", "title", "placeholder"]) {
          const value = element.getAttribute(attribute);
          if (value) originals[attribute] = value;
        }
        originalAttributes.current.set(element, originals);
      }
      Object.entries(originals).forEach(([attribute, value]) => element.setAttribute(attribute, translate(value, language)));
    });
  }, [language, quizStep, quizComplete, quizAnswers, bookingOpen, bookingSent, menuOpen, isDark, contactSent, contactLoading, contactError]);

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setLanguageOpen(false);
    setMenuOpen(false);
  };

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    document.documentElement.dataset.theme = nextTheme ? "dark" : "light";
    window.localStorage.setItem("virginia-theme", nextTheme ? "dark" : "light");
  };

  const openBooking = () => {
    setBookingSent(false);
    setBookingError("");
    setBookingOpen(true);
    setMenuOpen(false);
  };

  const sendBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingLoading(true);
    setBookingError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const interest = String(data.get("interest") || "");
    const message = `Richiesta consulenza. Interesse: ${interest || "non specificato"}.`;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message,
          language,
          privacyAccepted: data.get("privacy") === "on",
        }),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Invio non disponibile.");
      form.reset();
      setBookingSent(true);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Invio non disponibile.");
    } finally {
      setBookingLoading(false);
    }
  };

  const chooseQuizAnswer = (answer: string) => {
    const updated = [...quizAnswers, answer];
    setQuizAnswers(updated);
    if (quizStep === quizQuestions.length - 1) {
      setQuizComplete(true);
    } else {
      setQuizStep((current) => current + 1);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers([]);
    setQuizStep(0);
    setQuizComplete(false);
  };

  const handleHeroPointer = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--pointer-x", `${x * 16}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${y * 12}px`);
  };

  const sendContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactLoading(true);
    setContactError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), email: data.get("email"), phone: data.get("phone"), message: data.get("message"), language, privacyAccepted }) });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Invio non disponibile. Contatta direttamente la SPA.");
      form.reset();
      setPrivacyAccepted(false);
      setContactSent(true);
    } catch (error) {
      setContactError(error instanceof Error ? error.message : "Invio non disponibile. Contatta direttamente la SPA.");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <main id="main-content">
      <a className="skip-link" href="#home">Vai al contenuto principale</a>
      <div className="top-note">
        <span>Beauty farm · Latina</span>
        <span className="top-note-center">Il tuo benessere, con intenzione</span>
        <a href="#contatti">Parla con noi ↗</a>
      </div>

      <header className={menuOpen ? "site-header is-menu-open" : "site-header"}>
        <SiteBrand href="#home" label="Virginia SPA, torna alla home" onClick={() => setMenuOpen(false)} />

        <nav className="nav-links nav-links-desktop" aria-label="Navigazione principale">
          <a href="#shop">Esperienze</a>
          <a href="/gift-card">Gift Card</a>
          <a href="#metodo">Metodo</a>
          <a href="/chi-siamo">Chi siamo</a>
          <a href="#contatti">Contatti</a>
        </nav>

        <div className="header-actions">
          <LanguagePicker language={language} open={languageOpen} onToggle={() => setLanguageOpen((open) => !open)} onChange={changeLanguage} />
          <a className="header-booking" href="#shop">
            Acquista un voucher
            <span aria-hidden="true">↗</span>
          </a>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Attiva modalità chiara" : "Attiva modalità scura"}
            title={isDark ? "Modalità chiara" : "Modalità scura"}
          >
            <span className="sun" aria-hidden="true">☼</span>
            <span className="moon" aria-hidden="true">◐</span>
          </button>
          <button
            className={menuOpen ? "menu-toggle is-open" : "menu-toggle"}
            type="button"
            aria-label={translate(menuOpen ? "Chiudi il menu" : "Apri il menu", language)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <nav
        id="mobile-navigation"
        className={menuOpen ? "nav-links nav-links-mobile is-open" : "nav-links nav-links-mobile"}
        aria-label="Navigazione mobile"
        aria-hidden={!menuOpen}
      >
        <a href="#shop" onClick={() => setMenuOpen(false)}>Esperienze</a>
        <a href="/gift-card" onClick={() => setMenuOpen(false)}>Gift Card</a>
        <a href="#metodo" onClick={() => setMenuOpen(false)}>Metodo</a>
        <a href="/chi-siamo" onClick={() => setMenuOpen(false)}>Chi siamo</a>
        <a href="#contatti" onClick={() => setMenuOpen(false)}>Contatti</a>
        <a className="mobile-booking" href="#shop" onClick={() => setMenuOpen(false)}>
          Acquista un voucher
        </a>
        <div className="mobile-languages" role="group" aria-label={translate("Seleziona lingua", language)}>
          {languages.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              className={language === code ? "active" : undefined}
              aria-label={label}
              aria-pressed={language === code}
              onClick={() => {
                changeLanguage(code);
                setMenuOpen(false);
              }}
            >
              <FlagIcon language={code} />
            </button>
          ))}
        </div>
      </nav>

      <section id="home" className="hero" onPointerMove={handleHeroPointer}>
        <div className="hero-copy">
          <p className="eyebrow"><span /> Beauty farm · Latina</p>
          <h1>
            Il tuo tempo.
            <em>La tua bellezza.</em>
          </h1>
          <p className="hero-description">
            Rituali su misura per corpo, mente e pelle. Un luogo in cui la
            tecnologia rallenta e il benessere torna personale.
          </p>
          <div className="hero-buttons">
            <a className="button button-primary" href="#rituale">
              Scopri il tuo rituale <span>→</span>
            </a>
            <a className="button button-secondary" href="#shop">
              Esplora i trattamenti <span>↓</span>
            </a>
          </div>
          <div className="hero-proof">
            <div className="proof-faces" aria-hidden="true">
              <span>V</span><span>♡</span><span>+</span>
            </div>
            <p>Beauty farm · Latina · Rituali su misura</p>
          </div>
        </div>

        <div className="hero-visual" aria-label="Atmosfera e rituali Virginia SPA">
          <div className="visual-shape visual-water">
            <Image src="/water-stilllife.webp" alt="Pietre e acqua in un rituale sensoriale" fill unoptimized sizes="(max-width: 900px) 70vw, 34vw" />
          </div>
          <div className="visual-shape visual-main">
            <Image src="/hero-ritual.webp" alt="Rituale di benessere in luce naturale" fill priority unoptimized sizes="(max-width: 900px) 58vw, 28vw" />
          </div>
          <div className="visual-shape visual-detail">
            <Image src="/face-treatment.webp" alt="Trattamento viso Virginia SPA" fill unoptimized sizes="(max-width: 900px) 42vw, 18vw" />
          </div>
          <div className="ritual-card">
            <span className="ritual-kicker">Rituale del mese</span>
            <i />
            <strong>Cielo<br />&amp; Terra</strong>
            <button type="button" onClick={openBooking} aria-label="Richiedi una consulenza per Cielo e Terra">↗</button>
          </div>
          <div className="drag-hint" aria-hidden="true">
            <span>↔</span> muovi lo sguardo
          </div>
        </div>

      </section>

      <section className="manifesto" aria-label="La filosofia Virginia SPA">
        <p className="section-index">01 · Il nostro modo</p>
        <blockquote>
          Non inseguiamo una bellezza perfetta.
          <em>Riveliamo quella che ti appartiene.</em>
        </blockquote>
        <p className="manifesto-copy">
          Ascolto, competenza e ritualità. Ogni esperienza nasce da ciò di cui
          hai davvero bisogno, non da un protocollo uguale per tutti.
        </p>
      </section>

      <CommerceExperience language={language} />

      <RitualFinder
        quizComplete={quizComplete}
        quizStep={quizStep}
        quizAnswers={quizAnswers}
        chooseQuizAnswer={chooseQuizAnswer}
        resetQuiz={resetQuiz}
      />

      <GiftCardTeaser />

      <section id="metodo" className="method-section">
        <div className="method-intro">
          <p className="eyebrow light"><span /> Il metodo Virginia</p>
          <h2>La cura comincia<br />dall’ascolto.</h2>
          <p>
            Non scegli soltanto un trattamento. Insieme troviamo l’esperienza
            giusta per il momento che stai vivendo.
          </p>
        </div>
        <div className="method-steps">
          <article>
            <span>01</span>
            <div className="step-icon">◎</div>
            <h3>Ti ascoltiamo</h3>
            <p>Partiamo dalle tue sensazioni, dai desideri e dalle esigenze della tua pelle.</p>
          </article>
          <article>
            <span>02</span>
            <div className="step-icon">✦</div>
            <h3>Disegniamo</h3>
            <p>Creiamo un protocollo personale, combinando manualità, attivi e tecnologia.</p>
          </article>
          <article>
            <span>03</span>
            <div className="step-icon">◌</div>
            <h3>Ti accompagniamo</h3>
            <p>Seguiamo i risultati nel tempo e adattiamo il percorso mentre cambi tu.</p>
          </article>
        </div>
      </section>

      <section className="faq-section">
        <div>
          <p className="section-index">Prima di arrivare</p>
          <h2>Domande,<br /><em>risposte semplici.</em></h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>Come scelgo il trattamento giusto?<span>+</span></summary>
            <p>Puoi partire dal nostro Ritual Finder oppure contattarci per una consulenza: ascolteremo esigenze, tempi e obiettivi prima di consigliarti.</p>
          </details>
          <details>
            <summary>L’acquisto online è una prenotazione?<span>+</span></summary>
            <p>No. Online acquisti una card/voucher digitale. Dopo il pagamento contatta Virginia SPA per scegliere data, orario e finalizzare la prenotazione.</p>
          </details>
          <details>
            <summary>Come si usa il voucher?<span>+</span></summary>
            <p>Lo ricevi via email e puoi scaricarlo dalla pagina di conferma. Poi chiami o scrivi alla SPA per fissare l’appuntamento e presenti il codice in cabina.</p>
          </details>
          <details>
            <summary>Quanto dura il voucher?<span>+</span></summary>
            <p>Il voucher è valido 12 mesi dalla data di emissione, salvo diversa indicazione sul documento.</p>
          </details>
          <details>
            <summary>Posso chiedere un rimborso?<span>+</span></summary>
            <p>Il consumatore può recedere entro 14 giorni se il voucher non è ancora stato utilizzato in SPA. I dettagli sono nelle condizioni di vendita. Un voucher già usato non si rimborsa in automatico.</p>
          </details>
          <details>
            <summary>Posso regalare un trattamento?<span>+</span></summary>
            <p>Certo. Online acquisti un voucher digitale, per un rituale specifico o un valore libero. Chi lo riceve contatta poi Virginia SPA per data, orario e dettagli.</p>
          </details>
          <details>
            <summary>Gravidanza, vino o esigenze particolari?<span>+</span></summary>
            <p>Alcuni rituali (tra cui percorsi in gravidanza e Wine Essence) vanno valutati in cabina. Segnala sempre condizioni di salute, allergie o gravidanza quando contatti la SPA.</p>
          </details>
          <details>
            <summary>Quanto prima devo arrivare?<span>+</span></summary>
            <p>Ti suggeriamo di arrivare dieci minuti prima, così potrai iniziare senza fretta e raccontarci come ti senti.</p>
          </details>
        </div>
      </section>

      <section id="contatti" className="closing-section">
        <Image src="/water-stilllife.webp" alt="" fill unoptimized sizes="100vw" />
        <div className="closing-overlay contact-layout">
          <div className="contact-intro"><p>Virginia SPA · Latina</p><h2>Parliamo del tuo<br /><em>momento di benessere.</em></h2><span>Scegli il modo più comodo per contattarci: {spaPhoneIsPlaceholder ? "inviaci un messaggio." : "chiamaci oppure inviaci un messaggio."}</span><div className="contact-direct">{!spaPhoneIsPlaceholder && <a href={spaPhoneHref}><small>Telefono</small>{spaPhoneDisplay}</a>}<a href={`mailto:${spaEmail}`}><small>Email SPA</small>{spaEmail}</a></div></div>
          <div className="contact-form-card"><p>Scrivi alla SPA</p><h3>Come possiamo aiutarti?</h3>{contactSent ? <div className="contact-success" role="status"><strong>Messaggio ricevuto.</strong><span>Ti ricontatteremo utilizzando i riferimenti indicati.</span><button type="button" onClick={() => setContactSent(false)}>Invia un altro messaggio</button></div> : <form onSubmit={sendContact}><div><label>Nome e cognome<input name="name" required minLength={2} autoComplete="name" /></label><label>Email<input name="email" type="email" required autoComplete="email" /></label></div><label>Numero di telefono<input name="phone" type="tel" required minLength={5} autoComplete="tel" /></label><label>Il tuo messaggio<textarea name="message" required minLength={10} maxLength={2000} rows={5} /></label><label className="privacy-check"><input type="checkbox" required checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} />Ho letto l’<a href="/privacy" target="_blank" rel="noopener noreferrer">informativa privacy</a>.</label>{contactError && <p className="contact-error" role="alert">{contactError}</p>}<button className="button button-light" type="submit" disabled={contactLoading || !privacyAccepted}>{contactLoading ? "Invio…" : "Invia il messaggio"}<span>→</span></button></form>}</div>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <a className="brand" href="#home">Virginia <em>SPA</em></a>
          <p>Beauty, wellness & slow rituals.<br />{spaCityLine}</p>
        </div>
        <div className="footer-links">
          <div>
            <span>Esplora</span>
            <a href="#shop">Trattamenti</a>
            <a href="#metodo">Metodo</a>
            <a href="/chi-siamo">Chi siamo</a>
            <a href="/gift-card">Gift Card</a>
          </div>
          <div>
            <span>Contatti</span>
            {!spaPhoneIsPlaceholder && <a href={spaPhoneHref}>{spaPhoneDisplay}</a>}
            <a href={`mailto:${spaEmail}`}>{spaEmail}</a>
            {!spaInstagramIsPlaceholder && <a href={spaInstagramUrl} target="_blank" rel="noopener noreferrer">Instagram ↗</a>}
          </div>
          <div>
            <span>Orari</span>
            <p>{spaDaysDisplay}<br />{spaHoursDisplay}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Virginia SPA</span>
          <span className="footer-legal"><a href="/privacy">Privacy</a><a href="/cookie">Cookie</a><a href="/termini">Termini</a></span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Torna su ↑
          </button>
        </div>
      </footer>

      {bookingOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setBookingOpen(false)}>
          <section
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setBookingOpen(false)}
              aria-label="Chiudi la finestra"
            >
              ×
            </button>
            {!bookingSent ? (
              <>
                <p className="eyebrow"><span /> Il tuo momento</p>
                <h2 id="booking-title">Parliamo del rituale<br />giusto per te.</h2>
                <p className="modal-copy">
                  Lascia i tuoi riferimenti: ti ricontattiamo per una consulenza. L’acquisto online resta un voucher, non una prenotazione.
                </p>
                <form onSubmit={sendBooking}>
                  <label>
                    Come ti chiami?
                    <input type="text" name="name" placeholder="Il tuo nome" required minLength={2} autoComplete="name" />
                  </label>
                  <label>
                    Email
                    <input type="email" name="email" placeholder="Email" required autoComplete="email" />
                  </label>
                  <label>
                    Come possiamo contattarti?
                    <input type="tel" name="phone" placeholder="Numero di telefono" required minLength={5} autoComplete="tel" />
                  </label>
                  <label>
                    Cosa ti interessa?
                    <select name="interest" defaultValue="" required>
                      <option value="" disabled>Seleziona un’esperienza</option>
                      <option value="HEAD SPA">HEAD SPA</option>
                      {treatments.map((treatment) => (
                        <option key={treatment.id} value={treatment.label}>{treatment.label}</option>
                      ))}
                      <option value="Vorrei un consiglio">Vorrei un consiglio</option>
                    </select>
                  </label>
                  <label className="privacy-check">
                    <input name="privacy" type="checkbox" required />
                    Ho letto l’<a href="/privacy" target="_blank" rel="noopener noreferrer">informativa privacy</a>.
                  </label>
                  {bookingError && <p className="contact-error" role="alert">{bookingError}</p>}
                  <button className="button button-primary" type="submit" disabled={bookingLoading}>
                    {bookingLoading ? "Invio…" : "Richiedi di essere ricontattato"} <span>→</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="booking-success">
                <span>✓</span>
                <p>Richiesta inviata</p>
                <h2>Grazie per esserti<br />scelta un momento.</h2>
                <p>Il team Virginia SPA ti ricontatterà con i riferimenti indicati.</p>
                <button className="button button-primary" type="button" onClick={() => setBookingOpen(false)}>
                  Chiudi
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
