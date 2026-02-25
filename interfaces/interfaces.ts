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
    id: string;
    ownerId: string;
    repoId: number;
    repoName: string;
    description: string;
    githubUrl: string;
    stars: number;
    forks: number;
    language: string;
    updatedAt: number;
    createdAt: number;
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

export interface IPost {
    id: string;
    authorId: string;

    content: string;
    projectId?: string;

    likesCount: number;
    commentsCount: number;

    createdAt: number;
}
