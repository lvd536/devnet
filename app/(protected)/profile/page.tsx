"use client";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileNavigation from "@/components/Profile/ProfileNavigation";

export default function page() {
    return (
        <div className="flex flex-col gap-2 mt-2 max-lg:mx-2 lg:mt-10">
            <ProfileHeader />
            <ProfileNavigation />
        </div>
    );
}
