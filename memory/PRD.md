# Tranquilário Studio — PRD

## Original problem statement
Build a simple, multilingual (EN/DE/IT/PT-BR) marketing site for Tranquilário Studio — Lalo Porto's practice offering Thai Massage, Alexander Technique, and Body Awareness. Earth-tone palette (earthen greens, soft browns, sand, muted turquoise), Cormorant Garamond + Lato/Open Sans (we chose Manrope). Mobile-first single-column. Locations: Freiburg, DE and Toronto, CA.

## User personas
- **Primary**: Wellness seekers in Freiburg/Toronto looking for an intentional, non-corporate massage/body-awareness practitioner.
- **Secondary**: German/Italian/Portuguese-speaking clients visiting the site in their native language.

## Core (static) requirements
- Single-page layout: Hero → About Lalo → Sessions → Testimonials → Contact → Footer.
- Full translations in EN (default), DE, IT, PT-BR with language toggle (flags + labels) persisted to localStorage.
- Contact form (name, email, phone, preferred session, message) — saves to MongoDB.
- Direct contact channels visible: tranquilario@pm.me, +49 162 876 1060, WhatsApp.
- Earthen palette (sand #F4F1ED, earth green #4A5D4E, turquoise #5E8B82, ink #2B2E2A).
- Testimonials carousel with all 4 provided quotes (Malina, Birgit, Philine, Moema) + Jan's featured in About.
- Footer: German signature tagline + locations + © 2026 Lalo Porto.

## Architecture
- **Backend**: FastAPI (`/app/backend/server.py`) + MongoDB (motor). Endpoints: `GET /api/health`, `POST /api/contact`, `GET /api/contacts`.
- **Frontend**: React 19 + CRA + Tailwind + shadcn/ui primitives. Embla carousel for testimonials. Lucide icons. Google Fonts (Cormorant Garamond + Manrope) via @import in index.css.
- **State**: LanguageContext with localStorage key `tranq_lang`.
- **No auth, no payments, no email delivery** (Resend deferred per user request).

## What's implemented (2026-05-04)
- Hero with earthen background, dark gradient overlay, serif H1 + CTAs.
- About section with asymmetric portrait + featured quote.
- Sessions section with 3 practices in a borderless list and icon markers.
- Testimonials dark-green carousel with navigation arrows and progress dashes.
- Contact form + prominent email/phone/WhatsApp links.
- Dark footer with tagline, nav, contact, locations.
- Navbar: sticky glassmorphism, language dropdown (EN/DE/IT/PT 🇬🇧🇩🇪🇮🇹🇧🇷), mobile menu.
- Backend: contact persistence with UUID id, ISO timestamps, `_id` excluded from queries.
- All elements carry `data-testid` attributes.
- Tested end-to-end via testing_agent_v3 — 100% backend + 100% frontend pass.

## Prioritized backlog
### P1
- Replace placeholder portrait & hero images with Lalo's real photos.
- Add Resend integration so form submissions also email tranquilario@pm.me (requires Resend API key + verified sender).
- Admin view / simple auth for `GET /api/contacts` (currently public).

### P2
- Per-session deep pages with video snippets or longer prose.
- SEO: proper `<title>`, meta description per language, Open Graph image, favicon, sitemap.
- Analytics (Plausible or GA4).
- Newsletter / seasonal workshops signup.
- Booking calendar integration (e.g., Cal.com, Calendly) for self-serve scheduling.

### P3
- Replace stock imagery with custom studio photography.
- Soft Lenis-driven smooth scroll.
- Subtle scroll-reveal animations beyond first paint.

## Next tasks
1. Collect real photos from Lalo (portrait + studio + hero).
2. Get Resend API key + decide sender domain → wire outbound email.
3. Protect `/api/contacts` or build a minimal admin UI.
4. Wire booking calendar provider.
