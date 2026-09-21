"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { languages, type Language } from "./i18n";
import { track } from "../lib/analytics";

const eventName = "virginia-language-change";
function snapshot(): Language {
  try {
    const saved = localStorage.getItem("virginia-language");
    return languages.find(({ code }) => code === saved)?.code || "it";
  } catch { return "it"; }
}
function subscribe(listener: () => void) {
  window.addEventListener(eventName, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(eventName, listener);
    window.removeEventListener("storage", listener);
  };
}
export function useSiteLanguage() {
  const language = useSyncExternalStore(subscribe, snapshot, () => "it" as Language);
  const setLanguage = useCallback((value: Language) => {
    localStorage.setItem("virginia-language", value);
    window.dispatchEvent(new Event(eventName));
    track("language_changed", { language: value });
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  return [language, setLanguage] as const;
}

export function useSiteDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title.includes("Virginia SPA") ? title : `${title} | Virginia SPA Latina`;
  }, [title]);
}
