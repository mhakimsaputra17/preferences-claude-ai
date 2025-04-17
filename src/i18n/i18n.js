import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationDE from "./locales/de/translation.json";

// Resources containing translations
const resources = {
  english: {
    translation: translationEN,
  },
  spanish: {
    translation: translationES,
  },
  french: {
    translation: translationFR,
  },
  german: {
    translation: translationDE,
  },
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: "english",
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for React as it escapes by default
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "userLanguage",
      caches: ["localStorage"],
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
