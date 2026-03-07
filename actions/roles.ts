"use server";
import { adminDb } from "@/lib/firebaseAdmin";
import { IRole } from "@/interfaces/interfaces";
import { getIsAdmin } from "./user";

export async function addRole(idToken: string, role: IRole) {
    try {
        const { isAdmin } = await getIsAdmin(idToken);
        if (!isAdmin) return;

        const rolesRef = adminDb.doc(`roles/${role.id}`);
        await rolesRef.set(role);
    } catch (err) {
        console.error(err);
    }
}

export async function deleteRole(idToken: string, roleId: string) {
    try {
        const { isAdmin } = await getIsAdmin(idToken);
        if (!isAdmin) return;

        const rolesRef = adminDb.doc(`roles/${roleId}`);
        await rolesRef.delete();
    } catch (err) {
        console.error(err);
    }
}
