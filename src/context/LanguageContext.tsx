import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, TranslationKeys } from "../lib/translations";

interface LanguageContextType {
  lang: "en" | "bn";
  setLang: (lang: "en" | "bn") => void;
  t: (key: keyof TranslationKeys, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<"en" | "bn">(() => {
    const saved = localStorage.getItem("streamplex_lang");
    return (saved === "en" || saved === "bn") ? saved : "en";
  });

  const setLang = (newLang: "en" | "bn") => {
    setLangState(newLang);
    localStorage.setItem("streamplex_lang", newLang);
  };

  const t = (key: keyof TranslationKeys, replacements?: Record<string, string | number>): string => {
    const translationMap = translations[lang];
    const value = translationMap[key];

    if (typeof value === "string") {
      let result = value;
      if (replacements) {
        Object.entries(replacements).forEach(([placeholder, repValue]) => {
          result = result.replace(new RegExp(`{${placeholder}}`, "g"), String(repValue));
        });
      }
      return result;
    }

    return String(value || key);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
