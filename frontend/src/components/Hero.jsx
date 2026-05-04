import React from 'react';
import { useLang } from '../i18n/LanguageContext';
import { ArrowRight } from 'lucide-react';

const HERO_IMG =
  'https://images.unsplash.com/photo-1748357657454-b2c760eaea4c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHx0aGFpJTIwbWFzc2FnZSUyMHN0dWRpbyUyMG9yZ2FuaWMlMjBlYXJ0aCUyMHRvbmVzfGVufDB8fHx8MTc3NzkzMjQ3MHww&ixlib=rb-4.1.0&q=85';

export const Hero = () => {
  const { t } = useLang();

  return (
    <section id="home" data-testid="hero-section" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Organic earthen texture — Tranquilário Studio"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B2E2A]/70 via-[#2B2E2A]/55 to-[#F4F1ED]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B2E2A]/50 via-transparent to-transparent" />
        <div className="absolute inset-0 grain opacity-40 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-36 pb-24 md:pt-44 md:pb-36 min-h-[100svh] flex flex-col justify-end">
        <p className="overline text-[#7FA8A0] reveal" data-testid="hero-overline">
          {t.hero.overline}
        </p>

        <h1
          data-testid="hero-title"
          className="h-serif text-5xl sm:text-6xl lg:text-[5.5rem] text-[#F4F1ED] mt-5 max-w-4xl whitespace-pre-line reveal reveal-delay-1"
          style={{ lineHeight: 1.02 }}
        >
          {t.hero.title}
        </h1>

        <p
          data-testid="hero-subtitle"
          className="mt-7 max-w-2xl text-base md:text-lg text-[#EFEAE2]/90 font-light leading-relaxed reveal reveal-delay-2"
        >
          {t.hero.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4 reveal reveal-delay-3">
          <a
            href="#contact"
            data-testid="hero-primary-cta"
            className="inline-flex items-center gap-3 rounded-full bg-[#F4F1ED] text-ink px-7 py-3.5 text-[0.82rem] tracking-[0.2em] uppercase hover:bg-white transition-all duration-300 hover:-translate-y-[2px] shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
          >
            {t.hero.primary}
            <ArrowRight size={16} />
          </a>
          <a
            href="#about"
            data-testid="hero-secondary-cta"
            className="inline-flex items-center gap-2 text-[0.82rem] tracking-[0.2em] uppercase text-[#F4F1ED] border-b border-[#F4F1ED]/40 hover:border-[#F4F1ED] pb-1 transition-colors"
          >
            {t.hero.secondary}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
