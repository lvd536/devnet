export const browserRoutes = {
    url: {
        name: "Base Url",
        link: "localhost:3000",
    },
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
    api: {
        name: "Admin Api",
        link: "/api",
        admin: {
            deleteUser: {
                name: "Delete user",
                link: (uid: string) => "/api/admin/delete-user/" + uid,
            },
        },
    },
} as const;
