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
        link: (uid: string) => `/user/${uid}`,
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
} as const;
