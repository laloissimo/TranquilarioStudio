import React from 'react';
import LogoMark from './LogoMark';
import { useLang } from '../i18n/LanguageContext';

export const Footer = () => {
  const { t } = useLang();

  return (
    <footer data-testid="site-footer" className="bg-[#2B2E2A] text-[#F4F1ED] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p
          data-testid="footer-tagline"
          className="h-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight max-w-4xl"
        >
          {t.footer.tagline}
        </p>
        <p
          data-testid="footer-tagline-translation"
          className="mt-4 text-sm md:text-base text-[#EFEAE2]/60 italic"
        >
          {t.footer.taglineTranslation}
        </p>

        <div className="hairline mt-16 opacity-20" />

        <div className="mt-12 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <LogoMark size={44} variant="ripple" filled={false} stroke="#EFEAE2" accent="#7FA8A0" />
              <span className="font-serif text-2xl tracking-tight">Tranquilário</span>
            </div>
            <p className="mt-4 text-sm text-[#EFEAE2]/70 max-w-sm leading-relaxed">
              {t.footer.discipline}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[0.72rem] tracking-[0.24em] uppercase text-[#7FA8A0]">
              {t.footer.navTitle}
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[#EFEAE2]/80">
              <li><a href="#about" data-testid="footer-link-about" className="hover:text-white transition-colors">{t.nav.about}</a></li>
              <li><a href="#sessions" data-testid="footer-link-sessions" className="hover:text-white transition-colors">{t.nav.sessions}</a></li>
              <li><a href="#testimonials" data-testid="footer-link-testimonials" className="hover:text-white transition-colors">{t.nav.testimonials}</a></li>
              <li><a href="#contact" data-testid="footer-link-contact" className="hover:text-white transition-colors">{t.nav.contact}</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[0.72rem] tracking-[0.24em] uppercase text-[#7FA8A0]">
              {t.footer.contactTitle}
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[#EFEAE2]/80">
              <li>
                <a href="mailto:tranquilario@pm.me" data-testid="footer-email" className="hover:text-white transition-colors">
                  tranquilario@pm.me
                </a>
              </li>
              <li>
                <a href="tel:+491628761060" data-testid="footer-phone" className="hover:text-white transition-colors">
                  +49 162 876 1060
                </a>
              </li>
              <li className="text-[#EFEAE2]/60 leading-relaxed">
                {t.footer.locations}
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-16 opacity-20" />
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#EFEAE2]/50">
          <span data-testid="footer-rights">{t.footer.rights}</span>
          <span className="tracking-[0.2em] uppercase">Tranquilário Studio</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
