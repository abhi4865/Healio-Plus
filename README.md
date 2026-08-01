# Healio+

**AI-powered Healthcare Companion** - a full-stack healthcare app for health guidance, reminders, medical document analysis, calendar notes, and government scheme discovery.

Live: [healthgpt-90b51.web.app](https://healthgpt-90b51.web.app)

## Features

- **Role-based access** - `super_admin` and `user` with server-verified permissions.
- **AI Health Chatbot** - answers health queries with a fallback chain across Gemini, Groq, and Hugging Face.
- **Voice input** - ask the chatbot questions by voice, with Hindi/English toggle.
- **Medical document analysis (OCR)** - upload a prescription or report and extract readable text and insights.
- **PDF export** - generate shareable health summaries and reports.
- **Recently Asked** - quick access to frequently answered health questions, stored privately per user.
- **Reminders** - one-time and recurring reminders with browser notifications and push support.
- **Calendar notes** - per-user notes tied to specific dates.
- **Government schemes directory** - browse and manage information on public health schemes.
- **Secure authentication** - Firebase Auth with backend ID-token verification on every protected request.

## Tech Stack

**Frontend**
- React (Vite)
- Firebase Auth + Firestore (client SDK)
- Deployed via Firebase Hosting

**Backend**
- Node.js + Express
- Firebase Admin SDK (auth verification)
- Deployed as serverless functions (Vercel) / Node service (Render)

**AI / ML**
- Gemini API (primary), Groq (fallback), Hugging Face (fallback)
- OCR pipeline for medical document analysis

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
- API keys for Gemini / Groq / Hugging Face

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
# backend
cd backend && npm run dev

# frontend (in a new terminal)
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
| `super_admin` | Full system access - manage users, roles, reminders, and schemes |
| `user` | Personal health assistant, reminders, calendar notes, document analysis, and schemes |

## Security Notes

- All API requests are authenticated via Firebase ID tokens, verified server-side with the Firebase Admin SDK.
- Firestore security rules restrict reads/writes based on role.
- Secrets (`.env` files, service account keys) are excluded from version control.

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
