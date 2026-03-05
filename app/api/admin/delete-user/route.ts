import { NextRequest } from "next/server";
import { adminDeleteUser } from "@/lib/adminDeleteUser";
import { adminAuth } from "@/lib/firebaseAdmin";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader)
            return Response.json({ error: "Unauthorized" }, { status: 401 });

        const token = authHeader.replace("Bearer ", "");
        const decoded = await adminAuth.verifyIdToken(token);
        const userDoc = await adminDb.doc(`users/${decoded.uid}`).get();
        const role = userDoc.data()?.role;

        if (!role || role.id !== "admin") {
            return Response.json(
                { error: "Not enough permissions" },
                { status: 403 },
            );
        }

        const { uid } = await req.json();
        if (!uid)
            return Response.json({ error: "uid required" }, { status: 400 });

        await adminDeleteUser(uid);

        return Response.json({
            success: true,
        });
    } catch (err) {
        console.error(err);

        return Response.json({ error: "Internal error" }, { status: 500 });
    }
}
