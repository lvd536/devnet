"use client";
import ProfileBody from "@/components/Profile/ProfileBody";
import ProfileHeader from "@/components/Profile/ProfileHeader";

export default function page() {
    return (
        <div className="flex flex-col gap-2">
            <ProfileHeader />
            <ProfileBody />
        </div>
    );
}
