// push.js
// New file — put it next to App.jsx, then import { initPush } from "./push"
// and call initPush(user) once, right after login (see App.jsx integration
// notes below).

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { app, db } from "./firebaseConfig"; // `app` = the firebase.initializeApp() instance

// From Firebase Console → Project Settings → Cloud Messaging → Web Push
// certificates → "Generate key pair". Paste the key here.
const VAPID_KEY = "BHXYOrX7KGkPU7I15JdpcjaAsRHDMGi9zXaCvglYKwifXd1zo5JoHpzVVS_oLj6xUERTeNKhYqT3j3RFLfYuJ0g";

/**
 * Call this once after a successful login. Safe to call every login —
 * it silently no-ops if permission was already denied, and re-registers
 * the token if permission is already granted (tokens can rotate).
 */
export async function initPush(user) {
  if (!user?.uid) return;
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (!("serviceWorker" in navigator)) return;

  try {
    // Register the background service worker (idempotent — safe to call every load).
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    // Ask permission if we haven't already asked/decided.
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted") return;

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) return;

    // Store the token against this user. A user can have multiple tokens
    // (PC + phone), so we keep an array and de-dupe with arrayUnion.
    await setDoc(
      doc(db, "fcm_tokens", user.uid),
      { tokens: arrayUnion(token), updatedAt: serverTimestamp(), email: user.email },
      { merge: true }
    );

    // Optional: show a toast/notification when a push arrives WHILE the tab
    // is open and focused (background messages are handled in the service
    // worker instead — this only fires for the foreground case).
    onMessage(messaging, (payload) => {
      const title = payload.notification?.title || "⏰ Healio+ Reminder";
      const body = payload.notification?.body || "";
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/favicon.ico" });
      }
    });
  } catch (err) {
    console.error("Push setup failed:", err);
  }
}
