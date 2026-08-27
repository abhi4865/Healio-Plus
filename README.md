# Healio+

**AI-powered healthcare companion** for health guidance, reminders, medical document analysis, calendar notes, and government scheme discovery.

Live app: [healthgpt-90b51.web.app](https://healthgpt-90b51.web.app)

## One-Line Pitch

Healio+ brings together health Q&A, voice support, OCR document understanding, reminders, calendar notes, and scheme discovery in one secure web app built for everyday healthcare support.

## Why It Matters

Many people still juggle multiple apps, screenshots, paper prescriptions, and reminders when managing basic health needs. Healio+ reduces that friction by putting the most common tasks into one simple bilingual experience.

## What A Jury Should Notice

- Solves a real everyday problem, not just a novelty use case.
- Supports English and Hindi, including voice input.
- Uses a fallback AI chain so the assistant stays available if one provider fails.
- Keeps private actions server-verified with Firebase ID tokens.
- Blocks bot-driven login attempts with server-verified reCAPTCHA.
- Combines several useful health workflows in one polished product.

## Features

- **AI Health Assistant** - asks only health and wellness questions, with fallback across Gemini, Groq, and Hugging Face.
- **Voice input** - speak in English or Hindi instead of typing.
- **Medical document analysis** - upload prescriptions or reports and get OCR-based summaries.
- **PDF export** - save readable health summaries and reports.
- **Recently Asked** - revisit common health questions privately.
- **Reminders** - one-time and recurring reminders with browser notifications and push support, kept alive server-side via a scheduled cron check.
- **Calendar notes** - per-user notes tied to specific dates.
- **Government schemes directory** - browse health schemes and manage them as a super admin.
- **Secure authentication** - Firebase Auth with backend ID-token verification on protected requests, plus a server-verified reCAPTCHA check on login.

## Tech Stack

**Frontend**
- React (Vite)
- Firebase Auth + Firestore (client SDK)
- Google reCAPTCHA v2 (Challenge / "I'm not a robot")
- Deployed via Firebase Hosting

**Backend**
- Node.js + Express
- Firebase Admin SDK (auth verification)
- `express-rate-limit` on auth, chatbot, and general API routes
- Deployed as Vercel serverless functions

**AI / ML**
- Gemini API (primary), Groq (fallback), Hugging Face (fallback)
- OCR pipeline for medical document analysis

## Demo Flow

If you are judging the app, this is the fastest path through the product:

1. Sign in as a user (complete the CAPTCHA checkbox first).
2. Ask a health question in English or Hindi, optionally by voice.
3. Create a reminder and a calendar note.
4. Upload a prescription or report for OCR analysis.
5. Open the schemes section and browse available support options.

## Project Structure

```text
Healio+/
|-- .firebase/                        # Firebase Hosting build cache (gitignored)
|-- .firebaserc
|-- .gitignore
|-- firebase.json
|-- firestore.indexes.json
|-- firestore.rules
|-- frontend/
|   |-- src/
|   |   |-- App.jsx                   # Main application (routing, auth, dashboards)
|   |   |-- App.css                   # Styling
|   |   |-- api.js                    # All backend calls go through here
|   |   |-- firebaseConfig.js
|   |   |-- push.js                   # FCM push notification setup
|   |   `-- ...
|   |-- dist/                         # Production build (gitignored)
|   |-- .env                          # Frontend secrets (gitignored)
|   |-- .env.example
|   `-- package.json
|-- backend/
|   |-- api/
|   |   |-- index.js                  # Express API endpoints (entry point)
|   |   `-- check-reminders.js        # Cron-triggered reminder push notifications
|   |-- middleware/
|   |   |-- auth.js                   # Firebase ID token verification, role checks
|   |   |-- rateLimit.js              # authLimiter, chatbotLimiter, generalApiLimiter
|   |   |-- upload.js
|   |   `-- validate.js               # Zod schema validation middleware
|   |-- validators/
|   |   `-- schemas.js                # Zod schemas for every route
|   |-- tests/
|   |   `-- firestore-rules.test.js
|   |-- audit-secrets.sh
|   |-- .env                          # Backend secrets (gitignored)
|   |-- .env.example
|   |-- vercel.json
|   `-- package.json
`-- README.md
```

## Getting Started

### Prerequisites
- Node.js (LTS recommended, `>=20`)
- A Firebase project (Auth + Firestore + Cloud Messaging enabled)
- A Vercel account (for backend deployment)
- API keys for Gemini, Groq, and Hugging Face
- A Google reCAPTCHA v2 site (Site Key + Secret Key)

### 1. Clone the repo

```bash
git clone https://github.com/abhi4865/Healio-Plus.git
cd Healio+
```

### 2. Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 3. Environment variables

Create a `.env` file in both `frontend/` and `backend/` (see the matching `.env.example` in each folder).

**frontend/.env**

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_URL=https://your-backend-project.vercel.app
VITE_RECAPTCHA_SITE_KEY=...
```

**backend/.env**

```bash
GEMINI_API_KEY=...
GROQ_API_KEY=...
HF_TOKEN=...
FIREBASE_SERVICE_ACCOUNT='{ "type": "service_account", ... }'   # full service account JSON, single line
RECAPTCHA_SECRET_KEY=...
CRON_SECRET=...                                                  # shared secret for /api/check-reminders
```

> When adding these to the **Vercel dashboard** (Settings → Environment Variables) for deployment, set the scope to **All Environments** so they apply across Production, Preview, and Development deploys.

### 4. Register reCAPTCHA

At [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin/create):
- Type: **Challenge (v2) → "I'm not a robot" tickbox**
- Domains: bare hostnames only, no protocol/port — e.g. `healthgpt-90b51.web.app` and `localhost`

### 5. Run locally

```bash
cd backend && npm run dev

# frontend, in a new terminal
cd frontend && npm run dev
```

> Restart the Vite dev server after any `.env` change — Vite only reads `.env` at startup.

### 6. Build & deploy

**Frontend (Firebase Hosting):**
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

**Backend (Vercel):**
```bash
cd backend
vercel --prod
```
or push to the connected Git branch to trigger an automatic deploy. After adding/changing an environment variable in the Vercel dashboard, a **new deployment must be triggered** — existing deployments don't pick up the change retroactively.

## User Roles

| Role | Access |
|---|---|
| `super_admin` | Full system access, including scheme management |
| `user` | Personal health assistant, reminders, calendar notes, document analysis, and schemes |

## Architecture At A Glance

- The frontend handles authentication (including CAPTCHA verification before sign-in), chat, reminders, notes, OCR upload, and PDF export.
- The backend verifies identity and CAPTCHA tokens, enforces role-based permissions, handles AI requests with a Gemini → Groq → Hugging Face fallback chain, and stores private data.
- A scheduled cron job (`/api/check-reminders`, guarded by `CRON_SECRET`) fires due reminders as push notifications even when the app is closed.
- Firestore stores users, reminders, calendar notes, schemes, cached AI responses, and push-token data.

## Security Notes

- All API requests are authenticated via Firebase ID tokens, verified server-side with the Firebase Admin SDK.
- Login is gated by a server-verified Google reCAPTCHA v2 check (`/api/verify-captcha`) — the backend confirms the token with Google before any Firebase sign-in call runs.
- `authLimiter`, `chatbotLimiter`, and `generalApiLimiter` rate-limit auth, AI, and general routes respectively.
- Firestore security rules restrict reads/writes based on role.
- Secrets (`.env` files, service account keys, reCAPTCHA secret key) are excluded from version control — see `.gitignore` (`.env`, `.firebase/`, `dist/`, `node_modules/`).
- All request bodies are validated against Zod schemas before reaching route logic.

## Known Follow-Ups

- `app.set('trust proxy', 1)` not yet added — `express-rate-limit` currently logs validation warnings about `X-Forwarded-For` headers behind Vercel's proxy, which may affect per-client rate-limit accuracy.
- Frontend production bundle exceeds Vite's 500 kB chunk-size warning threshold — candidate for code-splitting via dynamic `import()`.

## Hackathon Highlights

- Built as a practical tool for everyday healthcare support.
- Designed to work on mobile and desktop browsers.
- Keeps sensitive actions behind verified auth, CAPTCHA, and server-side checks.
- Includes a 3-minute demo-friendly flow that shows clear value quickly.

## Hackathon Submission Checklist

- [ ] Deployed app link works without credentials.
- [ ] Public GitHub repository is visible and has commit history.
- [ ] Demo video is recorded and under 3 minutes.
- [ ] Project description Google Doc is public and accessible.
- [ ] Submission form is completed on BlockseBlock.
- [ ] Final submit is clicked, not left in drafts.

## License

This project is currently private/unlicensed.

## Author

Built by **Abhishek** ([@abhi4865](https://github.com/abhi4865))