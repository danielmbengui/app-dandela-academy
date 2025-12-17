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
const {onValueWritten} = require("firebase-functions/v2/database");
const logger = require("firebase-functions/logger");

admin.initializeApp();

exports.syncLastSeenToFirestore = onValueWritten({
  ref: "/status/{uid}",
  region: "us-central1", // mets la région de TA RTDB
  // instance: "my-project-default-rtdb", // si nécessaire
},
async (event) => {
  const uid = event.params.uid;
  const before = event.data.before.val();
  const after = event.data.after.val();
  logger.info("RTDB status written", {uid, before, after});
  if (!uid || !after) return;
  const wasOnline = before?.state === "online";
  const isOffline = after?.state === "offline";
  if (!wasOnline || !isOffline) return;
  await admin.firestore().doc(`users/${uid}`).set(
      {
        last_seen_at: admin.firestore.FieldValue.serverTimestamp(),
        presence_last_state: "offline",
      },
      {merge: true},
  );
  logger.info("Firestore updated", {uid});
},
);


