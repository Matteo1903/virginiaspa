"use client";

import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Language, languages, translate } from "./i18n";
import CommerceExperience from "./commerce";
import LanguagePicker from "./language-picker";

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
  {
    id: "laser",
    label: "Laser",
    number: "04",
    title: "Libera la tua pelle.",
    description:
      "Tecnologia e competenza si incontrano in protocolli progressivi, sicuri e calibrati sul tuo fototipo.",
    detail: "Consulenza preliminare gratuita",
    image: "/hero-ritual.webp",
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

const testimonials = [
  {
    quote:
      "Non è stato semplicemente un trattamento. Per un’ora ho sentito che ogni dettaglio era stato pensato per me.",
    name: "Elena",
    ritual: "Rituale Respiro di Seta",
  },
  {
    quote:
      "Ambiente elegante, persone attente e una consulenza davvero chiara. Ho finalmente trovato il mio percorso.",
    name: "Giulia",
    ritual: "Percorso viso Luce",
  },
  {
    quote:
      "La sensazione più bella? Uscire più leggera, senza fretta. È diventato il mio appuntamento con me stessa.",
    name: "Francesca",
    ritual: "Massaggio olistico",
  },
];

function RitualFinder({ quizComplete, quizStep, chooseQuizAnswer, openBooking, resetQuiz }: {
  quizComplete: boolean;
  quizStep: number;
  chooseQuizAnswer: (answer: string) => void;
  openBooking: () => void;
  resetQuiz: () => void;
}) {
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
          <span className="result-mark">✦</span><p>Il rituale che ti consigliamo</p><h3>Respiro di Seta</h3>
          <span>Dalle tue risposte emerge il desiderio di rallentare e ritrovare luminosità. Questo percorso unisce distensione e cura della pelle.</span>
          <div><button className="button button-primary" type="button" onClick={openBooking}>Richiedi una consulenza</button><button className="restart-quiz" type="button" onClick={resetQuiz}>Ricomincia</button></div>
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
        <p>Scegli un rituale oppure lascia libera la persona che ami. Prepariamo una gift card digitale o una confezione da ritirare in SPA.</p>
        <a className="button button-secondary" href="/gift-card">Crea la tua Gift Card <span>→</span></a>
      </div>
    </section>
  );
}

