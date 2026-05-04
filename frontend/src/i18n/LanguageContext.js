import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, LANGUAGES } from './translations';

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
    return 'en';
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
