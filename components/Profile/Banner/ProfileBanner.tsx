"use client";
import useBanners from "@/hooks/useBanners";
import useUserBanners from "@/hooks/useUserBanners";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Check, Lock, Palette } from "lucide-react";
import { IBanner } from "@/interfaces/interfaces";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { setUserBanner } from "@/actions/banners";
import ProfileBannerEdit from "./ProfileBannerEdit";
import { ThemeToggle } from "@/components/Themes/ThemeToggle";

interface IProps {
    userId: string;
    currentBanner: IBanner | null | undefined;
}

export default function ProfileBanner({ userId, currentBanner }: IProps) {
    const [selectedBanner, setSelectedBanner] = useState<
        IBanner | null | undefined
    >(currentBanner);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { userBanners, error: userBannersError } = useUserBanners({ userId });
    const { banners, error: bannersError } = useBanners();

    const userDetailedBanners =
        banners && userBanners
            ? banners.filter((banner) =>
                  userBanners.some((b) => b.id === banner.id),
              )
            : [];
    const userUnAvailableBanners =
        banners && userBanners
            ? banners.filter(
                  (banner) => !userBanners.some((b) => b.id === banner.id),
              )
            : [];

    function handleSave() {
        const user = auth.currentUser;
        if (!user) return;

        user.getIdToken().then((token) => {
            setUserBanner(token, selectedBanner).then(() => {
                setIsDialogOpen(false);
            });
        });
    }

    if (bannersError || userBannersError) return null;

    return (
        <div
            className={`relative w-full h-50 rounded-2xl ${
                !selectedBanner
                    ? "bg-linear-to-r from-violet-600 to-indigo-600"
                    : ""
            }`}
            style={
                selectedBanner
                    ? {
                          background: `linear-gradient(to right, ${selectedBanner.colors.gradientA}, ${selectedBanner.colors.gradientB})`,
                      }
                    : undefined
            }
        >
            <div className="absolute top-1 right-1 flex flex-col gap-2">
                <ProfileBannerEdit
                    isDialogOpen={isDialogOpen}
                    selectedBanner={selectedBanner}
                    handleSave={handleSave}
                    setIsDialogOpen={setIsDialogOpen}
                    setSelectedBanner={setSelectedBanner}
                    userDetailedBanners={userDetailedBanners}
                    userUnAvailableBanners={userUnAvailableBanners}
                />
                <ThemeToggle />
            </div>
        </div>
    );
}
