import React, { useState } from 'react';
import LogoMark from '../components/LogoMark';

const C = {
  sand:    '#F4F1ED',
  green:   '#4A5D4E',
  greenDp: '#3A4A3E',
  teal:    '#5E8B82',
  ink:     '#2B2E2A',
  inkSoft: '#5C605A',
  hairline:'rgba(74,93,78,0.14)',
};

const T = {
  it: {
    back:     '← Torna alla prenotazione',
    title:    'Termini e Condizioni',
    subtitle: 'Sedute di Thai Massage & Alexander Technique',
    festival: 'Cirk Fantastik · Firenze 2026',
    sections: [
      {
        heading: 'Consenso al lavoro corporeo',
        body: 'Prenotando una seduta confermo di dare il mio consenso informato a ricevere lavoro corporeo basato sul tocco. Comprendo che posso interrompere o terminare la seduta in qualsiasi momento, senza necessità di fornire spiegazioni.',
      },
      {
        heading: 'Natura complementare della pratica',
        body: 'Il Thai Massage e la Alexander Technique sono pratiche di benessere complementari. Non sostituiscono diagnosi, trattamenti medici o terapeutici. In caso di dubbi sulla mia salute, mi impegno a consultare un medico prima della seduta.',
      },
      {
        heading: 'Informazioni sulla salute',
        body: 'Mi impegno a comunicare al professionista eventuali condizioni di salute rilevanti (gravidanza, problemi cardiaci, pressione alta, vene varicose, infortuni recenti o operazioni) prima dell\'inizio della seduta. Esonero il professionista da responsabilità per reazioni avverse derivanti da informazioni non divulgate.',
      },
      {
        heading: 'Disdetta e assenza',
        body: 'In caso di impedimento, ti chiedo gentilmente di avvisarmi via WhatsApp con il maggior anticipo possibile. Questo permette di offrire lo spazio a un\'altra persona. Non è prevista alcuna penale, ma la comunicazione tempestiva è apprezzata.',
      },
      {
        heading: 'Riservatezza',
        body: 'Le informazioni personali condivise durante o prima della seduta restano strettamente confidenziali e non vengono condivise con terzi.',
      },
    ],
    contact: 'Domande? Scrivimi via WhatsApp o email.',
  },
  en: {
    back:     '← Back to booking',
    title:    'Terms & Conditions',
    subtitle: 'Thai Massage & Alexander Technique Sessions',
    festival: 'Cirk Fantastik · Florence 2026',
    sections: [
      {
        heading: 'Consent to bodywork',
        body: 'By booking a session I confirm my informed consent to receive touch-based bodywork. I understand that I may pause or stop the session at any time, without needing to provide any explanation.',
      },
      {
        heading: 'Complementary nature of the practice',
        body: 'Thai Massage and the Alexander Technique are complementary wellbeing practices. They do not replace medical diagnosis or treatment. If I have any doubts about my health, I will consult a doctor before the session.',
      },
      {
        heading: 'Health information',
        body: 'I agree to disclose any relevant health conditions (pregnancy, heart conditions, high blood pressure, varicose veins, recent injuries or surgery) before the session begins. I release the practitioner from liability for adverse reactions arising from undisclosed health information.',
      },
      {
        heading: 'Cancellation & no-show',
        body: 'If you are unable to attend, please let me know via WhatsApp as early as possible. This allows the slot to be offered to someone else. There is no penalty, but timely communication is genuinely appreciated.',
      },
      {
        heading: 'Confidentiality',
        body: 'Any personal information shared before or during a session is kept strictly confidential and is not shared with third parties.',
      },
    ],
    contact: 'Questions? Reach me via WhatsApp or email.',
  },
  fr: {
    back:     '← Retour à la réservation',
    title:    'Termes et Conditions',
    subtitle: 'Séances de Massage Thaï & Technique Alexander',
    festival: 'Cirk Fantastik · Florence 2026',
    sections: [
      {
        heading: 'Consentement au travail corporel',
        body: 'En réservant une séance, je confirme mon consentement éclairé à recevoir un travail corporel basé sur le toucher. Je comprends que je peux interrompre ou mettre fin à la séance à tout moment, sans avoir à fournir d\'explications.',
      },
      {
        heading: 'Nature complémentaire de la pratique',
        body: 'Le Massage Thaï et la Technique Alexander sont des pratiques de bien-être complémentaires. Elles ne remplacent pas un diagnostic ou un traitement médical. En cas de doute sur mon état de santé, je consulterai un médecin avant la séance.',
      },
      {
        heading: 'Informations de santé',
        body: 'Je m\'engage à communiquer au praticien toute condition de santé pertinente (grossesse, problèmes cardiaques, hypertension, varices, blessures ou opérations récentes) avant le début de la séance. Je dégage le praticien de toute responsabilité pour des réactions indésirables dues à des informations non divulguées.',
      },
      {
        heading: 'Annulation et absence',
        body: 'En cas d\'empêchement, merci de me prévenir via WhatsApp le plus tôt possible. Cela permet de proposer le créneau à quelqu\'un d\'autre. Aucune pénalité n\'est prévue, mais une communication rapide est sincèrement appréciée.',
      },
      {
        heading: 'Confidentialité',
        body: 'Toute information personnelle partagée avant ou pendant une séance est strictement confidentielle et n\'est pas transmise à des tiers.',
      },
    ],
    contact: 'Des questions ? Contactez-moi via WhatsApp ou email.',
  },
};

