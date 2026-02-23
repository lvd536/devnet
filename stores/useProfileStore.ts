import { IUserProfile } from "@/interfaces/interfaces";
import { User } from "firebase/auth";
import { create } from "zustand";

interface IUserProfileStore {
    user: User | null;
    profile: IUserProfile | null;
    setUser: (user: User) => void;
    setProfile: (profile: IUserProfile) => void;
}

export const useUserProfileStore = create<IUserProfileStore>()((set) => ({
    user: null,
    profile: null,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
}));

export const setUserData = (user: User, profile: IUserProfile) => {
    useUserProfileStore.getState().setProfile(profile);
    useUserProfileStore.getState().setUser(user);
};
