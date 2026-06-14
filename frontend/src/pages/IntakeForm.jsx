import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LogoMark from '../components/LogoMark';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const detectLang = () => {
  try {
    const saved = localStorage.getItem('tranq_lang');
    if (saved && ['en', 'de', 'it', 'pt'].includes(saved)) return saved;
  } catch (_) {}
  if (typeof navigator === 'undefined') return 'en';
  const raw = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  if (raw.startsWith('de')) return 'de';
  if (raw.startsWith('it')) return 'it';
  if (raw.startsWith('pt')) return 'pt';
  return 'en';
};

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  en: {
    back: '← Back to site',
    pageTitle: 'Client Intake Form & Liability Waiver',
    pageSubtitle: 'Please complete this form before your first session. Your information is treated with full confidentiality.',
    sPersonal: 'Personal Information',
    sHealth: 'Health & Medical History',
    sConsent: 'Consent & Disclaimer',
    sSignature: 'Signature',
    sConfirm: 'Confirmation',
    fullName: 'Full name',
    birthday: 'Date of birth (DD/MM/YYYY)',
    age: 'Age',
    phone: 'Phone / WhatsApp',
    email: 'Email',
    healthIntro: 'Please check any of the following that apply to you:',
    heartDisease: 'Heart disease',
    highBloodPressure: 'High blood pressure',
    varicoseVeins: 'Varicose veins',
    pregnant: 'Pregnant',
    recentInjuries: 'Recent injuries or surgeries (please describe)',
    otherComplaints: 'Other health complaints or relevant conditions',
    consentIntro: 'Please read and check each statement before submitting:',
    consent: [
      'I confirm that all information provided in this form is accurate and complete to the best of my knowledge.',
      'I understand that Thai Massage and Alexander Technique are complementary practices and not a substitute for medical treatment.',
      'I have disclosed all relevant health conditions, injuries, and medications that may affect my session.',
      'I give my informed consent to receive touch-based bodywork as part of my session.',
      'I understand that I may pause or stop the session at any time without obligation.',
      'I confirm that I am not under the influence of alcohol or recreational substances at the time of the session.',
      'I release the practitioner from liability for any adverse reactions arising from health information I have not disclosed.',
    ],
    sigInstruction: 'Please sign below using your finger or mouse.',
    clearSig: 'Clear signature',
    clientNameLabel: 'Full name (print)',
    dateLabel: 'Date',
    submit: 'Submit intake form',
    submitting: 'Sending…',
    success: 'Thank you — your intake form has been received. We will reach out to you shortly.',
    error: 'Something went wrong. Please try again or contact us directly.',
    allConsentsRequired: 'Please check all seven consent statements before submitting.',
    signatureRequired: 'Please provide your signature before submitting.',
  },
  de: {
    back: '← Zurück zur Website',
    pageTitle: 'Anmeldeformular & Haftungsausschluss',
    pageSubtitle: 'Bitte füllen Sie dieses Formular vor Ihrer ersten Sitzung aus. Ihre Angaben werden vollständig vertraulich behandelt.',
    sPersonal: 'Persönliche Informationen',
    sHealth: 'Gesundheit & Krankengeschichte',
    sConsent: 'Einwilligung & Haftungsausschluss',
    sSignature: 'Unterschrift',
    sConfirm: 'Bestätigung',
    fullName: 'Vollständiger Name',
    birthday: 'Geburtsdatum (TT/MM/JJJJ)',
    age: 'Alter',
    phone: 'Telefon / WhatsApp',
    email: 'E-Mail',
    healthIntro: 'Bitte kreuzen Sie alle zutreffenden Punkte an:',
    heartDisease: 'Herzerkrankung',
    highBloodPressure: 'Bluthochdruck',
    varicoseVeins: 'Krampfadern',
    pregnant: 'Schwanger',
    recentInjuries: 'Kürzliche Verletzungen oder Operationen (bitte beschreiben)',
    otherComplaints: 'Weitere Beschwerden oder relevante Erkrankungen',
    consentIntro: 'Bitte lesen und bestätigen Sie jeden Punkt vor dem Absenden:',
    consent: [
      'Ich bestätige, dass alle in diesem Formular angegebenen Informationen nach bestem Wissen und Gewissen korrekt und vollständig sind.',
      'Ich verstehe, dass Thai-Massage und Alexander-Technik ergänzende Praktiken sind und keine medizinische Behandlung ersetzen.',
      'Ich habe alle relevanten Erkrankungen, Verletzungen und Medikamente angegeben, die meine Sitzung beeinflussen könnten.',
      'Ich erteile meine informierte Einwilligung zur Durchführung berührungsbasierter Körperarbeit im Rahmen meiner Sitzung.',
      'Ich verstehe, dass ich die Sitzung jederzeit ohne Verpflichtung unterbrechen oder beenden kann.',
      'Ich bestätige, dass ich zum Zeitpunkt der Sitzung nicht unter dem Einfluss von Alkohol oder Freizeitsubstanzen stehe.',
      'Ich entbinde den Therapeuten von jeglicher Haftung für unerwünschte Reaktionen, die auf nicht offengelegte Gesundheitsinformationen zurückzuführen sind.',
    ],
    sigInstruction: 'Bitte unterschreiben Sie unten mit Finger oder Maus.',
    clearSig: 'Unterschrift löschen',
    clientNameLabel: 'Vollständiger Name (Druckschrift)',
    dateLabel: 'Datum',
    submit: 'Anmeldebogen absenden',
    submitting: 'Wird gesendet…',
    success: 'Vielen Dank — Ihr Anmeldebogen ist eingegangen. Wir werden uns in Kürze bei Ihnen melden.',
    error: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.',
    allConsentsRequired: 'Bitte bestätigen Sie alle sieben Einwilligungspunkte vor dem Absenden.',
    signatureRequired: 'Bitte leisten Sie Ihre Unterschrift vor dem Absenden.',
  },
  it: {
    back: '← Torna al sito',
    pageTitle: 'Modulo di Accoglienza & Liberatoria',
    pageSubtitle: 'Compila questo modulo prima della tua prima seduta. Le tue informazioni saranno trattate con la massima riservatezza.',
    sPersonal: 'Informazioni personali',
    sHealth: 'Salute e anamnesi',
    sConsent: 'Consenso e dichiarazione di esonero',
    sSignature: 'Firma',
    sConfirm: 'Conferma',
    fullName: 'Nome completo',
    birthday: 'Data di nascita (GG/MM/AAAA)',
    age: 'Età',
    phone: 'Telefono / WhatsApp',
    email: 'Email',
    healthIntro: 'Seleziona tutto ciò che si applica a te:',
    heartDisease: 'Malattia cardiaca',
    highBloodPressure: 'Pressione alta',
    varicoseVeins: 'Vene varicose',
    pregnant: 'In gravidanza',
    recentInjuries: 'Infortuni o interventi chirurgici recenti (descrivere)',
    otherComplaints: 'Altre problematiche di salute o condizioni rilevanti',
    consentIntro: 'Leggi e spunta ogni punto prima di inviare:',
    consent: [
      'Confermo che tutte le informazioni fornite in questo modulo sono accurate e complete al meglio delle mie conoscenze.',
      'Comprendo che il Massaggio Thai e la Tecnica Alexander sono pratiche complementari e non sostituiscono le cure mediche.',
      'Ho dichiarato tutte le condizioni di salute, gli infortuni e i farmaci rilevanti che potrebbero influenzare la mia seduta.',
      "Do il mio consenso informato a ricevere lavoro corporeo basato sul tocco nell'ambito della mia seduta.",
      'Comprendo che posso interrompere o terminare la seduta in qualsiasi momento senza obbligo.',
      "Confermo di non essere sotto l'influenza di alcol o sostanze ricreative al momento della seduta.",
      'Esonero il professionista da qualsiasi responsabilità per reazioni avverse derivanti da informazioni sanitarie che non ho divulgato.',
    ],
    sigInstruction: 'Firma qui sotto con il dito o il mouse.',
    clearSig: 'Cancella firma',
    clientNameLabel: 'Nome completo (stampatello)',
    dateLabel: 'Data',
    submit: 'Invia il modulo',
    submitting: 'Invio in corso…',
    success: 'Grazie — il tuo modulo è stato ricevuto. Ti contatteremo a breve.',
    error: 'Qualcosa è andato storto. Riprova o contattaci direttamente.',
    allConsentsRequired: 'Spunta tutti e sette i punti di consenso prima di inviare.',
    signatureRequired: 'Firma prima di inviare.',
  },
  pt: {
    back: '← Voltar ao site',
    pageTitle: 'Formulário de Cadastro & Termo de Responsabilidade',
    pageSubtitle: 'Por favor, preencha este formulário antes da sua primeira sessão. Suas informações são tratadas com total sigilo.',
    sPersonal: 'Informações pessoais',
    sHealth: 'Saúde e histórico médico',
    sConsent: 'Consentimento e Termo de Isenção',
    sSignature: 'Assinatura',
    sConfirm: 'Confirmação',
    fullName: 'Nome completo',
    birthday: 'Data de nascimento (DD/MM/AAAA)',
    age: 'Idade',
    phone: 'Telefone / WhatsApp',
    email: 'E-mail',
    healthIntro: 'Marque tudo que se aplica a você:',
    heartDisease: 'Doença cardíaca',
    highBloodPressure: 'Pressão alta',
    varicoseVeins: 'Varizes',
    pregnant: 'Grávida',
    recentInjuries: 'Lesões ou cirurgias recentes (descreva)',
    otherComplaints: 'Outras queixas de saúde ou condições relevantes',
    consentIntro: 'Leia e marque cada item antes de enviar:',
    consent: [
      'Confirmo que todas as informações fornecidas neste formulário são verdadeiras e completas conforme meu melhor conhecimento.',
      'Entendo que a Massagem Tailandesa e a Técnica Alexander são práticas complementares e não substituem tratamento médico.',
      'Informei todas as condições de saúde, lesões e medicamentos relevantes que possam afetar minha sessão.',
      'Dou meu consentimento informado para receber trabalho corporal com toque como parte da minha sessão.',
      'Entendo que posso pausar ou encerrar a sessão a qualquer momento, sem nenhuma obrigação.',
      'Confirmo que não estou sob efeito de álcool ou substâncias recreativas no momento da sessão.',
      'Isento o profissional de qualquer responsabilidade por reações adversas decorrentes de informações de saúde que não foram por mim divulgadas.',
    ],
    sigInstruction: 'Assine abaixo com o dedo ou o mouse.',
    clearSig: 'Limpar assinatura',
    clientNameLabel: 'Nome completo (letra de forma)',
    dateLabel: 'Data',
    submit: 'Enviar formulário',
    submitting: 'Enviando…',
    success: 'Obrigado — seu formulário foi recebido. Entraremos em contato em breve.',
    error: 'Algo deu errado. Tente novamente ou fale conosco diretamente.',
    allConsentsRequired: 'Marque todos os sete itens de consentimento antes de enviar.',
    signatureRequired: 'Por favor, assine antes de enviar.',
  },
};

