import React, { useEffect, useState } from 'react';
import LanguageToggle from './LanguageToggle';
import LogoMark from './LogoMark';
import { useLang } from '../i18n/LanguageContext';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#home', key: 'home' },
  { href: '#about', key: 'about' },
  { href: '#sessions', key: 'sessions' },
  { href: '#testimonials', key: 'testimonials' },
  { href: '#contact', key: 'contact' },
];

export const Navbar = () => {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#F4F1ED]/85 backdrop-blur-xl border-b border-hairline'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <a href="#home" data-testid="nav-logo" className="flex items-center gap-3 group">
          <LogoMark size={46} className="shrink-0" />
          <span className="flex flex-col leading-tight">
            <span
              className={`font-serif text-xl sm:text-2xl tracking-tight transition-colors duration-500 ${
                scrolled ? 'text-ink' : 'text-[#F4F1ED]'
              }`}
            >
              Tranquilário
            </span>
            <span
              className={`hidden sm:inline-block mt-[3px] text-[10px] tracking-[0.24em] uppercase transition-colors duration-500 ${
                scrolled ? 'text-turquoise' : 'text-[#7FA8A0]'
              }`}
            >
              Thai Massage · Alexander · Body Awareness
            </span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              data-testid={`nav-link-${l.key}`}
              className={`text-[0.82rem] tracking-[0.16em] uppercase transition-colors duration-300 ${
                scrolled ? 'text-ink-soft hover:text-earth' : 'text-[#EFEAE2]/80 hover:text-white'
              }`}
            >
              {t.nav[l.key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            data-testid="nav-cta-button"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-earth text-[#F4F1ED] px-5 py-2.5 text-[0.78rem] tracking-[0.18em] uppercase hover:bg-earth-deep transition-all duration-300 hover:-translate-y-[1px]"
          >
            {t.nav.cta}
          </a>
          <LanguageToggle />
          <button
            type="button"
            data-testid="mobile-menu-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 text-ink"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          data-testid="mobile-menu"
          className="md:hidden bg-[#F4F1ED]/95 backdrop-blur-xl border-t border-hairline px-6 py-6"
        >
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <a
                key={l.key}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                data-testid={`mobile-nav-link-${l.key}`}
                className="text-sm tracking-[0.16em] uppercase text-ink-soft hover:text-earth"
              >
                {t.nav[l.key]}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              data-testid="mobile-nav-cta"
              className="mt-3 inline-flex w-max rounded-full bg-earth text-[#F4F1ED] px-5 py-2.5 text-[0.78rem] tracking-[0.18em] uppercase"
            >
              {t.nav.cta}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
