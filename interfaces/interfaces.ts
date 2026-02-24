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

export interface IGitHubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
    private: boolean;
}
