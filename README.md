# Healio+ 🩺➕

**AI-powered Healthcare Companion** — a full-stack healthcare management platform connecting ASHA (Accredited Social Health Activist) workers with rural patients, built to simplify health tracking, communication, and access to medical guidance.

Live: [healthgpt-90b51.web.app](https://healthgpt-90b51.web.app)

---

## ✨ Features

- **Role-based dashboards** — `super_admin`, `admin`, `asha` (health worker), and `patient` each get a tailored view and permission set.
- **AI Health Chatbot** — answers common health queries with a fallback chain (Gemini → Groq → Hugging Face) so the assistant stays available even if one provider is down. Responses are cached in Firestore for speed and cost efficiency.
- **Voice input** — ask the chatbot questions by voice, with Hindi/English toggle.
- **Multi-location ASHA assignment** — health workers can be tagged to multiple service areas via a tag-input UI, with backward compatibility for single-location legacy data.
- **Medical document analysis (OCR)** — upload a prescription or report and extract readable text/insights.
- **PDF export** — generate shareable health summaries and reports, with full support for Devanagari (Hindi) script.
- **Recently Asked** — quick access to frequently answered health questions, pulled from cached chatbot responses.
- **Government schemes directory** — browse and manage information on public health schemes.
- **Secure authentication** — Firebase Auth with backend ID-token verification on every protected request.

---

## 🏗️ Tech Stack

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

---

## 📂 Project Structure

```
Healio+/
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main application (routing, auth, dashboards)
│   │   ├── App.css        # Styling
│   │   └── ...
│   ├── dist/               # Production build (gitignored)
│   └── package.json
├── backend/
│   ├── routes/              # Express API endpoints
│   ├── index.js / server.js
│   └── package.json
├── .firebase/               # Firebase CLI cache (gitignored)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- A Firebase project (Auth + Firestore enabled)
- API keys for Gemini / Groq / Hugging Face (for chatbot fallback chain)

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
Create a `.env` file in both `frontend/` and `backend/` (never commit these — see `.gitignore`).

**frontend/.env**
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

**backend/.env**
```
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

---

## 👥 User Roles

| Role | Access |
|---|---|
| `super_admin` | Full system access — manage admins, ASHA workers, schemes |
| `admin` | Manage ASHA workers and patients within assigned scope |
| `asha` | Health worker dashboard — manage assigned patients, log visits |
| `patient` / `user` | Personal health profile, reminders, chatbot access |

---

## 🔒 Security Notes

- All API requests are authenticated via Firebase ID tokens, verified server-side with the Firebase Admin SDK.
- Firestore security rules restrict reads/writes based on role.
- Secrets (`.env` files, service account keys) are excluded from version control — see `.gitignore`.

---

## 📄 License

This project is currently private/unlicensed. Add a license here if you plan to open-source it.

---

## 🙋 Author

Built by **Abhishek** ([@abhi4865](https://github.com/abhi4865))