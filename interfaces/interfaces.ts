import type { FieldValue } from "firebase/firestore";

export interface IUserProfile {
    id?: string;
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

export interface ILike {
    id: string; // userId
    createdAt: number;
}

export interface IComment {
    id: string;

    authorId: string;
    content: string;

    createdAt: number;
}

export interface IFollower {
    id: string; // follower uid
    createdAt: number;
}

export interface IFollowing {
    id: string; // followed user uid
    createdAt: number;
}

export interface IUserBadge {
    id: string;
    title: string;
    description: string;
    icon: string;
    awardedAt: number;
}

export type NotificationType = "like" | "comment" | "follow" | "badge";

export interface INotification {
    id: string;
    type: NotificationType;

    fromUserId: string;
    postId?: string;

    isRead: boolean;
    createdAt: number;
}

export interface IBadge {
    id: string;

    title: string;
    description: string;
    icon: string;

    condition: string;
}

export interface IUserSummary {
    id: string;
    username: string;
    githubUsername: string | null;
    avatarUrl: string | null;
    createdAt?: number | null;
    isFollowing?: boolean;
}
