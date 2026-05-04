import React, { useState } from 'react';
import axios from 'axios';
import { useLang } from '../i18n/LanguageContext';
import { Mail, Phone, MapPin, Send, Check, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const initialForm = {
  name: '',
  email: '',
  phone: '',
  preferred_session: '',
  message: '',
};

export const Contact = () => {
  const { t, lang } = useLang();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      await axios.post(`${API}/contact`, { ...form, language: lang });
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg((err && err.response && err.response.data && err.response.data.detail) || t.contact.error);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="relative py-24 md:py-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-5">
          <p className="overline" data-testid="contact-overline">{t.contact.overline}</p>
          <h2
            data-testid="contact-title"
            className="h-serif text-4xl sm:text-5xl lg:text-6xl mt-5"
          >
            {t.contact.title}
          </h2>
          <p className="mt-7 text-ink-soft text-base md:text-lg leading-relaxed max-w-md">
            {t.contact.intro}
          </p>

          <div className="mt-12 space-y-5">
            <p className="text-[0.72rem] tracking-[0.24em] uppercase text-ink-soft/70">
              {t.contact.or}
            </p>
            <a
              href="mailto:tranquilario@pm.me"
              data-testid="contact-email-link"
              className="flex items-center gap-4 text-ink hover:text-earth transition-colors group"
            >
              <span className="w-10 h-10 rounded-full bg-white border border-hairline flex items-center justify-center text-turquoise">
                <Mail size={16} />
              </span>
              <span className="text-base md:text-lg">tranquilario@pm.me</span>
            </a>
            <a
              href="tel:+491628761060"
              data-testid="contact-phone-link"
              className="flex items-center gap-4 text-ink hover:text-earth transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-white border border-hairline flex items-center justify-center text-turquoise">
                <Phone size={16} />
              </span>
              <span className="text-base md:text-lg">+49 162 876 1060</span>
            </a>
            <a
              href="https://wa.me/491628761060"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-whatsapp-link"
              className="flex items-center gap-4 text-ink hover:text-earth transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-white border border-hairline flex items-center justify-center text-turquoise">
                <Send size={16} />
              </span>
              <span className="text-base md:text-lg">WhatsApp</span>
            </a>
            <div className="flex items-center gap-4 text-ink-soft pt-2">
              <span className="w-10 h-10 rounded-full bg-white border border-hairline flex items-center justify-center text-turquoise">
                <MapPin size={16} />
              </span>
              <span className="text-sm leading-relaxed">
                Freiburg im Breisgau, Germany<br />Toronto, Canada
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <form
            onSubmit={onSubmit}
            data-testid="contact-form"
            className="bg-white rounded-3xl border border-hairline p-8 md:p-12 shadow-[0_20px_60px_-30px_rgba(43,46,42,0.12)]"
          >
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <label className="text-[0.72rem] tracking-[0.24em] uppercase text-ink-soft/80">
                  {t.contact.name} *
                </label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={onChange}
                  data-testid="contact-input-name"
                  className="quiet-input"
                  placeholder="—"
                />
              </div>
              <div>
                <label className="text-[0.72rem] tracking-[0.24em] uppercase text-ink-soft/80">
                  {t.contact.email} *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={onChange}
                  data-testid="contact-input-email"
                  className="quiet-input"
                  placeholder="—"
                />
              </div>
              <div>
                <label className="text-[0.72rem] tracking-[0.24em] uppercase text-ink-soft/80">
                  {t.contact.phone}
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  data-testid="contact-input-phone"
                  className="quiet-input"
                  placeholder="—"
                />
              </div>
              <div>
                <label className="text-[0.72rem] tracking-[0.24em] uppercase text-ink-soft/80">
                  {t.contact.preferred}
                </label>
                <select
                  name="preferred_session"
                  value={form.preferred_session}
                  onChange={onChange}
                  data-testid="contact-input-session"
                  className="quiet-input bg-transparent"
                >
                  <option value="">—</option>
                  {t.contact.preferredOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-[0.72rem] tracking-[0.24em] uppercase text-ink-soft/80">
                {t.contact.message} *
              </label>
              <textarea
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={onChange}
                data-testid="contact-input-message"
                className="quiet-input"
                placeholder="—"
              />
            </div>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <button
                type="submit"
                disabled={status === 'sending'}
                data-testid="contact-submit-button"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-earth text-[#F4F1ED] px-8 py-4 text-[0.8rem] tracking-[0.2em] uppercase hover:bg-earth-deep transition-all duration-300 hover:-translate-y-[1px] disabled:opacity-60"
              >
                {status === 'sending' ? t.contact.sending : t.contact.submit}
                <Send size={14} />
              </button>

              {status === 'success' && (
                <div data-testid="contact-success" className="flex items-center gap-2 text-turquoise text-sm">
                  <Check size={16} />
                  <span>{t.contact.success}</span>
                </div>
              )}
              {status === 'error' && (
                <div data-testid="contact-error" className="flex items-center gap-2 text-[#B44B3C] text-sm">
                  <AlertCircle size={16} />
                  <span>{errorMsg || t.contact.error}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
