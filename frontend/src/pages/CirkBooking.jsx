import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import LogoMark from '../components/LogoMark';

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  sand:    '#F4F1ED',
  green:   '#4A5D4E',
  greenDp: '#3A4A3E',
  teal:    '#5E8B82',
  ink:     '#2B2E2A',
  inkSoft: '#5C605A',
  hairline:'rgba(74,93,78,0.14)',
  white:   '#FFFFFF',
};

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  it: {
    festival:    'Cirk Fantastik · Firenze 2026',
    subtitle:    'Thai Massage & Alexander Technique',
    tapToBook:   'Tocca per prenotare',
    bookedLabel: '— prenotato',
    formName:    'Nome',
    formWa:      'WhatsApp (es. +39 333 …)',
    terms:       'Accetto i',
    termsLink:   'termini e condizioni',
    confirm:     'Conferma prenotazione',
    confirming:  'Conferma in corso…',
    thankTitle:  'Prenotato!',
    thankMsg:    (n, time, date) => `Grazie ${n} — ti aspetto ${time} il ${date}.`,
    calendar:    'Aggiungi al calendario',
    errRequired: 'Compila tutti i campi e accetta i termini.',
    errTaken:    'Questo orario è appena stato prenotato.',
    errGeneric:  'Qualcosa è andato storto. Riprova.',
    loading:     'Caricamento…',
    days: { thu:'Giovedì', fri:'Venerdì', sat:'Sabato', sun:'Domenica' },
    dates:{ thu:'3 set 2026', fri:'4 set 2026', sat:'5 set 2026', sun:'6 set 2026' },
  },
  en: {
    festival:    'Cirk Fantastik · Florence 2026',
    subtitle:    'Thai Massage & Alexander Technique',
    tapToBook:   'Tap to book',
    bookedLabel: '— booked',
    formName:    'First name',
    formWa:      'WhatsApp (e.g. +1 647 …)',
    terms:       'I agree to the',
    termsLink:   'terms & conditions',
    confirm:     'Confirm booking',
    confirming:  'Confirming…',
    thankTitle:  'Booked!',
    thankMsg:    (n, time, date) => `Thank you ${n} — see you at ${time} on ${date}.`,
    calendar:    'Add to calendar',
    errRequired: 'Please fill all fields and accept the terms.',
    errTaken:    'Sorry, this slot was just taken.',
    errGeneric:  'Something went wrong. Please try again.',
    loading:     'Loading…',
    days: { thu:'Thursday', fri:'Friday', sat:'Saturday', sun:'Sunday' },
    dates:{ thu:'Sep 3, 2026', fri:'Sep 4, 2026', sat:'Sep 5, 2026', sun:'Sep 6, 2026' },
  },
  fr: {
    festival:    'Cirk Fantastik · Florence 2026',
    subtitle:    'Massage Thaï & Technique Alexander',
    tapToBook:   'Appuyer pour réserver',
    bookedLabel: '— réservé',
    formName:    'Prénom',
    formWa:      'WhatsApp (ex. +33 6 …)',
    terms:       "J'accepte les",
    termsLink:   "termes et conditions",
    confirm:     'Confirmer',
    confirming:  'Confirmation…',
    thankTitle:  'Réservé !',
    thankMsg:    (n, time, date) => `Merci ${n} — à ${time} le ${date}.`,
    calendar:    'Ajouter au calendrier',
    errRequired: 'Veuillez remplir tous les champs et accepter les conditions.',
    errTaken:    'Ce créneau vient d\'être pris.',
    errGeneric:  'Une erreur s\'est produite. Veuillez réessayer.',
    loading:     'Chargement…',
    days: { thu:'Jeudi', fri:'Vendredi', sat:'Samedi', sun:'Dimanche' },
    dates:{ thu:'3 sept 2026', fri:'4 sept 2026', sat:'5 sept 2026', sun:'6 sept 2026' },
  },
};

const DAY_ORDER = ['thu', 'fri', 'sat', 'sun'];

