import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { IBadge, IBanner, INotification, IRole } from "@/interfaces/interfaces";

export async function getRoles(): Promise<IRole[] | undefined> {
    const rolesRef = collection(db, "roles");
    const rolesSnap = await getDocs(rolesRef);

    if (rolesSnap.empty) return undefined;
    else
        return rolesSnap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as IRole,
        );
}
export async function getBadges(): Promise<IBadge[] | undefined> {
    const badgesRef = collection(db, "badges");
    const badgesSnap = await getDocs(badgesRef);

    if (badgesSnap.empty) return undefined;
    else
        return badgesSnap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as IBadge,
        );
}

export async function getBanners(): Promise<IBanner[] | undefined> {
    const bannersRef = collection(db, "banners");
    const bannersSnap = await getDocs(bannersRef);

    if (bannersSnap.empty) return undefined;
    else
        return bannersSnap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as IBanner,
        );
}

export async function getSystemNotifications(): Promise<
    INotification[] | undefined
> {
    const notificationsRef = query(
        collection(db, "notifications"),
        where("toUserId", "==", "system"),
    );
    const notificationsSnap = await getDocs(notificationsRef);

    if (notificationsSnap.empty) return undefined;
    else
        return notificationsSnap.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as INotification,
        );
}
