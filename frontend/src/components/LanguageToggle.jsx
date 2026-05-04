import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

export const LanguageToggle = () => {
  const { lang, setLang, languages } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-testid="language-toggle-button"
        className="flex items-center gap-2 text-[0.82rem] tracking-[0.16em] uppercase text-ink-soft hover:text-ink transition-colors duration-300 py-2 px-3 rounded-full border border-hairline bg-white/60 backdrop-blur-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={14} className="text-turquoise" />
        <span>{current.label}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          data-testid="language-dropdown"
          className="absolute right-0 mt-2 w-44 rounded-2xl border border-hairline bg-white shadow-[0_10px_40px_rgba(43,46,42,0.08)] overflow-hidden z-50"
        >
          {languages.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                onClick={() => { setLang(l.code); setOpen(false); }}
                data-testid={`language-option-${l.code}`}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-sand-soft transition-colors ${
                  l.code === lang ? 'text-earth' : 'text-ink-soft'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-base leading-none">{l.flag}</span>
                  <span className="tracking-wide">{l.name}</span>
                </span>
                {l.code === lang && <Check size={14} className="text-turquoise" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageToggle;
