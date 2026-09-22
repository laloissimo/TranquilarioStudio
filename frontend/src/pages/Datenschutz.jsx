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

const Section = ({ title, children }) => (
  <section style={{ marginBottom: 36 }}>
    {title && (
      <h2 style={{
        fontFamily: "'Cormorant Garamond',Georgia,serif",
        fontSize: 20, fontWeight: 500, color: C.green,
        margin: '0 0 10px', lineHeight: 1.3,
      }}>
        {title}
      </h2>
    )}
    <div style={{ fontSize: 15, color: C.ink, lineHeight: 1.9, margin: 0 }}>
      {children}
    </div>
  </section>
);

export default function Datenschutz() {
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
            Datenschutzerklärung
          </h1>
          <p style={{
            fontSize: 13, color: C.inkSoft, marginTop: 8,
            letterSpacing: '0.04em', lineHeight: 1.5,
          }}>
            Gemäß DSGVO (EU) 2016/679
          </p>
        </header>

        <div style={{ height: 1, background: C.hairline, marginBottom: 40 }} />

        <Section title="Verantwortlicher">
          Hilario Porto Gonçalves<br />
          Bächelhurst 30<br />
          79249 Merzhausen<br />
          Deutschland<br />
          E-Mail:{' '}
          <a href="mailto:lalo@tranquilario.com" style={{ color: C.teal, textDecoration: 'none' }}>
            lalo@tranquilario.com
          </a>
        </Section>

        <div style={{ height: 1, background: C.hairline, marginBottom: 36 }} />

        <Section title="Welche Daten wir erheben">
          Im Rahmen des Kontaktformulars werden folgende Daten erhoben:
          <ul style={{ marginTop: 10, paddingLeft: 20, lineHeight: 2 }}>
            <li>Vorname und Nachname</li>
            <li>E-Mail-Adresse</li>
            <li>Telefonnummer (optional)</li>
            <li>Nachricht bzw. Anliegen</li>
            <li>Wie Sie auf uns aufmerksam wurden (optional)</li>
          </ul>
          Die Angabe dieser Daten erfolgt freiwillig. Ohne Name und E-Mail-Adresse ist eine Beantwortung Ihrer Anfrage jedoch nicht möglich.
        </Section>

        <Section title="Zweck der Verarbeitung">
          Die von Ihnen übermittelten Daten werden ausschließlich zur Bearbeitung und Beantwortung Ihrer Anfrage verwendet. Eine Nutzung für Marketingzwecke oder die Weitergabe an Dritte für kommerzielle Zwecke findet nicht statt.
        </Section>

        <Section title="Rechtsgrundlage">
          Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Verarbeitung zur Durchführung vorvertraglicher Maßnahmen auf Anfrage der betroffenen Person).
        </Section>

        <Section title="Speicherdauer">
          Ihre Daten werden nur so lange gespeichert, wie es zur Bearbeitung Ihrer Anfrage erforderlich ist. Nach abschließender Bearbeitung werden die Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </Section>

        <Section title="Weitergabe an Dritte">
          Ihre Daten werden grundsätzlich nicht an Dritte weitergegeben. Zur technischen Übermittlung von E-Mails setzen wir den Dienst{' '}
          <strong>Resend</strong> (Resend Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA) ein. Die Übermittlung erfolgt ausschließlich zum Zweck der Zustellung Ihrer Anfrage und ist auf die dafür notwendigen Daten beschränkt. Resend verarbeitet diese Daten gemäß seiner eigenen Datenschutzrichtlinie.
        </Section>

        <div style={{ height: 1, background: C.hairline, marginBottom: 36 }} />

        <Section title="Ihre Rechte">
          Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:
          <ul style={{ marginTop: 10, paddingLeft: 20, lineHeight: 2 }}>
            <li><strong>Auskunft</strong> – Sie können Auskunft über die bei uns gespeicherten Daten verlangen.</li>
            <li><strong>Berichtigung</strong> – Sie können die Berichtigung unrichtiger Daten verlangen.</li>
            <li><strong>Löschung</strong> – Sie können die Löschung Ihrer Daten verlangen, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
            <li><strong>Einschränkung</strong> – Sie können die Einschränkung der Verarbeitung verlangen.</li>
            <li><strong>Widerspruch</strong> – Sie können der Verarbeitung Ihrer Daten widersprechen.</li>
            <li><strong>Datenübertragbarkeit</strong> – Sie können die Übermittlung Ihrer Daten in einem gängigen Format verlangen.</li>
          </ul>
          Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{' '}
          <a href="mailto:lalo@tranquilario.com" style={{ color: C.teal, textDecoration: 'none' }}>
            lalo@tranquilario.com
          </a>
        </Section>

        <Section title="Beschwerderecht">
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Die zuständige Aufsichtsbehörde für Baden-Württemberg ist der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg.
        </Section>

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
