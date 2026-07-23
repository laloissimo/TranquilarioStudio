import React from 'react';
import LogoMark from './LogoMark';

const messages = [
  { lang: 'en', text: 'We're making some improvements. Back soon.' },
  { lang: 'de', text: 'Wir arbeiten an etwas Neuem. Bald zurück.' },
  { lang: 'it', text: 'Stiamo apportando alcuni miglioramenti. Torniamo presto.' },
  { lang: 'pt', text: 'Estamos a fazer melhorias. Voltamos em breve.' },
];

export default function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F4F1ED',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: '#4A5D4E',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <LogoMark size={72} variant="ripple" filled />

      <p
        style={{
          marginTop: '2.5rem',
          fontSize: '0.72rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#5E8B82',
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 500,
        }}
      >
        Tranquilário Studio
      </p>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {messages.map(({ lang, text }) => (
          <p
            key={lang}
            lang={lang}
            style={{
              margin: 0,
              fontSize: lang === 'en' ? '1.55rem' : '1.2rem',
              fontWeight: lang === 'en' ? 400 : 300,
              lineHeight: 1.5,
              opacity: lang === 'en' ? 1 : 0.65,
            }}
          >
            {text}
          </p>
        ))}
      </div>

      <div
        style={{
          marginTop: '3.5rem',
          width: '32px',
          height: '1px',
          background: '#4A5D4E',
          opacity: 0.25,
        }}
      />
    </div>
  );
}
