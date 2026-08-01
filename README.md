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
- Combines several useful health workflows in one polished product.

## Features

- **AI Health Assistant** - asks only health and wellness questions, with fallback across Gemini, Groq, and Hugging Face.
- **Voice input** - speak in English or Hindi instead of typing.
- **Medical document analysis** - upload prescriptions or reports and get OCR-based summaries.
- **PDF export** - save readable health summaries and reports.
- **Recently Asked** - revisit common health questions privately.
- **Reminders** - one-time and recurring reminders with browser notifications and push support.
- **Calendar notes** - per-user notes tied to specific dates.
- **Government schemes directory** - browse health schemes and manage them as a super admin.
- **Secure authentication** - Firebase Auth with backend ID-token verification on protected requests.

## Tech Stack

**Frontend**
- React (Vite)
- Firebase Auth + Firestore (client SDK)
- Deployed via Firebase Hosting

**Backend**
- Node.js + Express
- Firebase Admin SDK (auth verification)
- Deployed as serverless functions or a Node service

**AI / ML**
- Gemini API (primary), Groq (fallback), Hugging Face (fallback)
- OCR pipeline for medical document analysis

## Demo Flow

If you are judging the app, this is the fastest path through the product:

1. Sign in as a user.
2. Ask a health question in English or Hindi, optionally by voice.
3. Create a reminder and a calendar note.
4. Upload a prescription or report for OCR analysis.
5. Open the schemes section and browse available support options.

## Project Structure

```text
Healio+/
|-- frontend/
|   |-- src/
|   |   |-- App.jsx        # Main application (routing, auth, dashboards)
|   |   |-- App.css        # Styling
|   |   `-- ...
|   |-- dist/               # Production build (gitignored)
|   `-- package.json
|-- backend/
|   |-- api/
|   |   `-- index.js       # Express API endpoints
|   `-- package.json
|-- .gitignore
`-- README.md
```

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- A Firebase project (Auth + Firestore enabled)
- API keys for Gemini, Groq, and Hugging Face

### 1. Clone the repo

```bash
git clone https://github.com/abhi4865/Asha-Plus-AI-Healthcare.git
cd Healio+
```

### 2. Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 3. Environment variables

Create a `.env` file in both `frontend/` and `backend/`.

**frontend/.env**

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

**backend/.env**

```bash
GEMINI_API_KEY=...
GROQ_API_KEY=...
HUGGINGFACE_API_KEY=...
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY=...
```

### 4. Run locally

```bash
cd backend && npm run dev

# frontend, in a new terminal
cd frontend && npm run dev
```

### 5. Build & deploy

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## User Roles

| Role | Access |
|---|---|
| `super_admin` | Full system access, including scheme management |
| `user` | Personal health assistant, reminders, calendar notes, document analysis, and schemes |

## Architecture At A Glance

- The frontend handles authentication, chat, reminders, notes, OCR upload, and PDF export.
- The backend verifies identity, enforces role-based permissions, handles AI requests, and stores private data.
- Firestore stores users, reminders, calendar notes, schemes, cached responses, and push-token data.

## Security Notes

- All API requests are authenticated via Firebase ID tokens, verified server-side with the Firebase Admin SDK.
- Firestore security rules restrict reads/writes based on role.
- Secrets (`.env` files, service account keys) are excluded from version control.

## Hackathon Highlights

- Built as a practical tool for everyday healthcare support.
- Designed to work on mobile and desktop browsers.
- Keeps sensitive actions behind verified auth and server-side checks.
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
