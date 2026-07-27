import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LogoMark from '../components/LogoMark';

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
    pageTitle: 'Session Feedback',
    pageSubtitle: 'Thank you for your time. Your feedback helps me improve and grow as a practitioner — every response is read and deeply appreciated.',
    sExperience: 'Overall Experience',
    sFeelings: 'How Did You Feel After the Session?',
    sComments: 'Your Feedback',
    sAboutYou: 'About You',
    sMailingList: 'Stay in Touch',
    ratingLabel: 'How would you rate the overall experience?',
    ratings: ['Excellent', 'Good', 'Neutral', 'Not satisfied'],
    feelingsLabel: 'Select all that apply:',
    feelings: ['More relaxed', 'Less pain / tension', 'More body awareness', 'Energised', 'No major change', 'Other'],
    feelingsOtherPlaceholder: 'Please describe…',
    commentsLabel: 'Comments or feedback',
    commentsPlaceholder: 'Share anything that stood out — what helped, what could be different, how you felt…',
    reviewPermLabel: 'May I use your feedback as a public review?',
    reviewYes: 'Yes, with my name',
    reviewAnon: 'Yes, anonymously',
    reviewNo: 'No, keep it private',
    fullName: 'Full name',
    profession: 'Profession',
    age: 'Age',
    mailingLabel: 'Would you like to receive occasional updates from Tranquilário Studio?',
    mailingYes: 'Yes please',
    mailingNo: 'No thanks',
    mailingAlready: 'Already subscribed',
    submit: 'Send feedback',
    submitting: 'Sending…',
    success: 'Thank you — your feedback has been received. It means a lot.',
    error: 'Something went wrong. Please try again or contact us directly.',
  },
  de: {
    back: '← Zurück zur Website',
    pageTitle: 'Sitzungs-Feedback',
    pageSubtitle: 'Vielen Dank für Ihre Zeit. Ihr Feedback hilft mir, mich als Therapeut weiterzuentwickeln — jede Antwort wird gelesen und ist sehr wertvoll.',
    sExperience: 'Gesamterlebnis',
    sFeelings: 'Wie haben Sie sich nach der Sitzung gefühlt?',
    sComments: 'Ihr Feedback',
    sAboutYou: 'Über Sie',
    sMailingList: 'In Kontakt bleiben',
    ratingLabel: 'Wie würden Sie das Gesamterlebnis bewerten?',
    ratings: ['Ausgezeichnet', 'Gut', 'Neutral', 'Nicht zufrieden'],
    feelingsLabel: 'Alles Zutreffende auswählen:',
    feelings: ['Entspannter', 'Weniger Schmerzen / Verspannungen', 'Mehr Körperbewusstsein', 'Energiegeladen', 'Keine wesentliche Veränderung', 'Sonstiges'],
    feelingsOtherPlaceholder: 'Bitte beschreiben…',
    commentsLabel: 'Kommentare oder Feedback',
    commentsPlaceholder: 'Teilen Sie mit, was aufgefallen ist — was geholfen hat, was anders sein könnte, wie Sie sich gefühlt haben…',
    reviewPermLabel: 'Darf ich Ihr Feedback als öffentliche Rezension verwenden?',
    reviewYes: 'Ja, mit meinem Namen',
    reviewAnon: 'Ja, anonym',
    reviewNo: 'Nein, vertraulich',
    fullName: 'Vollständiger Name',
    profession: 'Beruf',
    age: 'Alter',
    mailingLabel: 'Möchten Sie gelegentlich Updates von Tranquilário Studio erhalten?',
    mailingYes: 'Ja, gerne',
    mailingNo: 'Nein, danke',
    mailingAlready: 'Bereits angemeldet',
    submit: 'Feedback absenden',
    submitting: 'Wird gesendet…',
    success: 'Vielen Dank — Ihr Feedback ist eingegangen. Es bedeutet mir viel.',
    error: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.',
  },
  it: {
    back: '← Torna al sito',
    pageTitle: 'Feedback sulla seduta',
    pageSubtitle: 'Grazie per il tuo tempo. Il tuo feedback mi aiuta a crescere come professionista — ogni risposta viene letta ed è profondamente apprezzata.',
    sExperience: 'Esperienza complessiva',
    sFeelings: 'Come ti sei sentito/a dopo la seduta?',
    sComments: 'Il tuo feedback',
    sAboutYou: 'Su di te',
    sMailingList: 'Resta in contatto',
    ratingLabel: "Come valuteresti l'esperienza complessiva?",
    ratings: ['Eccellente', 'Buona', 'Neutra', 'Non soddisfatto/a'],
    feelingsLabel: 'Seleziona tutto ciò che si applica:',
    feelings: ['Più rilassato/a', 'Meno dolore / tensione', 'Maggiore consapevolezza corporea', 'Energizzato/a', 'Nessun cambiamento significativo', 'Altro'],
    feelingsOtherPlaceholder: 'Descrivi…',
    commentsLabel: 'Commenti o feedback',
    commentsPlaceholder: 'Condividi qualcosa che ti ha colpito — cosa ha aiutato, cosa potrebbe essere diverso, come ti sei sentito/a…',
    reviewPermLabel: 'Posso usare il tuo feedback come recensione pubblica?',
    reviewYes: 'Sì, con il mio nome',
    reviewAnon: 'Sì, in forma anonima',
    reviewNo: 'No, tienilo privato',
    fullName: 'Nome completo',
    profession: 'Professione',
    age: 'Età',
    mailingLabel: 'Vorresti ricevere aggiornamenti occasionali da Tranquilário Studio?',
    mailingYes: 'Sì, grazie',
    mailingNo: 'No, grazie',
    mailingAlready: 'Già iscritto/a',
    submit: 'Invia feedback',
    submitting: 'Invio in corso…',
    success: 'Grazie — il tuo feedback è stato ricevuto. Significa molto per me.',
    error: 'Qualcosa è andato storto. Riprova o contattaci direttamente.',
  },
  pt: {
    back: '← Voltar ao site',
    pageTitle: 'Feedback da sessão',
    pageSubtitle: 'Obrigado pelo seu tempo. O seu feedback ajuda-me a crescer como praticante — cada resposta é lida e profundamente apreciada.',
    sExperience: 'Experiência geral',
    sFeelings: 'Como se sentiu depois da sessão?',
    sComments: 'O seu feedback',
    sAboutYou: 'Sobre si',
    sMailingList: 'Manter o contacto',
    ratingLabel: 'Como avaliaria a experiência geral?',
    ratings: ['Excelente', 'Boa', 'Neutra', 'Não satisfeito/a'],
    feelingsLabel: 'Selecione tudo o que se aplica:',
    feelings: ['Mais relaxado/a', 'Menos dor / tensão', 'Maior consciência corporal', 'Energizado/a', 'Sem grande mudança', 'Outro'],
    feelingsOtherPlaceholder: 'Descreva…',
    commentsLabel: 'Comentários ou feedback',
    commentsPlaceholder: 'Partilhe o que se destacou — o que ajudou, o que poderia ser diferente, como se sentiu…',
    reviewPermLabel: 'Posso usar o seu feedback como avaliação pública?',
    reviewYes: 'Sim, com o meu nome',
    reviewAnon: 'Sim, de forma anónima',
    reviewNo: 'Não, mantenha privado',
    fullName: 'Nome completo',
    profession: 'Profissão',
    age: 'Idade',
    mailingLabel: 'Gostaria de receber atualizações ocasionais do Tranquilário Studio?',
    mailingYes: 'Sim, por favor',
    mailingNo: 'Não, obrigado/a',
    mailingAlready: 'Já subscrito/a',
    submit: 'Enviar feedback',
    submitting: 'Enviando…',
    success: 'Obrigado — o seu feedback foi recebido. Significa muito.',
    error: 'Algo deu errado. Tente novamente ou entre em contato diretamente.',
  },
};

