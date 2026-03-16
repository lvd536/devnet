import { IProject } from "@/interfaces/interfaces";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export async function getProjectData(projectId: string) {
    try {
        const projectRef = doc(db, "projects", projectId);
        const projectSnapshot = await getDoc(projectRef);
        if (projectSnapshot.exists()) {
            const project = {
                id: projectSnapshot.id,
                ...projectSnapshot.data(),
            } as IProject;
            return project;
        }
    } catch (err) {
        console.error(err);
    }
}
