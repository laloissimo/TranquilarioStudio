import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

const BG =
  'https://images.unsplash.com/photo-1620052079778-7d5b7509645c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwdGhlcmFweSUyMGhhbmRzJTIwYmFja3xlbnwwfHx8fDE3Nzc5MzI0NzV8MA&ixlib=rb-4.1.0&q=85';

export const Testimonials = () => {
  const { t } = useLang();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <section id="testimonials" data-testid="testimonials-section" className="relative py-24 md:py-32 bg-[#3A4A3E] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.18]">
        <img src={BG} alt="" aria-hidden className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#3A4A3E]/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="overline text-[#7FA8A0]" data-testid="testimonials-overline">
              {t.testimonials.overline}
            </p>
            <h2
              data-testid="testimonials-title"
              className="h-serif text-4xl sm:text-5xl lg:text-6xl mt-5 text-[#F4F1ED]"
            >
              {t.testimonials.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              data-testid="testimonials-prev"
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full border border-[#F4F1ED]/25 text-[#F4F1ED] flex items-center justify-center hover:bg-[#F4F1ED]/10 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              data-testid="testimonials-next"
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full border border-[#F4F1ED]/25 text-[#F4F1ED] flex items-center justify-center hover:bg-[#F4F1ED]/10 transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {t.testimonials.items.map((item, i) => (
              <article
                key={i}
                data-testid={`testimonial-card-${i}`}
                className="shrink-0 grow-0 basis-full md:basis-[70%] lg:basis-[55%] pr-8"
              >
                <div className="h-full rounded-3xl bg-[#F4F1ED]/5 backdrop-blur-sm border border-[#F4F1ED]/12 p-8 md:p-12">
                  <Quote size={36} className="text-[#7FA8A0]" strokeWidth={1} />
                  <blockquote className="mt-6 h-serif text-2xl md:text-3xl text-[#F4F1ED] leading-snug font-light">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-8 text-[0.78rem] tracking-[0.22em] uppercase text-[#F4F1ED]/70">
                    {item.author}
                  </figcaption>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2">
          {t.testimonials.items.map((_, i) => (
            <span
              key={i}
              data-testid={`testimonials-dot-${i}`}
              className={`h-[2px] transition-all duration-500 ${
                selected === i ? 'w-10 bg-[#F4F1ED]' : 'w-5 bg-[#F4F1ED]/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
