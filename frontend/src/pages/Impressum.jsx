import React from 'react';
import LogoMark from '../components/LogoMark';

const C = {
  sand:    '#F4F1ED',
  green:   '#4A5D4E',
  teal:    '#5E8B82',
  ink:     '#2B2E2A',
  inkSoft: '#5C605A',
  hairline:'rgba(74,93,78,0.14)',
};

export default function Impressum() {
  return (
    <div style={{
      minHeight: '100vh', background: C.sand,
      fontFamily: "'Manrope',sans-serif", color: C.ink,
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Back link */}
        <div style={{ paddingTop: 40, paddingBottom: 32 }}>
          <a
            href="/lalo"
            style={{
              fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: C.teal, textDecoration: 'none', fontWeight: 500,
            }}
          >
            ← Tranquilário Studio
          </a>
        </div>

        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <LogoMark variant="ripple" size={36} stroke={C.green} accent={C.teal} filled />
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 36, fontWeight: 400, color: C.ink,
            margin: 0, lineHeight: 1.2,
          }}>
            Impressum
          </h1>
          <p style={{
            fontSize: 13, color: C.inkSoft, marginTop: 8,
            letterSpacing: '0.04em', lineHeight: 1.5,
          }}>
            Angaben gemäß § 5 DDG
          </p>
        </header>

        <div style={{ height: 1, background: C.hairline, marginBottom: 40 }} />

        {/* Anbieter */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 20, fontWeight: 500, color: C.green,
            margin: '0 0 10px', lineHeight: 1.3,
          }}>
            Tranquilario Studio
          </h2>
          <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.9, margin: 0 }}>
            Inhaber: Hilario Porto Gonçalves<br />
            Bächelhurst 30<br />
            79249 Merzhausen<br />
            Deutschland
          </p>
        </section>

        {/* Kontakt */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 20, fontWeight: 500, color: C.green,
            margin: '0 0 10px', lineHeight: 1.3,
          }}>
            Kontakt
          </h2>
          <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.9, margin: 0 }}>
            E-Mail:{' '}
            <a
              href="mailto:lalo@tranquilario.com"
              style={{ color: C.teal, textDecoration: 'none' }}
            >
              lalo@tranquilario.com
            </a>
          </p>
        </section>

        {/* Tätigkeit */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 20, fontWeight: 500, color: C.green,
            margin: '0 0 10px', lineHeight: 1.3,
          }}>
            Tätigkeit
          </h2>
          <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.9, margin: 0 }}>
            Wellnessmassagen, Alexander-Technik, Körperarbeit
          </p>
        </section>

        {/* Steuer */}
        <section style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.9, margin: 0 }}>
            Kleinunternehmer gemäß § 19 UStG
          </p>
        </section>

        <div style={{ height: 1, background: C.hairline, margin: '8px 0 36px' }} />

        {/* Verantwortlich */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 20, fontWeight: 500, color: C.green,
            margin: '0 0 10px', lineHeight: 1.3,
          }}>
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.9, margin: 0 }}>
            Hilario Porto Gonçalves<br />
            Bächelhurst 30, 79249 Merzhausen
          </p>
        </section>

        {/* Footer */}
        <div style={{
          marginTop: 60, fontSize: 11, color: C.inkSoft,
          letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center',
        }}>
          Tranquilário Studio · Merzhausen
        </div>
      </div>
    </div>
  );
}
