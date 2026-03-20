import { serverTimestamp } from "firebase/firestore";

export const getUserBase = (
    username: string,
    avatarUrl: string | null,
    githubUsername: string | null,
) => ({
    username: username,
    role: {
        id: "member",
        name: "Member",
        color: "rgb(124,58,237)",
        permissions: [],
        priority: 0,
        createdAt: serverTimestamp(),
    },
    githubUsername,
    avatarUrl,
    xp: 0,
    level: 1,
    stats: {
        postsCount: 0,
        projectsCount: 0,
        likesReceived: 0,
        likesGiven: 0,
        commentsCount: 0,
        followersCount: 0,
        followingCount: 0,
        streakDays: 0,
        lastActiveDate: serverTimestamp(),
    },
    createdAt: serverTimestamp(),
});
