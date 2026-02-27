"use client";

import DProfileBody from "@/components/Profile/Dynamic/DProfileBody";
import DProfileHeader from "@/components/Profile/Dynamic/DProfileHeader";

export default function page() {
    return (
        <div className="flex flex-col gap-2">
            <DProfileHeader />
            <DProfileBody />
        </div>
    );
}
