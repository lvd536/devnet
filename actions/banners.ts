"use server";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import {
    IBanner,
    INotification,
    IUserBanner,
    IUserProfile,
} from "@/interfaces/interfaces";
import { getIsAdmin } from "./user";
import { FieldValue } from "firebase-admin/firestore";
import { addNotification } from "./notifications";

export async function addBanner(idToken: string, banner: IBanner) {
    try {
        const { isAdmin } = await getIsAdmin(idToken);
        if (!isAdmin) return;

        const bannerRef = adminDb.doc(`banners/${banner.id}`);

        const bannerSnap = await bannerRef.get();
        if (bannerSnap.exists) return;

        await bannerRef.set(banner);
    } catch (err) {
        console.error(err);
    }
}

export async function addUserBanner(
    idToken: string,
    userBanner: IUserBanner,
): Promise<"exists" | "error" | "success"> {
    try {
        const { isAdmin, uid } = await getIsAdmin(idToken);
        if (!isAdmin) return "error";

        const userBannerRef = adminDb.doc(
            `users/${uid}/banners/${userBanner.id}`,
        );

        const userBannerSnap = await userBannerRef.get();
        if (userBannerSnap.exists) return "exists";

        await userBannerRef.set(userBanner);
        return "success";
    } catch (err) {
        console.error(err);
        return "error";
    }
}

export async function deleteBanner(idToken: string, bannerId: string) {
    try {
        const { isAdmin } = await getIsAdmin(idToken);
        if (!isAdmin) return;

        const bannerRef = adminDb.doc(`banners/${bannerId}`);
        await bannerRef.delete();
    } catch (err) {
        console.error(err);
    }
}

export async function setUserBanners(
    userId: string,
    banners: (IUserBanner & { id?: string })[],
): Promise<string[]> {
    const colRef = adminDb.collection(`users/${userId}/banners`);
    const batch = adminDb.batch();

    const existingSnap = await colRef.get();

    const newIds = new Set<string>();
    const createdIds: string[] = [];

    for (const b of banners) {
        let docRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
        if (b.id) {
            docRef = colRef.doc(b.id);
            newIds.add(b.id);
        } else {
            docRef = colRef.doc();
            newIds.add(docRef.id);
            createdIds.push(docRef.id);
        }

        const payload: IUserBanner = {
            ...b,
            awardedAt: b.awardedAt ?? Date.now(),
            awardedBy: b.awardedBy ?? "system",
        };

        batch.set(docRef, payload);
    }

    existingSnap.docs.forEach((d) => {
        if (!newIds.has(d.id)) {
            batch.delete(d.ref);
        }
    });

    await batch.commit();

    return Array.from(newIds);
}

function splitCondition(condition: string) {
    if (condition.split(">").length > 1) {
        const result = condition.split(">");
        return [result[0], ">", +result[1]];
    } else if (condition.split("<").length > 1) {
        const result = condition.split("<");
        return [result[0], "<", +result[1]];
    } else if (condition.split("=").length > 1) {
        const result = condition.split("=");
        return [result[0], "=", +result[1]];
    }
}

function checkCondition(
    valueA: number,
    bracket: "<" | ">" | "=",
    valueB: number,
) {
    let res = false;
    switch (bracket) {
        case "<": {
            res = valueA < valueB;
            break;
        }
        case ">": {
            res = valueA > valueB;
            break;
        }
        case "=": {
            res = valueA === valueB;
            break;
        }
    }
    return res;
}

export async function checkBanners(userId: string) {
    const [userSnap, userBannersSnap, banners] = await Promise.all([
        await adminDb.doc(`users/${userId}`).get(),
        await adminDb.collection(`users/${userId}/banners`).get(),
        await adminDb.collection("banners").get(),
    ]);
    if (!userSnap.data() || userBannersSnap.empty || banners.empty) return;
    const user = userSnap.data() as IUserProfile;

    banners.docs.forEach(async (banner) => {
        const { id, condition } = banner.data() as IBanner;
        const conditions = splitCondition(condition);
        if (!conditions || conditions.length < 3) return;
        const [doc, bracket, value] = conditions;

        let conditionValue = 0;

        switch (doc) {
            case "posts":
                conditionValue = user.stats.postsCount;
                break;
            case "likesGiven":
                conditionValue = user.stats.likesGiven;
                break;
            case "likesReceived":
                conditionValue = user.stats.likesReceived;
                break;
            case "comments":
                conditionValue = user.stats.commentsCount;
                break;
            case "followers":
                conditionValue = user.stats.followersCount;
                break;
            case "follows":
                conditionValue = user.stats.followingCount;
                break;
            case "streak":
                conditionValue = user.stats.streakDays;
                break;
        }

        const receiveBanner = checkCondition(
            conditionValue,
            bracket as ">" | "<" | "=",
            +value,
        );

        if (receiveBanner) {
            const newUserBanner: IUserBanner = {
                id,
                awardedBy: "system",
                awardedAt: FieldValue.serverTimestamp(),
            };
            addUserBanner(userId, newUserBanner).then((result) => {
                if (result === "error" || result === "exists") return;
                const notify: Omit<INotification, "id"> = {
                    title: `Вы доступен новый баннер - ${id}`,
                    description: "Можете установить его в профиле",
                    icon: "system",
                    isRead: false,
                    toUserId: userId,
                    type: "system",
                    createdAt: FieldValue.serverTimestamp(),
                };
                addNotification(notify);
            });
        }
    });
}

export async function setUserBanner(idToken: string, banner?: IBanner | null) {
    try {
        const { uid } = await getIsAdmin(idToken);

        const userRef = adminDb.doc(`users/${uid}`);
        await userRef.update({ banner });
    } catch (err) {
        console.error(err);
    }
}
