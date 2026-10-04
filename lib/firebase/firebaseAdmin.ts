import admin from "firebase-admin";

let app: admin.app.App;

if (!admin.apps.length) {
    const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountRaw) {
        throw new Error(
            "Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable",
        );
    }

    const serviceAccount = JSON.parse(serviceAccountRaw.replace(/\\n/g, "\n"));

    app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    app = admin.app();
}

export const adminAuth = admin.auth(app);
export const adminDb = admin.firestore(app);