const PAGE_TITLES = {
  en: 'Feedback — Tranquilário Studio',
  de: 'Feedback — Tranquilário Studio',
  it: 'Feedback — Tranquilário Studio',
  pt: 'Feedback — Tranquilário Studio',
};

// ── Shared UI primitives ──────────────────────────────────────────────────────
const SectionHeading = ({ children }) => (
  <h2 className="h-serif text-2xl md:text-3xl text-ink mt-8 mb-5">{children}</h2>
);

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[0.7rem] tracking-[0.22em] uppercase text-ink-soft/80">
      {label}{required && ' *'}
    </label>
    {children}
  </div>
);

const inputCls = "w-full bg-transparent border-0 border-b border-hairline py-3 px-0.5 text-sm text-ink placeholder-ink-soft/30 focus:outline-none focus:border-turquoise transition-colors";

const RadioRow = ({ name, value, checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    <span className={`flex-shrink-0 w-5 h-5 rounded-full border transition-colors flex items-center justify-center ${checked ? 'border-earth' : 'border-hairline bg-white group-hover:border-turquoise'}`}>
      {checked && <span className="w-2.5 h-2.5 rounded-full bg-earth" />}
    </span>
    <span className="text-sm text-ink-soft">{label}</span>
  </label>
);

const CheckRow = ({ checked, onChange, label }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border transition-colors flex items-center justify-center ${checked ? 'bg-earth border-earth' : 'border-hairline bg-white group-hover:border-turquoise'}`}>
      {checked && (
        <svg viewBox="0 0 10 8" className="w-2.5 h-2" fill="none">
          <path d="M1 4l2.5 2.5L9 1" stroke="#F4F1ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <span className="text-sm text-ink-soft leading-relaxed">{label}</span>
  </label>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function FeedbackForm() {
  const [lang, setLangState] = useState(detectLang);
  const t = T[lang];

  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem('tranq_lang', l); } catch (_) {}
  };

  useEffect(() => {
    document.title = PAGE_TITLES[lang];
    return () => { document.title = 'Tranquilário Studio'; };
  }, [lang]);

  const [form, setForm] = useState({
    rating: '',
    // feeling checkboxes — keyed by index 0–5
    feeling0: false, feeling1: false, feeling2: false,
    feeling3: false, feeling4: false, feeling5: false,
    feelingOther: '',
    comments: '',
    reviewPerm: '',
    fullName: '',
    profession: '',
    age: '',
    mailingList: '',
  });

  const [status, setStatus] = useState('idle');
  const [errorDetail, setErrorDetail] = useState('');

  const setText = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setCheck = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.checked }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorDetail('');

    const checkedFeelings = t.feelings
      .map((label, i) => (form[`feeling${i}`] ? label : null))
      .filter(Boolean);
    if (form.feeling5 && form.feelingOther) {
      // replace the translated "Other" with the user's text
      const idx = checkedFeelings.indexOf(t.feelings[5]);
      if (idx !== -1) checkedFeelings[idx] = `Other: ${form.feelingOther}`;
    }

    const str = (v) => v || undefined;
    try {
      await axios.post('/api/feedback', {
        rating: str(form.rating),
        feelings: checkedFeelings,
        comments: form.comments,
        review_permission: str(form.reviewPerm),
        full_name: form.fullName,
        profession: str(form.profession),
        age: str(form.age),
        mailing_list: str(form.mailingList),
        language: lang,
      });
      setStatus('success');
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map(d => d.msg).join('; ')
        : detail || err?.message || 'Unknown error';
      console.error('Feedback submission failed:', msg, err?.response?.data);
      setErrorDetail(msg);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-earth/10 flex items-center justify-center mb-6">
          <svg viewBox="0 0 20 20" className="w-5 h-5 text-earth" fill="none">
            <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="h-serif text-3xl md:text-4xl text-ink">{t.success}</h1>
        <Link to="/lalo" className="mt-8 text-[0.72rem] tracking-[0.22em] uppercase text-turquoise hover:text-earth transition-colors">
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
          <Link to="/lalo" className="flex items-center gap-3">
            <LogoMark size={36} variant="ripple" filled={false} stroke="#EFEAE2" accent="#7FA8A0" />
            <span className="font-serif text-xl tracking-tight">Tranquilário Studio</span>
          </Link>
          <div className="flex items-center gap-1">
            {['en', 'de', 'it', 'pt'].map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded text-[0.65rem] tracking-[0.18em] uppercase transition-colors ${lang === l ? 'bg-[#F4F1ED]/15 text-[#F4F1ED]' : 'text-[#F4F1ED]/50 hover:text-[#F4F1ED]/80'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-6 lg:px-0 py-14">
        <p className="overline">Tranquilário Studio</p>
        <h1 className="h-serif text-4xl md:text-5xl text-ink mt-3">{t.pageTitle}</h1>
        <p className="mt-4 text-sm text-ink-soft leading-relaxed max-w-lg">{t.pageSubtitle}</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">

          {/* ── Overall rating ── */}
          <div className="bg-white rounded-3xl border border-hairline p-8 md:p-10 shadow-[0_16px_48px_-24px_rgba(43,46,42,0.10)]">
            <SectionHeading>{t.sExperience}</SectionHeading>
            <p className="text-[0.72rem] tracking-[0.18em] uppercase text-ink-soft/60 mb-5">{t.ratingLabel}</p>
            <div className="space-y-3">
              {t.ratings.map((label, i) => (
                <RadioRow
                  key={i}
                  name="rating"
                  value={label}
                  checked={form.rating === label}
                  onChange={() => setForm(f => ({ ...f, rating: label }))}
                  label={label}
                />
              ))}
            </div>
          </div>

          {/* ── Post-session feelings ── */}
          <div className="bg-white rounded-3xl border border-hairline p-8 md:p-10 shadow-[0_16px_48px_-24px_rgba(43,46,42,0.10)]">
            <SectionHeading>{t.sFeelings}</SectionHeading>
            <p className="text-[0.72rem] tracking-[0.18em] uppercase text-ink-soft/60 mb-5">{t.feelingsLabel}</p>
            <div className="space-y-4">
              {t.feelings.map((label, i) => (
                <CheckRow
                  key={i}
                  checked={form[`feeling${i}`]}
                  onChange={setCheck(`feeling${i}`)}
                  label={label}
                />
              ))}
            </div>
            {form.feeling5 && (
              <div className="mt-4 ml-8">
                <input
                  className={inputCls}
                  value={form.feelingOther}
                  onChange={setText('feelingOther')}
                  placeholder={t.feelingsOtherPlaceholder}
                />
              </div>
            )}
          </div>

          {/* ── Comments ── */}
          <div className="bg-white rounded-3xl border border-hairline p-8 md:p-10 shadow-[0_16px_48px_-24px_rgba(43,46,42,0.10)]">
            <SectionHeading>{t.sComments}</SectionHeading>
            <Field label={t.commentsLabel} required>
              <textarea
                className={`${inputCls} resize-none`}
                rows={5}
                value={form.comments}
                onChange={setText('comments')}
                placeholder={t.commentsPlaceholder}
                required
              />
            </Field>
            <div className="mt-8">
              <p className="text-[0.72rem] tracking-[0.18em] uppercase text-ink-soft/60 mb-4">{t.reviewPermLabel}</p>
              <div className="space-y-3">
                {[
                  ['yes_named', t.reviewYes],
                  ['yes_anon', t.reviewAnon],
                  ['no', t.reviewNo],
                ].map(([val, label]) => (
                  <RadioRow
                    key={val}
                    name="reviewPerm"
                    value={val}
                    checked={form.reviewPerm === val}
                    onChange={() => setForm(f => ({ ...f, reviewPerm: val }))}
                    label={label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── About you ── */}
          <div className="bg-white rounded-3xl border border-hairline p-8 md:p-10 shadow-[0_16px_48px_-24px_rgba(43,46,42,0.10)]">
            <SectionHeading>{t.sAboutYou}</SectionHeading>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="sm:col-span-2">
                <Field label={t.fullName} required>
                  <input className={inputCls} value={form.fullName} onChange={setText('fullName')} required placeholder="—" />
                </Field>
              </div>
              <Field label={t.profession}>
                <input className={inputCls} value={form.profession} onChange={setText('profession')} placeholder="—" />
              </Field>
              <Field label={t.age}>
                <input className={inputCls} type="number" min="1" max="120" value={form.age} onChange={setText('age')} placeholder="—" />
              </Field>
            </div>
          </div>

          {/* ── Mailing list ── */}
          <div className="bg-white rounded-3xl border border-hairline p-8 md:p-10 shadow-[0_16px_48px_-24px_rgba(43,46,42,0.10)]">
            <SectionHeading>{t.sMailingList}</SectionHeading>
            <p className="text-[0.72rem] tracking-[0.18em] uppercase text-ink-soft/60 mb-5">{t.mailingLabel}</p>
            <div className="space-y-3">
              {[
                ['yes', t.mailingYes],
                ['no', t.mailingNo],
                ['already', t.mailingAlready],
              ].map(([val, label]) => (
                <RadioRow
                  key={val}
                  name="mailingList"
                  value={val}
                  checked={form.mailingList === val}
                  onChange={() => setForm(f => ({ ...f, mailingList: val }))}
                  label={label}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {status === 'error' && (
            <p className="text-sm text-[#B44B3C] font-mono break-all">{errorDetail || t.error}</p>
          )}

          {/* Submit */}
          <div className="flex items-center gap-6 pb-4">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center gap-3 rounded-full bg-earth text-[#F4F1ED] px-8 py-4 text-[0.8rem] tracking-[0.2em] uppercase hover:bg-earth-deep transition-all duration-300 hover:-translate-y-[1px] disabled:opacity-60"
            >
              {status === 'submitting' ? t.submitting : t.submit}
            </button>
            <Link to="/lalo" className="text-[0.72rem] tracking-[0.2em] uppercase text-ink-soft/50 hover:text-ink-soft transition-colors">
              {t.back}
            </Link>
          </div>

        </form>
      </main>
    </div>
  );
}
