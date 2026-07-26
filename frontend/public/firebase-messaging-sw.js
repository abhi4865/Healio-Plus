/* firebase-messaging-sw.js
 * MUST live at the web root: public/firebase-messaging-sw.js
 * (so it's served at https://healthgpt-90b51.web.app/firebase-messaging-sw.js —
 * FCM requires this exact scope, it will NOT work from a subfolder.)
 *
 * This runs in the background, independent of any open tab. It's what lets
 * a reminder notification pop up on your PC or phone even if Healio+ isn't
 * open in the browser at all.
 */

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Same config as your frontend's firebaseConfig.js — copy the values over.
firebase.initializeApp({
  apiKey: "AIzaSyBMRuwMC8L3yE1_aZuInxgOLnYUXi84vO4",
  authDomain: "healthgpt-90b51.firebaseapp.com",
  projectId: "healthgpt-90b51",
  storageBucket: "healthgpt-90b51.firebasestorage.app",
  messagingSenderId: "270188169283",
  appId: "1:270188169283:web:aabf2aae7f7774ea8aacf6",
});

const messaging = firebase.messaging();

// Fires when a push arrives while no Healio+ tab is focused/open.
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "⏰ Healio+ Reminder";
  const body = payload.notification?.body || "";
  self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: payload.data?.reminderId ? `reminder-${payload.data.reminderId}` : undefined,
    requireInteraction: true,
    data: { url: "/" },
  });
});

// Clicking the notification focuses/opens the app.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("/");
    })
  );
});
