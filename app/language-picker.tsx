"use client";

import { Language, languages, translate } from "./i18n";

export function FlagIcon({ language }: { language: Language }) {
  const title = languages.find(({ code }) => code === language)?.label ?? language;
  return (
    <svg className="flag-icon" viewBox="0 0 30 20" role="img" aria-label={title}>
      <title>{title}</title>
      {language === "it" && <><rect width="10" height="20" fill="#169b62" /><rect x="10" width="10" height="20" fill="#fff" /><rect x="20" width="10" height="20" fill="#ce2b37" /></>}
      {language === "fr" && <><rect width="10" height="20" fill="#002395" /><rect x="10" width="10" height="20" fill="#fff" /><rect x="20" width="10" height="20" fill="#ed2939" /></>}
      {language === "de" && <><rect width="30" height="6.67" fill="#171717" /><rect y="6.67" width="30" height="6.67" fill="#dd0000" /><rect y="13.34" width="30" height="6.66" fill="#ffce00" /></>}
      {language === "es" && <><rect width="30" height="5" fill="#aa151b" /><rect y="5" width="30" height="10" fill="#f1bf00" /><rect y="15" width="30" height="5" fill="#aa151b" /></>}
      {language === "en" && <><rect width="30" height="20" fill="#012169" /><path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4" /><path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" strokeWidth="1.6" /><path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6" /><path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3.2" /></>}
    </svg>
  );
}

export default function LanguagePicker({ language, open, onToggle, onChange }: {
  language: Language;
  open: boolean;
  onToggle: () => void;
  onChange: (language: Language) => void;
}) {
  const pickerLabel = translate("Seleziona lingua", language);
  return (
    <div className={open ? "language-picker is-open" : "language-picker"}>
      <button className="language-current" type="button" onClick={onToggle} aria-label={pickerLabel} aria-haspopup="menu" aria-expanded={open}>
        <FlagIcon language={language} />
        <span aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="language-menu" role="menu" aria-label={pickerLabel}>
          {languages.map(({ code, label }) => (
            <button key={code} type="button" role="menuitemradio" aria-checked={language === code} onClick={() => onChange(code)}>
              <FlagIcon language={code} />
              <span>{label}</span>
              {language === code && <i aria-hidden="true">✓</i>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
