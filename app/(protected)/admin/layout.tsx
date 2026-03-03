"use client";

import { useUserProfileStore } from "@/stores/useProfileStore";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { profile } = useUserProfileStore();
    const isAdmin = profile
        ? [profile.role, ...(profile.roles ?? [])].some((role) =>
              role.permissions.some((perm) => perm.toLowerCase() === "admin"),
          )
        : false;
    if (!isAdmin) return null;
    return children;
}