export default function CirkTerms() {
  const detectLang = () => {
    try {
      const s = localStorage.getItem('tranq_lang');
      if (s && ['it', 'en', 'fr'].includes(s)) return s;
    } catch (_) {}
    const raw = (navigator.languages?.[0] || navigator.language || '').toLowerCase();
    if (raw.startsWith('fr')) return 'fr';
    if (raw.startsWith('it')) return 'it';
    return 'it';
  };

  const [lang, setLang] = useState(detectLang);
  const t = T[lang];

  const changeLang = (l) => {
    setLang(l);
    try { localStorage.setItem('tranq_lang', l); } catch (_) {}
  };

  return (
    <div style={{
      minHeight: '100vh', background: C.sand,
      fontFamily: "'Manrope',sans-serif", color: C.ink,
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Lang toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
          {['it', 'en', 'fr'].map((l) => (
            <button
              key={l}
              onClick={() => changeLang(l)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 8px', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: lang === l ? C.green : C.inkSoft,
                borderBottom: lang === l ? `2px solid ${C.teal}` : '2px solid transparent',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Back link */}
        <div style={{ paddingTop: 8, paddingBottom: 32 }}>
          <a
            href="/cirk"
            style={{
              fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: C.teal, textDecoration: 'none', fontWeight: 500,
            }}
          >
            {t.back}
          </a>
        </div>

        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <LogoMark variant="ripple" size={40} stroke={C.green} accent={C.teal} filled />
            <div>
              <div style={{
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 13, color: C.inkSoft, letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                {t.festival}
              </div>
            </div>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 36, fontWeight: 400, color: C.ink,
            margin: 0, lineHeight: 1.2,
          }}>
            {t.title}
          </h1>
          <p style={{
            fontSize: 13, color: C.inkSoft, marginTop: 8,
            letterSpacing: '0.04em', lineHeight: 1.5,
          }}>
            {t.subtitle}
          </p>
        </header>

        {/* Divider */}
        <div style={{ height: 1, background: C.hairline, marginBottom: 40 }} />

        {/* Sections */}
        {t.sections.map((section, i) => (
          <section key={i} style={{ marginBottom: 36 }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 22, fontWeight: 500, color: C.green,
              margin: '0 0 10px', lineHeight: 1.3,
            }}>
              {section.heading}
            </h2>
            <p style={{
              fontSize: 15, color: C.ink, lineHeight: 1.75,
              margin: 0,
            }}>
              {section.body}
            </p>
          </section>
        ))}

        {/* Divider */}
        <div style={{ height: 1, background: C.hairline, margin: '40px 0 32px' }} />

        {/* Contact */}
        <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 24 }}>
          {t.contact}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a
            href="https://wa.me/16475391744"
            target="_blank" rel="noreferrer"
            style={{
              display: 'inline-block', background: C.green, color: C.sand,
              borderRadius: 20, padding: '8px 16px', fontSize: 12,
              fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            WhatsApp
          </a>
          <a
            href="mailto:lalo@tranquilario.com"
            style={{
              display: 'inline-block', background: 'transparent', color: C.green,
              border: `1.5px solid ${C.green}`, borderRadius: 20,
              padding: '8px 16px', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none',
            }}
          >
            Email
          </a>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 60, fontSize: 11, color: C.inkSoft,
          letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center',
        }}>
          Tranquilário Studio · Lalo Porto
        </div>
      </div>
    </div>
  );
}
