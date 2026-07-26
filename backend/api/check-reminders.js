// api/check-reminders.js
// New file for your Vercel backend project (same one that already has
// addReminder/updateReminder/deleteReminder etc).
//
// A free external cron (cron-job.org) hits this endpoint once a minute.
// It scans all active reminders across all users, figures out which ones
// are due using the SAME computeNextFire logic as your frontend, and
// sends a real FCM push to every device token that user has registered.

const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Vercel env vars store newlines as literal "\n" — this converts them back.
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();
const messaging = admin.messaging();

// ── Same fire-time math as computeNextFire() in App.jsx ─────────────────────
function computeNextFire(r) {
  if (r.mode === "once") {
    if (!r.date || !r.time) return null;
    const t = new Date(`${r.date}T${r.time}:00`).getTime();
    return Number.isNaN(t) ? null : t;
  }
  const intervalMs = ((Number(r.everyHrs) || 0) * 60 + (Number(r.everyMin) || 0)) * 60 * 1000;
  if (!intervalMs) return null;
  const base = toMillis(r.lastFired) || toMillis(r.createdAt) || Date.now();
  return base + intervalMs;
}

function toMillis(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return v;
  if (typeof v.toMillis === "function") return v.toMillis();
  if (typeof v._seconds === "number") return v._seconds * 1000; // raw Firestore Timestamp JSON shape
  return null;
}

module.exports = async (req, res) => {
  // Simple shared-secret check so randoms on the internet can't spam-trigger this.
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const snap = await db
      .collection("reminders")
      .where("done", "==", false)
      .where("paused", "==", false)
      .get();

    const now = Date.now();
    const results = [];

    for (const docSnap of snap.docs) {
      const r = { ...docSnap.data(), id: docSnap.id };
      const fireAt = computeNextFire(r);
      if (fireAt === null || fireAt > now) continue;

      // Look up this user's push tokens.
      const tokenDoc = await db.collection("fcm_tokens").doc(r.userId).get();
      const tokens = tokenDoc.exists ? tokenDoc.data().tokens || [] : [];

      if (tokens.length > 0) {
        const message = {
          notification: {
            title: "⏰ Healio+ Reminder",
            body: r.text || "You have a reminder.",
          },
          data: { reminderId: r.id },
          tokens,
        };
        const sendResult = await messaging.sendEachForMulticast(message);

        // Prune tokens Firebase says are dead/unregistered, so the array
        // doesn't grow forever with stale devices.
        const deadTokens = [];
        sendResult.responses.forEach((resp, i) => {
          if (!resp.success && resp.error?.code === "messaging/registration-token-not-registered") {
            deadTokens.push(tokens[i]);
          }
        });
        if (deadTokens.length > 0) {
          await db.collection("fcm_tokens").doc(r.userId).update({
            tokens: admin.firestore.FieldValue.arrayRemove(...deadTokens),
          });
        }
      }

      // Mark it fired — same logic as the frontend tick loop.
      if (r.mode === "once") {
        await docSnap.ref.update({ done: true, lastFired: now });
      } else {
        await docSnap.ref.update({ lastFired: now });
      }

      results.push({ id: r.id, userId: r.userId, tokensNotified: tokens.length });
    }

    return res.status(200).json({ checked: snap.size, fired: results.length, results });
  } catch (err) {
    console.error("check-reminders error:", err);
    return res.status(500).json({ error: err.message });
  }
};
