export const browserRoutes = {
    home: {
        name: "Home",
        link: "/",
    },
    profile: {
        name: "Profile",
        link: "/profile",
    },
    user: {
        name: "User profile",
        link: (uid: string) => `/${uid}`,
    },
    auth: {
        login: {
            name: "Login page",
            link: "/login",
        },
        register: {
            name: "Register page",
            link: "/register",
        },
    },
    explore: {
        name: "Explore page",
        link: "/explore",
    },
    notifications: {
        name: "Notify page",
        link: "/notifications",
    },
    post: {
        name: "User Post",
        link: (postId: string) => `/post/${postId}`,
    },
    admin: {
        name: "Admin console",
        link: "/admin",
    },
} as const;
