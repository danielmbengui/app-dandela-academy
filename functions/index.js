/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// functions/index.js
const admin = require("firebase-admin");

const { onValueWritten } = require("firebase-functions/v2/database");
const logger = require("firebase-functions/logger");
const { onSchedule } = require("firebase-functions/v2/scheduler");
// const { logger } = require("firebase-functions");

admin.initializeApp();
const firestore = admin.firestore();
/**
 * Utilitaire: convertit Timestamp/Date/string -> Date (ou null)
 */
function toDate(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate(); // Firestore Timestamp
  if (value instanceof Date) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

exports.syncLastSeenToFirestore = onValueWritten({
  ref: "/status/{uid}",
  region: "us-central1", // mets la région de TA RTDB
  // instance: "my-project-default-rtdb", // si nécessaire
},
  async (event) => {
    const uid = event.params.uid;
    const before = event.data.before.val();
    const after = event.data.after.val();
    //logger.info("RTDB status written", before, after);
    if (!uid || !after) return;
    const prevState = before?.status;
    const currState = after?.status;
    // Toujours stocker l’état courant
    if (currState === "online") {
      logger.info("is online");
      await admin.firestore().doc(`USERS/${uid}`).set(
        {
          status: "online",
          last_connexion_time: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      return;
    }
    // Quand ça passe offline, on met last_seen_at
    if (prevState === "online" && currState === "offline") {
      //logger.info("is offline");
      await admin.firestore().doc(`USERS/${uid}`).set(
        {
          status: "offline",
          last_connexion_time: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }
    //logger.info("Firestore updated", { uid });
  },
);
// Toutes les heures (cron) - plus fiable que "every 60 minutes"
exports.updateSessionsStatus = onSchedule(
  {
    schedule: "*/5 * * * *",          // à la minute 0 de chaque heure
    timeZone: "Europe/Zurich",      // important pour l’heure locale
    region: "us-central1",         // choisis ta région
    // retryCount: 0,               // optionnel: désactiver les retries
  },
  async (event) => {
    logger.info("hourlyJob triggered", { when: new Date().toISOString() });
    const query = firestore.collection("SESSIONS")
    //.limit(500);
    const snap = await query.get();
    if (snap.empty) return;
    var batch = firestore.batch();
    var count = 0;
    for (const doc of snap.docs) {
      const session = doc.data();
      const slots = session?.slots || [];
      const slots_new = [];
      for (const slot of slots) {
        const endDate = toDate(slot.end_date);
        var slot_new = { ...slot };
        if (!endDate || endDate.getTime() < new Date().getTime()) {
          console.log(`Session ${doc.id} slot ${slot.uid_intern} is past due, updating status to 'finished'`);
          slot_new.status = 'finished';
        }
        slots_new.push(slot_new);
      }
      batch.update(doc.ref, {
        'slots': slots_new,
      }, { merge: true });
      count++;
      if (count === 50) {
        await batch.commit();
        batch = firestore.batch();
        count = 0;
      }
    }
    await batch.commit();
    return null;
  }
);


