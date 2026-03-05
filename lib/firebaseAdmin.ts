import admin from "firebase-admin";
import path from "path";
import fs from "fs";

let app: admin.app.App;

if (!admin.apps.length) {
    const serviceAccountPath = path.join(
        process.cwd(),
        "serviceAccountKey.json",
    );

    const serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, "utf8"),
    );

    app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    app = admin.app();
}

export const adminAuth = admin.auth(app);
export const adminDb = admin.firestore(app);
