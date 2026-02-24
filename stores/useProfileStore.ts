import { IProject, IUserProfile } from "@/interfaces/interfaces";
import { User } from "firebase/auth";
import { create } from "zustand";

interface IUserProfileStore {
    user: User | null;
    profile: IUserProfile | null;
    repositories: IProject[] | null;
    setUser: (user: User | null) => void;
    setProfile: (profile: IUserProfile | null) => void;
    setRepositories: (repos: IProject[] | null) => void;
    pushRepo: (repo: IProject) => void;
}

export const useUserProfileStore = create<IUserProfileStore>()((set, get) => ({
    user: null,
    profile: null,
    repositories: null,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setRepositories: (repos) => {
        if (repos === null) {
            set({ repositories: null });
            return;
        }
        const currentRepos = get().repositories;
        if (!currentRepos) {
            set({ repositories: repos });
            return;
        }
        const merged = Array.from(
            new Map(
                [...currentRepos, ...repos].map((repo) => [repo.repoId, repo]),
            ).values(),
        );

        set({ repositories: merged });
    },
    pushRepo: (repo) => {
        const repos = get().repositories;
        if (!repos) {
            set({ repositories: [repo] });
            return;
        }
        if (repos.find((r) => r.repoId === repo.repoId)) return;

        set({ repositories: [...repos, repo] });
    },
}));

export const setUserData = (user: User, profile: IUserProfile) => {
    useUserProfileStore.getState().setProfile(profile);
    useUserProfileStore.getState().setUser(user);
};
