import admin from "firebase-admin";

let app: admin.app.App;

if (!admin.apps.length) {
    const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;

    if (!base64Key) {
        throw new Error(
            "Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 environment variable",
        );
    }

    const jsonString = Buffer.from(base64Key, "base64").toString("utf8");
    const serviceAccount = JSON.parse(jsonString);

    app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    app = admin.app();
}

export const adminAuth = admin.auth(app);
export const adminDb = admin.firestore(app);