// ── Signature canvas ──────────────────────────────────────────────────────────
function SignaturePad({ canvasRef, hasDrawn, setHasDrawn, clearLabel }) {
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.getContext('2d').scale(dpr, dpr);
  }, [canvasRef]);

  const xy = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return [src.clientX - rect.left, src.clientY - rect.top];
  };

  const onStart = (e) => {
    e.preventDefault();
    drawing.current = true;
    const [x, y] = xy(e, canvasRef.current);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onMove = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const [x, y] = xy(e, canvas);
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2B2E2A';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasDrawn(true);
  };

  const onStop = () => { drawing.current = false; };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        className="w-full rounded-xl border border-hairline bg-white cursor-crosshair touch-none"
        style={{ height: '140px' }}
        onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onStop} onMouseLeave={onStop}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onStop}
      />
      <button
        type="button"
        onClick={clear}
        className="text-[0.7rem] tracking-[0.2em] uppercase text-ink-soft/50 hover:text-ink-soft transition-colors"
      >
        {clearLabel}
      </button>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const todayDMY = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};

const SectionHeading = ({ children }) => (
  <h2 className="h-serif text-2xl md:text-3xl text-ink mt-10 mb-6">{children}</h2>
);

const Divider = () => <div className="hairline my-8 opacity-40" />;

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[0.7rem] tracking-[0.22em] uppercase text-ink-soft/80">
      {label}{required && ' *'}
    </label>
    {children}
  </div>
);

