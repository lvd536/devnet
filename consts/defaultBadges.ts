import { IUserProfile } from "@/interfaces/interfaces";

type BadgeRule = {
    stat: keyof IUserProfile["stats"];
    conditionValue: number;
    badgeId: string;
};

export const DEFAULT_BADGES = [
    { stat: "likesReceived", conditionValue: 1, badgeId: "first-like" },
    { stat: "likesReceived", conditionValue: 10, badgeId: "liked" },
    { stat: "likesReceived", conditionValue: 50, badgeId: "appreciated" },
    { stat: "likesReceived", conditionValue: 200, badgeId: "well-liked" },
    {
        stat: "likesReceived",
        conditionValue: 1000,
        badgeId: "community-favorite",
    },

    { stat: "commentsCount", conditionValue: 1, badgeId: "first-comment" },
    { stat: "commentsCount", conditionValue: 10, badgeId: "talkative" },
    { stat: "commentsCount", conditionValue: 50, badgeId: "active-discussion" },
    {
        stat: "commentsCount",
        conditionValue: 200,
        badgeId: "discussion-master",
    },
    { stat: "commentsCount", conditionValue: 1000, badgeId: "community-voice" },

    { stat: "postsCount", conditionValue: 1, badgeId: "new-creator" },
    { stat: "postsCount", conditionValue: 5, badgeId: "first-5-posts" },
    { stat: "postsCount", conditionValue: 10, badgeId: "middle-creator" },
    { stat: "postsCount", conditionValue: 20, badgeId: "senior-creator" },

    { stat: "followersCount", conditionValue: 1, badgeId: "new-media" },
    { stat: "followersCount", conditionValue: 10, badgeId: "first-followers" },
    { stat: "followersCount", conditionValue: 50, badgeId: "yung-star" },
    { stat: "followersCount", conditionValue: 200, badgeId: "media" },
    { stat: "followersCount", conditionValue: 500, badgeId: "popular" },
    { stat: "followersCount", conditionValue: 5000, badgeId: "media-giant" },

    { stat: "followingCount", conditionValue: 1, badgeId: "first-sub" },
    { stat: "followingCount", conditionValue: 10, badgeId: "junior-fan" },
    { stat: "followingCount", conditionValue: 100, badgeId: "big-fan" },
] as const satisfies readonly BadgeRule[];
