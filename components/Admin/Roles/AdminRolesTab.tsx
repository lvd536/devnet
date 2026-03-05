"use client";
import useRoles from "@/hooks/useRoles";
import AdminRoleCreation from "./AdminRoleCreation";
import { AdminRolesTable } from "./AdminRolesTable";

export default function AdminRolesTab() {
    const { roles, loading, error } = useRoles();

    if (loading) return <div>Загрузка...</div>;

    if (error || roles === undefined) return null;

    return (
        <div className="relative flex w-full h-full flex-col items-center gap-4 mt-2">
            <AdminRoleCreation roles={roles} />
            <AdminRolesTable roles={roles} />
        </div>
    );
}
