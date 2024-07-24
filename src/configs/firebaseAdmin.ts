import admin from "firebase-admin";

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  FIREBASE_CLIENT_X509_CERT_URL,
} = process.env;

// Ensure that all required environment variables are defined
if (
  !FIREBASE_PROJECT_ID ||
  !FIREBASE_PRIVATE_KEY ||
  !FIREBASE_CLIENT_EMAIL ||
  !FIREBASE_PRIVATE_KEY_ID ||
  !FIREBASE_CLIENT_ID ||
  !FIREBASE_AUTH_URI ||
  !FIREBASE_TOKEN_URI ||
  !FIREBASE_AUTH_PROVIDER_X509_CERT_URL ||
  !FIREBASE_CLIENT_X509_CERT_URL
) {
  throw new Error("One or more Firebase environment variables are missing.");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.firestore();

export { db, admin };
