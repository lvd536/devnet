import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { IBanner } from "@/interfaces/interfaces";
import { Palette, Check } from "lucide-react";
import { Lock } from "lucide-react";

interface IProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedBanner: (
        value: React.SetStateAction<IBanner | null | undefined>,
    ) => void;
    userUnAvailableBanners: IBanner[];
    userDetailedBanners: IBanner[];
    selectedBanner: IBanner | null | undefined;
    handleSave: () => void;
}

export default function ProfileBannerEdit({
    isDialogOpen,
    setIsDialogOpen,
    userDetailedBanners,
    userUnAvailableBanners,
    setSelectedBanner,
    selectedBanner,
    handleSave,
}: IProps) {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="link" onClick={() => setIsDialogOpen(true)}>
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
                    {userDetailedBanners && userDetailedBanners.length > 0 ? (
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
                                        if (selectedBanner?.id !== banner.id)
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
    );
}
