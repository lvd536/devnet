import type { FieldValue } from "firebase/firestore";

export interface IUserProfile {
    username: string;
    githubUsername: string | null;
    avatarUrl: string | null;
    bio: string;
    xp: number;
    level: number;
    followersCount: number;
    followingCount: number;
    postsCount: number;
    projectsCount: number;
    lastSyncAt: null;
    createdAt: FieldValue;
}

export interface IProject {
    ownerId: string;
    repoName: string;
    description: string;
    stars: number;
    language: string;
    htmlUrl: string;
    updatedAt: Date;
}
