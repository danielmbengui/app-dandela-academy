import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // attention au \n dans les variables d'env
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    storageBucket: "dandelapp-bbe09.appspot.com", // ⚠ remplace par le tien
  });
}

//export const firestore = admin.firestore();
//export const authAdmin = admin.auth();
export const firestoreAdmin = admin.firestore();
export const authAdmin = admin.auth();
export const storageAdmin = admin.storage();
export const bucketAdmin = storageAdmin.bucket();
export const FieldValue = admin.firestore.FieldValue;
export const FieldPath = admin.firestore.FieldPath;
export const Timestamp = admin.firestore.Timestamp;
export const GeoPoint = admin.firestore.GeoPoint;
export { admin };