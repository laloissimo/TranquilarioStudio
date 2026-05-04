import React from 'react';
import { useLang } from '../i18n/LanguageContext';

const PORTRAIT =
  'https://images.unsplash.com/photo-1633116179568-0183958979e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxtYWxlJTIwbWFzc2FnZSUyMHRoZXJhcGlzdCUyMHBvcnRyYWl0JTIwc21pbGluZyUyMG5hdHVyZXxlbnwwfHx8fDE3Nzc5MzI0NzB8MA&ixlib=rb-4.1.0&q=85';

export const About = () => {
  const { t } = useLang();

  return (
    <section id="about" data-testid="about-section" className="relative py-24 md:py-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-12 md:gap-16 items-start">
        <div className="md:col-span-6 lg:col-span-5">
          <div className="relative">
            <img
              src={PORTRAIT}
              alt="Lalo Porto — practitioner"
              data-testid="about-portrait"
              className="w-full h-[520px] md:h-[640px] object-cover rounded-[2rem] shadow-[0_30px_80px_-30px_rgba(43,46,42,0.25)]"
            />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-[#5E8B82]/15 blur-2xl" aria-hidden />
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-7 md:pt-10">
          <p className="overline" data-testid="about-overline">{t.about.overline}</p>
          <h2
            data-testid="about-title"
            className="h-serif text-4xl sm:text-5xl lg:text-6xl mt-5"
          >
            {t.about.title}
          </h2>

          <div className="mt-8 space-y-6 text-ink-soft text-base md:text-lg leading-relaxed max-w-xl">
            <p data-testid="about-body-1">{t.about.body1}</p>
            <p data-testid="about-body-2">{t.about.body2}</p>
          </div>

          <figure className="mt-12 border-l-2 border-[#5E8B82] pl-6 max-w-xl">
            <blockquote
              data-testid="about-quote"
              className="h-serif text-2xl md:text-3xl text-ink italic leading-snug font-light"
            >
              {t.about.quote}
            </blockquote>
            <figcaption className="mt-4 text-[0.78rem] tracking-[0.22em] uppercase text-ink-soft">
              {t.about.quoteAuthor}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default About;
