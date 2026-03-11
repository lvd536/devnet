import type { FieldValue, Timestamp } from "firebase/firestore";

export type FirestoreCreatedAt = FieldValue | Timestamp | number;

export interface IUserProfile {
    id: string;
    username: string;
    githubUsername: string | null;
    avatarUrl: string | null;

    xp: number;
    level: number;

    role: IRole; // primary role
    roles?: IRole[]; // дополнительные

    stats: {
        postsCount: number;
        likesReceived: number;
        likesGiven: number;
        commentsCount: number;
        followersCount: number;
        followingCount: number;
        projectsCount: number;
        streakDays: number;
        lastActiveDate?: FirestoreCreatedAt;
    };

    createdAt: FirestoreCreatedAt;
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
    updatedAt: FirestoreCreatedAt;
    createdAt: FirestoreCreatedAt;
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

    createdAt: FirestoreCreatedAt;
}

export interface ILike {
    id: string; // userId
    createdAt: FirestoreCreatedAt;
}

export interface IComment {
    id: string;

    authorId: string;
    content: string;

    createdAt: FirestoreCreatedAt;
}

export interface IFollower {
    id: string; // follower uid
    createdAt: FirestoreCreatedAt;
}

export interface IFollowing {
    id: string; // followed user uid
    createdAt: FirestoreCreatedAt;
}

export type NotificationType = "like" | "comment" | "follow" | "badge";

export interface INotification {
    id: string;
    type: NotificationType;

    fromUserId: string;
    postId?: string;

    isRead: boolean;
    createdAt: FirestoreCreatedAt;
}

export interface IUserBadge {
    id: string;
    awardedAt: FirestoreCreatedAt;
    awardedBy: "system" | string;
}

export interface IBadge {
    id: string;
    title: string;
    description: string;

    icon: string;
    rarity: "common" | "rare" | "epic" | "legendary";

    createdAt: FirestoreCreatedAt;
}

export interface IUserSummary {
    id: string;
    username: string;
    githubUsername: string | null;
    avatarUrl: string | null;
    createdAt?: FirestoreCreatedAt | null;
    isFollowing?: boolean;
}

export interface IRole {
    id: string;
    name: string;
    color: string;
    permissions: Array<"admin" | "moderator">;
    priority: number;
    createdAt: FieldValue | Timestamp | number;
}

export interface IUserBanner {
    id: string;
    awardedAt: FirestoreCreatedAt;
    awardedBy: "system" | string;
}

export interface IBanner {
    id: string;
    title: string;
    description: string;

    colors: {
        gradientA: string;
        gradientB: string;
    };
    condition: string;
    createdAt: FirestoreCreatedAt;
}
