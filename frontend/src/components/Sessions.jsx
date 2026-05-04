import React from 'react';
import { useLang } from '../i18n/LanguageContext';
import { Leaf, Feather, Waves } from 'lucide-react';

const TEXTURE =
  'https://images.unsplash.com/photo-1658210202100-f40dae1947e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwyfHxuYXR1cmFsJTIwc3RvbmUlMjBmYWJyaWMlMjB0ZXh0dXJlJTIwc3VidGxlJTIwZ3JhZGllbnR8ZW58MHx8fHwxNzc3OTMyNDcwfDA&ixlib=rb-4.1.0&q=85';

const ICONS = [Waves, Feather, Leaf];

export const Sessions = () => {
  const { t } = useLang();

  return (
    <section id="sessions" data-testid="sessions-section" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={TEXTURE} alt="" aria-hidden className="w-full h-full object-cover opacity-[0.22]" />
        <div className="absolute inset-0 bg-gradient-to-b from-sand via-sand/90 to-sand" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <p className="overline" data-testid="sessions-overline">{t.sessions.overline}</p>
            <h2
              data-testid="sessions-title"
              className="h-serif text-4xl sm:text-5xl lg:text-6xl mt-5"
            >
              {t.sessions.title}
            </h2>
            <p className="mt-8 text-ink-soft text-base md:text-lg leading-relaxed max-w-md">
              {t.sessions.intro}
            </p>
            <p
              data-testid="sessions-note"
              className="mt-10 text-[0.78rem] tracking-[0.22em] uppercase text-turquoise"
            >
              {t.sessions.note}
            </p>
          </div>

          <div className="md:col-span-7">
            <ul className="divide-y divide-[rgba(74,93,78,0.16)] border-t border-hairline">
              {t.sessions.items.map((item, i) => {
                const Icon = ICONS[i] || Leaf;
                return (
                  <li
                    key={item.title}
                    data-testid={`session-item-${i}`}
                    className="group py-10 md:py-12 grid grid-cols-[auto_1fr] gap-6 md:gap-10 transition-all duration-500"
                  >
                    <div className="pt-2">
                      <div className="w-12 h-12 rounded-full bg-white border border-hairline flex items-center justify-center text-turquoise group-hover:bg-turquoise group-hover:text-white transition-colors duration-500">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between gap-6">
                        <h3 className="h-serif text-2xl md:text-3xl lg:text-4xl text-ink">
                          {item.title}
                        </h3>
                        <span className="text-[0.72rem] tracking-[0.24em] uppercase text-ink-soft/70 tabular-nums">
                          0{i + 1}
                        </span>
                      </div>
                      <p className="mt-4 text-ink-soft text-base leading-relaxed max-w-xl">
                        {item.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sessions;