// slot_id → { day, time }
const SLOT_META = {
  thu_10:{day:'thu',time:'10:00'}, thu_12:{day:'thu',time:'12:00'},
  thu_15:{day:'thu',time:'15:00'}, thu_17:{day:'thu',time:'17:00'},
  fri_10:{day:'fri',time:'10:00'}, fri_12:{day:'fri',time:'12:00'},
  fri_15:{day:'fri',time:'15:00'}, fri_17:{day:'fri',time:'17:00'},
  sat_10:{day:'sat',time:'10:00'}, sat_12:{day:'sat',time:'12:00'},
  sat_15:{day:'sat',time:'15:00'}, sat_17:{day:'sat',time:'17:00'},
  sun_10:{day:'sun',time:'10:00'}, sun_12:{day:'sun',time:'12:00'},
  sun_15:{day:'sun',time:'15:00'}, sun_17:{day:'sun',time:'17:00'},
};

// date strings for ICS (YYYYMMDD)
const ICS_DATE = { thu:'20260903', fri:'20260904', sat:'20260905', sun:'20260906' };

function downloadICS(slotId) {
  const { day, time } = SLOT_META[slotId];
  const [hh, mm] = time.split(':');
  const endHH = String(parseInt(hh) + 1).padStart(2, '0');
  const dtBase = ICS_DATE[day];
  const dtStart = `${dtBase}T${hh}${mm}00`;
  const dtEnd   = `${dtBase}T${endHH}${mm}00`;
  const uid = `${slotId}-2026@tranquilario.com`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tranquilario Studio//CirkFantastik2026//IT',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStart}`,
    `DTSTART;TZID=Europe/Rome:${dtStart}`,
    `DTEND;TZID=Europe/Rome:${dtEnd}`,
    'SUMMARY:Sessione Thai Massage — Lalo Porto',
    'DESCRIPTION:Thai Massage & Alexander Technique\\nCirk Fantastik 2026\\nFirenze',
    'LOCATION:Cirk Fantastik\\, Firenze',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `tranquilario-${slotId}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── SlotCard ──────────────────────────────────────────────────────────────────
function SlotCard({ slot, lang, expanded, onExpand, onBooked }) {
  const t = T[lang];
  const { slot_id, time, status, first_name } = slot;
  const isBooked    = status === 'booked';
  const isExpanded  = expanded === slot_id;
  const [form, setForm]       = useState({ firstName: '', whatsapp: '', terms: false });
  const [submitting, setSub]  = useState(false);
  const [error, setError]     = useState(null);
  const [confirmed, setConf]  = useState(null); // first_name when confirmed locally

  // Reset form when card collapses
  useEffect(() => {
    if (!isExpanded) {
      setForm({ firstName: '', whatsapp: '', terms: false });
      setError(null);
    }
  }, [isExpanded]);

  const handleConfirm = async () => {
    if (!form.firstName.trim() || !form.whatsapp.trim() || !form.terms) {
      setError(t.errRequired);
      return;
    }
    setSub(true);
    setError(null);
    try {
      await axios.post(`/api/cirk/book`, {
        slot_id:    slot_id,
        first_name: form.firstName.trim(),
        whatsapp:   form.whatsapp.trim(),
      });
      const name = form.firstName.trim();
      setConf(name);
      onBooked(slot_id, name);
    } catch (err) {
      if (err.response?.status === 409) setError(t.errTaken);
      else setError(t.errGeneric);
    } finally {
      setSub(false);
    }
  };

  const meta     = SLOT_META[slot_id];
  const dayLabel = t.dates[meta.day];

  // ── Confirmed state ──────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div style={{
        background: C.green, borderRadius: 14, padding: '20px 20px',
        marginBottom: 10, color: C.sand,
      }}>
        <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize: 20, fontWeight: 500, marginBottom: 4 }}>
          {t.thankTitle} — {time}
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 16, lineHeight: 1.5 }}>
          {t.thankMsg(confirmed, time, dayLabel)}
        </div>
        <button
          onClick={() => downloadICS(slot_id)}
          style={{
            background: 'transparent', border: `1.5px solid ${C.sand}`, borderRadius: 8,
            color: C.sand, fontFamily:"'Manrope',sans-serif", fontSize: 12,
            letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          {t.calendar}
        </button>
      </div>
    );
  }

  // ── Booked state ─────────────────────────────────────────────────────────
  if (isBooked) {
    return (
      <div style={{
        background: C.white, borderRadius: 14, padding: '16px 20px',
        marginBottom: 10, border: `1px solid ${C.hairline}`,
        opacity: 0.55, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize: 18, color: C.ink }}>
          {time}
        </span>
        <span style={{ fontSize: 13, color: C.inkSoft }}>
          {first_name} {t.bookedLabel}
        </span>
      </div>
    );
  }

  // ── Available state ───────────────────────────────────────────────────────
  return (
    <div style={{
      background: C.white, borderRadius: 14, marginBottom: 10,
      border: `1px solid ${isExpanded ? C.teal : C.hairline}`,
      transition: 'border-color 0.2s',
      overflow: 'hidden',
    }}>
      {/* Header row */}
      <button
        onClick={() => onExpand(isExpanded ? null : slot_id)}
        style={{
          width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '16px 20px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', textAlign: 'left',
        }}
      >
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize: 22, color: C.ink, fontWeight: 400 }}>
            {time}
          </div>
          <div style={{ fontSize: 11, color: C.teal, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
            {t.tapToBook}
          </div>
        </div>
        <span style={{
          width: 28, height: 28, borderRadius: '50%', background: isExpanded ? C.green : '#F0EDE9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s', flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d={isExpanded ? 'M2 8L6 4L10 8' : 'M2 4L6 8L10 4'}
              stroke={isExpanded ? C.sand : C.inkSoft}
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Expandable form */}
      {isExpanded && (
        <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${C.hairline}` }}>
          <div style={{ height: 16 }} />

          <input
            type="text"
            placeholder={t.formName}
            value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            style={inputStyle}
          />

          <input
            type="tel"
            placeholder={t.formWa}
            value={form.whatsapp}
            onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
            style={{ ...inputStyle, marginTop: 10 }}
          />

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 14, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.terms}
              onChange={e => setForm(f => ({ ...f, terms: e.target.checked }))}
              style={{ marginTop: 2, accentColor: C.green, width: 16, height: 16, flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.5 }}>
              {t.terms}{' '}
              <a href="/cirkterms" target="_blank" rel="noreferrer" style={{ color: C.teal, textDecoration: 'underline' }}>
                {t.termsLink}
              </a>
            </span>
          </label>

          {error && (
            <div style={{ fontSize: 12, color: '#c0392b', marginTop: 10, lineHeight: 1.4 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={submitting}
            style={{
              marginTop: 16, width: '100%', background: submitting ? C.inkSoft : C.green,
              color: C.sand, border: 'none', borderRadius: 10, padding: '14px 0',
              fontFamily: "'Manrope',sans-serif", fontSize: 13, letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {submitting ? t.confirming : t.confirm}
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: '#F8F5F1', border: '1px solid rgba(74,93,78,0.2)',
  borderRadius: 9, padding: '12px 14px',
  fontFamily: "'Manrope',sans-serif", fontSize: 14, color: '#2B2E2A',
  outline: 'none',
};

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CirkBooking() {
  const detectLang = () => {
    try {
      const s = localStorage.getItem('tranq_lang');
      if (s && ['it','en','fr'].includes(s)) return s;
    } catch (_) {}
    const raw = (navigator.languages?.[0] || navigator.language || '').toLowerCase();
    if (raw.startsWith('fr')) return 'fr';
    if (raw.startsWith('it')) return 'it';
    return 'it'; // Italian default
  };

  const [lang, setLang]       = useState(detectLang);
  const [slots, setSlots]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/cirk/slots`);
      setSlots(res.data);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const changeLang = (l) => {
    setLang(l);
    try { localStorage.setItem('tranq_lang', l); } catch (_) {}
  };

  // Optimistically mark a slot as booked in local state
  const handleBooked = (slotId, firstName) => {
    setSlots(prev => prev.map(s =>
      s.slot_id === slotId ? { ...s, status: 'booked', first_name: firstName } : s
    ));
    setExpanded(null);
  };

  const t = T[lang];

  // Group slots by day
  const byDay = {};
  (slots || []).forEach(s => {
    const { day } = SLOT_META[s.slot_id];
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(s);
  });

  return (
    <div style={{
      minHeight: '100vh', background: C.sand, fontFamily: "'Manrope',sans-serif",
      color: C.ink, overscrollBehavior: 'none',
    }}>
      {/* Max-width container */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 20px 60px' }}>

        {/* Language toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20, paddingBottom: 4 }}>
          {['it','en','fr'].map(l => (
            <button
              key={l}
              onClick={() => changeLang(l)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 8px', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: lang === l ? C.green : C.inkSoft,
                borderBottom: lang === l ? `2px solid ${C.teal}` : '2px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* ── Header ── */}
        <header style={{ textAlign: 'center', paddingTop: 28, paddingBottom: 36 }}>
          <LogoMark variant="ripple" size={56} stroke={C.green} accent={C.teal} filled />

          <div style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 28, fontWeight: 400, letterSpacing: '0.01em',
            color: C.ink, marginTop: 18, lineHeight: 1.25,
          }}>
            {t.festival}
          </div>

          <div style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 19, fontWeight: 300, color: C.inkSoft,
            marginTop: 6, letterSpacing: '0.01em',
          }}>
            Lalo Porto
          </div>

          <div style={{
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: C.teal, marginTop: 5,
          }}>
            {t.subtitle}
          </div>

          {/* Contact bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 22 }}>
            <a
              href="https://wa.me/16475391744"
              target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: C.green, color: C.sand, borderRadius: 22,
                padding: '9px 18px', fontSize: 12, fontWeight: 600,
                letterSpacing: '0.05em', textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
            <a
              href="mailto:lalo@tranquilario.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'transparent', color: C.green,
                border: `1.5px solid ${C.green}`, borderRadius: 22,
                padding: '9px 18px', fontSize: 12, fontWeight: 600,
                letterSpacing: '0.05em', textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              Email
            </a>
          </div>
        </header>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: C.hairline, marginBottom: 32 }} />

        {/* ── Slot grid ── */}
        {loading ? (
          <div style={{ textAlign: 'center', color: C.inkSoft, paddingTop: 40, fontSize: 14 }}>
            {t.loading}
          </div>
        ) : (
          DAY_ORDER.map(day => {
            const daySlots = byDay[day] || [];
            if (!daySlots.length) return null;
            return (
              <section key={day} style={{ marginBottom: 32 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond',Georgia,serif",
                    fontSize: 22, fontWeight: 500, color: C.ink,
                  }}>
                    {t.days[day]}
                  </div>
                  <div style={{
                    fontSize: 11, color: C.inkSoft, letterSpacing: '0.12em',
                    textTransform: 'uppercase', marginTop: 2,
                  }}>
                    {t.dates[day]}
                  </div>
                </div>

                {daySlots.map(slot => (
                  <SlotCard
                    key={slot.slot_id}
                    slot={slot}
                    lang={lang}
                    expanded={expanded}
                    onExpand={setExpanded}
                    onBooked={handleBooked}
                  />
                ))}
              </section>
            );
          })
        )}

        {/* ── Footer ── */}
        <div style={{
          textAlign: 'center', paddingTop: 20,
          fontSize: 11, color: C.inkSoft, letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Tranquilário Studio · lalo@tranquilario.com
        </div>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.524 5.854L.058 23.5 6 22c1.65.9 3.538 1.41 5.541 1.41C18.627 23.41 24 18.037 24 11.41S18.627 0 12 0zm0 21.41c-1.84 0-3.564-.493-5.047-1.353l-.362-.213-3.74.98.997-3.644-.236-.374A9.387 9.387 0 0 1 2.59 11.41C2.59 6.463 6.953 2.1 12 2.1s9.41 4.363 9.41 9.31-4.363 9.31-9.41 9.31z" fillRule="nonzero"/>
    </svg>
  );
}
