/**
 * ============================================================================
 *  HealthGPT — Vercel API Client
 *  All backend calls go through here. Auth token is automatically attached.
 * ============================================================================
 */

import { auth } from "./firebaseConfig";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://healio-plus.vercel.app";

// ── Shared low-level request helper ───────────────────────────────────────────
// Used by both apiFetch() and selfRegisterUser() so error handling only
// lives in one place.
async function request(endpoint, body, token) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    // fetch() itself threw — this is a network/CORS failure, not an API error.
    // res.json() would never run, so surface something readable instead of
    // letting "Failed to fetch" bubble up unexplained.
    throw new Error(
      `Could not reach the server at ${BASE_URL}. This is usually a network issue or a CORS block — check the Network tab for the failed request. (${networkErr.message})`
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    // Server responded but body wasn't JSON (e.g. a raw 500 HTML page from Vercel).
    throw new Error(`Server returned an unexpected response (status ${res.status}).`);
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed (status ${res.status}).`);
  }
  return data;
}

// ── Core fetch helper — attaches Firebase ID token automatically ─────────────
async function apiFetch(endpoint, body) {
  const token = await auth.currentUser?.getIdToken();
  return request(endpoint, body, token);
}

// ── Self-Registration (no existing session needed — uses fresh signup token) ──

/**
 * Called right after createUserWithEmailAndPassword succeeds.
 * Pass the raw ID token from cred.user.getIdToken() directly,
 * since auth.currentUser may not be set yet when this runs.
 */
export async function selfRegisterUser(idToken, { name, email }) {
  return request("/api/selfRegisterUser", { name, email }, idToken);
}

// ── Auth & User Management (super_admin only) ─────────────────────────────────

export const createUser = (payload) =>
  apiFetch("/api/createUser", payload);
  // payload: { email, password, name, role?, mobile? }  role: "user" | "super_admin"

export const updateUserRole = (uid, newRole) =>
  apiFetch("/api/updateUserRole", { uid, newRole });

export const deleteAuthUser = (uid) =>
  apiFetch("/api/deleteAuthUser", { uid });

export const listUsers = () =>
  apiFetch("/api/listUsers", {});

// ── Government Schemes (management: super_admin only) ─────────────────────────

export const addScheme = (scheme) =>
  apiFetch("/api/addScheme", scheme);
  // scheme: { title, description?, category?, link?, eligibility? }

export const updateScheme = (schemeId, updates) =>
  apiFetch("/api/updateScheme", { schemeId, updates });

export const deleteScheme = (schemeId) =>
  apiFetch("/api/deleteScheme", { schemeId });

// ── AI Health Assistant ───────────────────────────────────────────────────────

export const askHealthAssistant = (prompt) =>
  apiFetch("/api/askHealthAssistant", { prompt });
  // returns: { response: string, source: "gemini"|"groq"|"huggingface"|"cache" }
  // Same question rotates through up to 3 stored answer variants automatically —
  // no extra params needed here, the backend tracks the ask count per question.

// ── Medical Analysis (OCR text → AI summary) ──────────────────────────────────

export const analyzeMedicalDocument = (systemPrompt, ocrText) =>
  apiFetch("/api/analyzeMedicalDocument", { systemPrompt, ocrText });
  // returns: { response: string, source: "gemini"|"groq"|"huggingface"|"cache" }
  // Only the OCR-extracted TEXT is sent — never the image — to keep cost low.

// ── Reminders ──────────────────────────────────────────────────────────────────
// Reads happen client-side via Firestore onSnapshot (see App.jsx), filtered
// to the signed-in user's own reminders. Writes go through the backend so
// ownership is always verified server-side.

export const addReminder = (reminder) =>
  apiFetch("/api/addReminder", reminder);
  // reminder: { text, mode: "once"|"interval", date?, time?, everyHrs?, everyMin? }

export const updateReminder = (reminderId, updates) =>
  apiFetch("/api/updateReminder", { reminderId, updates });

export const deleteReminder = (reminderId) =>
  apiFetch("/api/deleteReminder", { reminderId });

// ── Calendar Notes ───────────────────────────────────────────────────────────
// One Firestore doc per (user, date). Reads via onSnapshot in App.jsx.

export const addCalendarNote = (date, text) =>
  apiFetch("/api/addCalendarNote", { date, text });

export const updateCalendarNote = (date, index, text) =>
  apiFetch("/api/updateCalendarNote", { date, index, text });

export const deleteCalendarNote = (date, index) =>
  apiFetch("/api/deleteCalendarNote", { date, index });