const inputCls = "w-full bg-transparent border-0 border-b border-hairline py-3 px-0.5 text-sm text-ink placeholder-ink-soft/30 focus:outline-none focus:border-turquoise transition-colors";
const textareaCls = `${inputCls} resize-none`;

const CheckRow = ({ checked, onChange, label }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border transition-colors flex items-center justify-center ${checked ? 'bg-earth border-earth' : 'border-hairline bg-white group-hover:border-turquoise'}`}>
      {checked && (
        <svg viewBox="0 0 10 8" className="w-2.5 h-2" fill="none">
          <path d="M1 4l2.5 2.5L9 1" stroke="#F4F1ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </span>
    <span className="text-sm text-ink-soft leading-relaxed">{label}</span>
  </label>
);

const PAGE_TITLES = {
  en: 'Client Intake & Liability Waiver — Tranquilário Studio',
  de: 'Anmeldeformular & Haftungsausschluss — Tranquilário Studio',
  it: 'Modulo di Accoglienza & Liberatoria — Tranquilário Studio',
  pt: 'Formulário de Cadastro & Termo de Responsabilidade — Tranquilário Studio',
};

// ── Main component ────────────────────────────────────────────────────────────
export default function IntakeForm() {
  const [lang, setLangState] = useState(detectLang);
  const t = T[lang];

  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem('tranq_lang', l); } catch (_) {}
  };

  useEffect(() => {
    document.title = PAGE_TITLES[lang] || 'Intake Form — Tranquilário Studio';
    return () => { document.title = 'Tranquilário Studio'; };
  }, [lang]);

  const [form, setForm] = useState({
    fullName: '', birthday: '', age: '', phone: '', email: '',
    heartDisease: false, highBloodPressure: false, varicoseVeins: false, pregnant: false,
    recentInjuries: '', otherComplaints: '',
    consent1: false, consent2: false, consent3: false, consent4: false,
    consent5: false, consent6: false, consent7: false,
    clientName: '', date: todayDMY(),
  });

  const [hasDrawn, setHasDrawn] = useState(false);
  const [validationMsg, setValidationMsg] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorDetail, setErrorDetail] = useState('');
  const canvasRef = useRef(null);

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationMsg('');

    const allConsented = [1,2,3,4,5,6,7].every(i => form[`consent${i}`]);
    if (!allConsented) { setValidationMsg(t.allConsentsRequired); return; }
    if (!hasDrawn)     { setValidationMsg(t.signatureRequired);   return; }

    setStatus('submitting');
    try {
      const signature = canvasRef.current.toDataURL('image/png');
      // Send undefined (omitted) for empty optional strings so pydantic
      // receives null rather than "", which would fail EmailStr validation.
      const str = (v) => v || undefined;
      await axios.post(`${BACKEND_URL}/api/intake`, {
        full_name: form.fullName,
        birthday: str(form.birthday),
        age: str(form.age),
        phone: str(form.phone),
        email: str(form.email),
        heart_disease: form.heartDisease,
        high_blood_pressure: form.highBloodPressure,
        varicose_veins: form.varicoseVeins,
        pregnant: form.pregnant,
        recent_injuries: str(form.recentInjuries),
        other_complaints: str(form.otherComplaints),
        client_name: str(form.fullName),
        submission_date: str(form.date),
        signature,
        language: lang,
      });
      setStatus('success');
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map(d => d.msg).join('; ')
        : detail || err?.message || 'Unknown error';
      console.error('Intake submission failed:', msg, err?.response?.data);
      setErrorDetail(msg);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-earth/10 flex items-center justify-center mb-6">
          <svg viewBox="0 0 20 20" className="w-5 h-5 text-earth" fill="none">
            <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="h-serif text-3xl md:text-4xl text-ink">{t.success}</h1>
        <Link to="/" className="mt-8 text-[0.72rem] tracking-[0.22em] uppercase text-turquoise hover:text-earth transition-colors">
          {t.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-[#3A4A3E] text-[#F4F1ED] px-6 lg:px-10 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <LogoMark size={36} variant="ripple" filled={false} stroke="#EFEAE2" accent="#7FA8A0" />
            <span className="font-serif text-xl tracking-tight">Tranquilário Studio</span>
          </Link>
          {/* Language selector */}
          <div className="flex items-center gap-1">
            {['en','de','it','pt'].map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded text-[0.65rem] tracking-[0.18em] uppercase transition-colors ${
                  lang === l
                    ? 'bg-[#F4F1ED]/15 text-[#F4F1ED]'
                    : 'text-[#F4F1ED]/50 hover:text-[#F4F1ED]/80'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-6 lg:px-0 py-14">
        <p className="overline">{t.sPersonal.split(' ')[0]}</p>
        <h1 className="h-serif text-4xl md:text-5xl text-ink mt-3">{t.pageTitle}</h1>
        <p className="mt-4 text-sm text-ink-soft leading-relaxed max-w-lg">{t.pageSubtitle}</p>

        <form onSubmit={handleSubmit} className="mt-10">
          {/* ── Personal info ── */}
          <div className="bg-white rounded-3xl border border-hairline p-8 md:p-10 shadow-[0_16px_48px_-24px_rgba(43,46,42,0.10)]">
            <SectionHeading>{t.sPersonal}</SectionHeading>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="sm:col-span-2">
                <Field label={t.fullName} required>
                  <input className={inputCls} value={form.fullName} onChange={set('fullName')} required placeholder="—" />
                </Field>
              </div>
              <Field label={t.birthday}>
                <input className={inputCls} value={form.birthday} onChange={set('birthday')} placeholder="DD/MM/YYYY" />
              </Field>
              <Field label={t.age}>
                <input className={inputCls} type="number" min="1" max="120" value={form.age} onChange={set('age')} placeholder="—" />
              </Field>
              <Field label={t.phone}>
                <input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="—" />
              </Field>
              <Field label={t.email}>
                <input className={inputCls} type="email" value={form.email} onChange={set('email')} placeholder="—" />
              </Field>
            </div>
          </div>

          {/* ── Health ── */}
          <div className="bg-white rounded-3xl border border-hairline p-8 md:p-10 mt-6 shadow-[0_16px_48px_-24px_rgba(43,46,42,0.10)]">
            <SectionHeading>{t.sHealth}</SectionHeading>
            <p className="text-[0.72rem] tracking-[0.18em] uppercase text-ink-soft/60 mb-5">{t.healthIntro}</p>
            <div className="space-y-4">
              <CheckRow checked={form.heartDisease}      onChange={set('heartDisease')}      label={t.heartDisease} />
              <CheckRow checked={form.highBloodPressure} onChange={set('highBloodPressure')} label={t.highBloodPressure} />
              <CheckRow checked={form.varicoseVeins}     onChange={set('varicoseVeins')}     label={t.varicoseVeins} />
              <CheckRow checked={form.pregnant}          onChange={set('pregnant')}          label={t.pregnant} />
            </div>
            <div className="mt-8 space-y-6">
              <Field label={t.recentInjuries}>
                <textarea className={textareaCls} rows={3} value={form.recentInjuries} onChange={set('recentInjuries')} placeholder="—" />
              </Field>
              <Field label={t.otherComplaints}>
                <textarea className={textareaCls} rows={3} value={form.otherComplaints} onChange={set('otherComplaints')} placeholder="—" />
              </Field>
            </div>
          </div>

          {/* ── Consent ── */}
          <div className="bg-white rounded-3xl border border-hairline p-8 md:p-10 mt-6 shadow-[0_16px_48px_-24px_rgba(43,46,42,0.10)]">
            <SectionHeading>{t.sConsent}</SectionHeading>
            <p className="text-[0.72rem] tracking-[0.18em] uppercase text-ink-soft/60 mb-6">{t.consentIntro}</p>
            <div className="space-y-5">
              {t.consent.map((statement, i) => (
                <CheckRow
                  key={i}
                  checked={form[`consent${i+1}`]}
                  onChange={set(`consent${i+1}`)}
                  label={statement}
                />
              ))}
            </div>
          </div>

          {/* ── Signature ── */}
          <div className="bg-white rounded-3xl border border-hairline p-8 md:p-10 mt-6 shadow-[0_16px_48px_-24px_rgba(43,46,42,0.10)]">
            <SectionHeading>{t.sSignature}</SectionHeading>
            <p className="text-sm text-ink-soft mb-5">{t.sigInstruction}</p>
            <SignaturePad
              canvasRef={canvasRef}
              hasDrawn={hasDrawn}
              setHasDrawn={setHasDrawn}
              clearLabel={t.clearSig}
            />
          </div>

          {/* ── Confirmation ── */}
          <div className="bg-white rounded-3xl border border-hairline p-8 md:p-10 mt-6 shadow-[0_16px_48px_-24px_rgba(43,46,42,0.10)]">
            <SectionHeading>{t.sConfirm}</SectionHeading>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              <Field label={t.clientNameLabel} required>
                <input className={inputCls} value={form.clientName} onChange={set('clientName')} required placeholder="—" />
              </Field>
              <Field label={t.dateLabel}>
                <input className={inputCls} value={form.date} onChange={set('date')} placeholder="DD/MM/YYYY" />
              </Field>
            </div>
          </div>

          {/* Validation / error */}
          {validationMsg && (
            <p className="mt-6 text-sm text-[#B44B3C] flex items-center gap-2">
              <svg viewBox="0 0 16 16" className="w-4 h-4 flex-shrink-0" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              {validationMsg}
            </p>
          )}
          {status === 'error' && (
            <p className="mt-6 text-sm text-[#B44B3C] font-mono break-all">{errorDetail || t.error}</p>
          )}

          {/* Submit */}
          <div className="mt-8 flex items-center gap-6">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center gap-3 rounded-full bg-earth text-[#F4F1ED] px-8 py-4 text-[0.8rem] tracking-[0.2em] uppercase hover:bg-earth-deep transition-all duration-300 hover:-translate-y-[1px] disabled:opacity-60"
            >
              {status === 'submitting' ? t.submitting : t.submit}
            </button>
            <Link to="/" className="text-[0.72rem] tracking-[0.2em] uppercase text-ink-soft/50 hover:text-ink-soft transition-colors">
              {t.back}
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
