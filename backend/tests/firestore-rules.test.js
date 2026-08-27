const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { initializeTestEnvironment, assertFails, assertSucceeds } = require("@firebase/rules-unit-testing");
const { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs } = require("firebase/firestore");

async function main() {
  const projectId = process.env.FIREBASE_PROJECT_ID || "demo-healio-security";
  const rules = fs.readFileSync(path.join(__dirname, "..", "..", "firestore.rules"), "utf8");
  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
  const [hostPart, portPart] = String(emulatorHost).replace(/^https?:\/\//, "").split(":");
  const host = hostPart || "127.0.0.1";
  const port = Number(process.env.FIRESTORE_EMULATOR_PORT || process.env.FIREBASE_FIRESTORE_EMULATOR_PORT || portPart || 8080);

  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules, host, port },
  });

  try {
    await testEnv.clearFirestore();

    const adminCtx = testEnv.authenticatedContext("admin-uid", { role: "super_admin" });
    const userA = testEnv.authenticatedContext("user-a", { role: "user" });
    const userB = testEnv.authenticatedContext("user-b", { role: "user" });
    const adminDb = adminCtx.firestore();
    const aDb = userA.firestore();
    const bDb = userB.firestore();

    await assertSucceeds(setDoc(doc(adminDb, "users", "admin-uid"), {
      uid: "admin-uid",
      role: "super_admin",
      name: "Admin",
    }));

    await assertSucceeds(setDoc(doc(adminDb, "users", "user-a"), {
      uid: "user-a",
      role: "user",
      name: "User A",
    }));

    await assertSucceeds(setDoc(doc(adminDb, "users", "user-b"), {
      uid: "user-b",
      role: "user",
      name: "User B",
    }));

    await assertSucceeds(setDoc(doc(adminDb, "govt_schemes", "scheme-1"), {
      title: "Scheme 1",
    }));

    await assertSucceeds(setDoc(doc(adminDb, "reminders", "rem-1"), {
      userId: "user-a",
      text: "Take medicine",
      mode: "once",
      done: false,
      paused: false,
    }));

    await assertSucceeds(setDoc(doc(adminDb, "calendar_notes", "user-a_2026-08-11"), {
      userId: "user-a",
      date: "2026-08-11",
      notes: ["Checkup"],
    }));

    await assertSucceeds(setDoc(doc(adminDb, "fcm_tokens", "user-a"), {
      tokens: ["token-1"],
    }));

    await assertSucceeds(getDoc(doc(aDb, "users", "user-a")));
    await assertFails(getDoc(doc(aDb, "users", "user-b")));
    await assertFails(updateDoc(doc(aDb, "users", "user-a"), { role: "super_admin" }));

    await assertSucceeds(getDoc(doc(aDb, "govt_schemes", "scheme-1")));
    await assertFails(setDoc(doc(aDb, "govt_schemes", "scheme-2"), { title: "Nope" }));

    await assertSucceeds(getDoc(doc(aDb, "reminders", "rem-1")));
    await assertFails(getDoc(doc(bDb, "reminders", "rem-1")));
    await assertFails(updateDoc(doc(bDb, "reminders", "rem-1"), { text: "Hijack" }));
    await assertSucceeds(updateDoc(doc(aDb, "reminders", "rem-1"), { text: "Updated" }));

    await assertSucceeds(getDoc(doc(aDb, "calendar_notes", "user-a_2026-08-11")));
    await assertFails(getDoc(doc(bDb, "calendar_notes", "user-a_2026-08-11")));
    await assertFails(deleteDoc(doc(bDb, "calendar_notes", "user-a_2026-08-11")));
    await assertSucceeds(updateDoc(doc(aDb, "calendar_notes", "user-a_2026-08-11"), { notes: ["Updated"] }));

    await assertSucceeds(getDoc(doc(aDb, "fcm_tokens", "user-a")));
    await assertFails(getDoc(doc(bDb, "fcm_tokens", "user-a")));
    await assertFails(updateDoc(doc(bDb, "fcm_tokens", "user-a"), { tokens: [] }));

    const userQuery = query(collection(aDb, "reminders"), where("userId", "==", "user-a"));
    await assertSucceeds(getDocs(userQuery));

    let blockedWrite = false;
    try {
      await setDoc(doc(aDb, "users", "user-b"), { uid: "user-b", role: "user" });
    } catch {
      blockedWrite = true;
    }
    assert.strictEqual(blockedWrite, true, "cross-user write should fail");

    console.log("Firestore rules tests passed.");
  } finally {
    await testEnv.cleanup();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
