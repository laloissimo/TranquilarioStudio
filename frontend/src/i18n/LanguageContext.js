import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, LANGUAGES } from './translations';

const SUPPORTED = ['en', 'it', 'pt'];

// Map browser language tag (e.g., "pt-BR", "it-IT", "en-US") to one of our supported codes.
const detectBrowserLang = () => {
  if (typeof navigator === 'undefined') return 'en';
  const candidates = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
  for (const raw of candidates) {
    const base = raw.toLowerCase().split('-')[0];
    if (SUPPORTED.includes(base)) return base;
  }
  return 'en';
};

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
  languages: LANGUAGES,
});

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('tranq_lang');
      if (saved && translations[saved]) return saved;
    } catch (_) {}
    // First-time visitor: auto-detect from browser locale (Germany → de, Brazil/Portugal → pt, Italy → it, …).
    return detectBrowserLang();
  });

  const setLang = (code) => {
    if (!translations[code]) return;
    setLangState(code);
    try { localStorage.setItem('tranq_lang', code); } catch (_) {}
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