function StoriesSection() {
  return (
    <section className="stories-section">
      <div className="section-heading compact">
        <div><p className="eyebrow"><span /> Storie di benessere</p><h2>Come ci si sente,<br />dopo.</h2></div>
        <p>Parole vere, sensazioni personali. La parte più bella del nostro lavoro.</p>
      </div>
      <div className="story-grid">
        {testimonials.map((testimonial, index) => <article key={testimonial.name}>
          <span className="quote-mark">“</span><blockquote>{testimonial.quote}</blockquote>
          <div><span>{String(index + 1).padStart(2, "0")}</span><p><strong>{testimonial.name}</strong>{testimonial.ritual}</p></div>
        </article>)}
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
  }, [language, quizStep, quizComplete, bookingOpen, bookingSent, menuOpen, isDark]);

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
    setBookingOpen(true);
    setMenuOpen(false);
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

  return (
    <main id="main-content">
      <a className="skip-link" href="#home">Vai al contenuto principale</a>
      <div className="top-note">
        <span>Beauty farm · Latina</span>
        <span className="top-note-center">Il tuo benessere, con intenzione</span>
        <a href="#contatti">Parla con noi ↗</a>
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Virginia SPA, torna alla home">
          Virginia <em>SPA</em>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Chiudi il menu" : "Apri il menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
        </button>

        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Navigazione principale">
          <a href="#shop" onClick={() => setMenuOpen(false)}>
            Esperienze
          </a>
          <a href="#metodo" onClick={() => setMenuOpen(false)}>
            Metodo
          </a>
          <a href="/gift-card" onClick={() => setMenuOpen(false)}>
            Gift Card
          </a>
          <a href="#contatti" onClick={() => setMenuOpen(false)}>
            Contatti
          </a>
          <a className="mobile-booking" href="#shop" onClick={() => setMenuOpen(false)}>
            Prenota il tuo rituale
          </a>
        </nav>

        <div className="header-actions">
          <LanguagePicker language={language} open={languageOpen} onToggle={() => setLanguageOpen((open) => !open)} onChange={changeLanguage} />
          <a className="header-booking" href="#shop">
            Prenota il tuo rituale
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
        </div>
      </header>

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
            <p><strong>4,9</strong> su 5 · Esperienze che restano</p>
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
            <strong>Respiro<br />di Seta</strong>
            <button type="button" onClick={openBooking} aria-label="Prenota Respiro di Seta">↗</button>
          </div>
          <div className="drag-hint" aria-hidden="true">
            <span>↔</span> muovi lo sguardo
          </div>
          <div className="slider-dots" aria-hidden="true">
            <i className="active" /><i /><i /><i />
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
        chooseQuizAnswer={chooseQuizAnswer}
        openBooking={openBooking}
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
            <p>Puoi partire dal nostro Ritual Finder oppure prenotare una consulenza: ascolteremo esigenze, tempi e obiettivi prima di consigliarti.</p>
          </details>
          <details>
            <summary>Quanto prima devo arrivare?<span>+</span></summary>
            <p>Ti suggeriamo di arrivare dieci minuti prima, così potrai iniziare senza fretta e raccontarci come ti senti.</p>
          </details>
          <details>
            <summary>Posso regalare un trattamento?<span>+</span></summary>
            <p>Certo. Puoi scegliere un rituale specifico o un valore libero, in formato digitale oppure in confezione regalo.</p>
          </details>
          <details>
            <summary>Cosa succede durante la prima consulenza?<span>+</span></summary>
            <p>Conosciamo la tua storia, osserviamo le esigenze della pelle o del corpo e definiamo insieme un percorso realistico e trasparente.</p>
          </details>
        </div>
      </section>

      <StoriesSection />

      <section id="contatti" className="closing-section">
        <Image src="/water-stilllife.webp" alt="" fill unoptimized sizes="100vw" />
        <div className="closing-overlay">
          <p>Virginia SPA · Latina</p>
          <h2>Il momento giusto<br />è quello che scegli <em>per te.</em></h2>
          <a className="button button-light" href="#shop">
            Prenota il tuo rituale <span>↗</span>
          </a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <a className="brand" href="#home">Virginia <em>SPA</em></a>
          <p>Beauty, wellness & slow rituals.<br />Nel cuore di Latina.</p>
        </div>
        <div className="footer-links">
          <div>
            <span>Esplora</span>
            <a href="#shop">Trattamenti</a>
            <a href="#metodo">Metodo</a>
            <a href="/gift-card">Gift Card</a>
          </div>
          <div>
            <span>Contatti</span>
            <a href="tel:+390773000000">0773 000000</a>
            <a href="mailto:ciao@virginiaspa.it">ciao@virginiaspa.it</a>
            <a href="#home">Instagram ↗</a>
          </div>
          <div>
            <span>Orari demo</span>
            <p>Lun — Sab<br />09:00 — 20:00</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Virginia SPA · Demo</span>
          <span>Privacy · Cookie</span>
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
                  Lascia i tuoi riferimenti. Questa è una demo: la richiesta non
                  verrà inviata realmente.
                </p>
                <form
                  onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    setBookingSent(true);
                  }}
                >
                  <label>
                    Come ti chiami?
                    <input type="text" name="name" placeholder="Il tuo nome" required />
                  </label>
                  <label>
                    Come possiamo contattarti?
                    <input type="tel" name="phone" placeholder="Numero di telefono" required />
                  </label>
                  <label>
                    Cosa ti interessa?
                    <select name="interest" defaultValue="">
                      <option value="" disabled>Seleziona un’esperienza</option>
                      {treatments.map((treatment) => (
                        <option key={treatment.id}>{treatment.label}</option>
                      ))}
                      <option>Vorrei un consiglio</option>
                    </select>
                  </label>
                  <button className="button button-primary" type="submit">
                    Richiedi di essere ricontattata <span>→</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="booking-success">
                <span>✓</span>
                <p>Richiesta simulata</p>
                <h2>Grazie per esserti<br />scelta un momento.</h2>
                <p>Nella versione finale, il team Virginia SPA riceverà qui la richiesta di contatto.</p>
                <button className="button button-primary" type="button" onClick={() => setBookingOpen(false)}>
                  Torna alla demo
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
