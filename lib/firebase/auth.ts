import { updateStreak } from "@/actions/streak";
import { IUserProfile, IProject } from "@/interfaces/interfaces";
import { setUserData } from "@/stores/useProfileStore";
import { User } from "firebase/auth";
import {
    doc,
    collection,
    query,
    where,
    getDoc,
    getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export async function setupUser(user: User) {
    const userRef = doc(db, "users", user.uid);
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("ownerId", "==", user.uid));

    const [userSnap, projectsSnap] = await Promise.all([
        await getDoc(userRef),
        await getDocs(q),
    ]);

    if (!userSnap.exists()) return;

    await updateStreak(user.uid);

    setUserData(
        user,
        { id: userSnap.id, ...userSnap.data() } as IUserProfile,
        projectsSnap.docs.map(
            (proj) =>
                ({
                    id: proj.id,
                    ...proj.data(),
                }) as IProject,
        ),
    );
}
