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

interface IProps {
    userId: string;
    currentBanner: IBanner | null | undefined;
}

export default function ProfileBanner({ userId, currentBanner }: IProps) {
    const [selectedBanner, setSelectedBanner] = useState<
        IBanner | null | undefined
    >(currentBanner);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const {
        userBanners,
        loading: userBannersLoading,
        error: userBannersError,
    } = useUserBanners({ userId });
    const {
        banners,
        loading: bannersLoading,
        error: bannersError,
    } = useBanners();

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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="link"
                        className="absolute top-1 right-1"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Palette className="shrink-0" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Изменение баннера</DialogTitle>
                        <DialogDescription>
                            Сделайте свой профиль еще привлекательнее!
                        </DialogDescription>
                    </DialogHeader>
                    <Field>
                        <Label htmlFor="banners">Доступные баннеры</Label>
                        {userDetailedBanners &&
                        userDetailedBanners.length > 0 ? (
                            <div className="flex flex-wrap gap-2 items-center justify-center">
                                {userDetailedBanners.map((banner) => (
                                    <div
                                        className="relative rounded-lg cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, ${banner.colors.gradientA}, ${banner.colors.gradientB})`,
                                            width: "45%",
                                            height: "100px",
                                        }}
                                        onClick={() => {
                                            if (
                                                selectedBanner?.id !== banner.id
                                            )
                                                setSelectedBanner(banner);
                                            else setSelectedBanner(null);
                                        }}
                                        key={banner.id}
                                    >
                                        <div
                                            className={`absolute top-0 left-0 flex items-center justify-center rounded-lg w-full h-full bg-black/40 transition-opacity duration-300 ${
                                                selectedBanner?.id === banner.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                        >
                                            <Check />
                                        </div>
                                    </div>
                                ))}
                                {userUnAvailableBanners &&
                                    userUnAvailableBanners.length > 0 &&
                                    userUnAvailableBanners.map((banner) => (
                                        <div
                                            className="relative rounded-lg"
                                            style={{
                                                width: "45%",
                                                height: "100px",
                                                background: `linear-gradient(to right, ${banner.colors.gradientA}, ${banner.colors.gradientB})`,
                                            }}
                                            key={banner.id}
                                        >
                                            <div className="absolute top-0 left-0 flex items-center justify-center rounded-lg w-full h-full bg-black/40">
                                                <Lock />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="relative max-w-1/2 h-25 bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl" />
                        )}
                    </Field>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Отмена</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSave}>
                            Сохранить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
