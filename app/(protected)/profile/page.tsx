"use client";
import ProfileBody from "@/components/Profile/ProfileBody";
import ProfileHeader from "@/components/Profile/ProfileHeader";

export default function page() {
    return (
        <div className="flex flex-col gap-2 mt-2 max-lg:mx-2 lg:mt-10">
            <ProfileHeader />
            <ProfileBody />
        </div>
    );
}
