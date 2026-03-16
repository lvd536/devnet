import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IUserBanner } from "@/interfaces/interfaces";
import { Plus } from "lucide-react";
import { auth } from "@/lib/firebase/firebase";
import useBanners from "@/hooks/useBanners";
import { setUserBanners } from "@/actions/banners";

interface Props {
    userBanners?: IUserBanner[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AdminUserBannersEdit({
    open,
    onOpenChange,
    userBanners,
}: Props) {
    const [newBanners, setNewBanners] = useState<IUserBanner[]>(
        userBanners ?? [],
    );
    const {
        loading: bannersLoading,
        banners,
        error: bannersError,
    } = useBanners();
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;
        setUserBanners(user.uid, newBanners)
            .then(() => onOpenChange(false))
            .catch((err) => setError(err.message ?? err));
    }

    if (bannersLoading) return <div>Загрузка...</div>;

    if (bannersError || !banners) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Редактирование баннеров пользователя
                    </DialogTitle>
                    <DialogDescription>
                        Панель редактирование баннеров пользователя
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => onSubmit(e)}
                >
                    <Label htmlFor="githubUsername">Баннеры пользователя</Label>
                    <div className="flex flex-1 flex-wrap gap-4">
                        {newBanners
                            ? newBanners.map((banner) => {
                                  const targetBanner = banners.find(
                                      (b) => b.id === banner.id,
                                  )!;
                                  return (
                                      <div
                                          key={banner.id}
                                          onClick={() =>
                                              setNewBanners(
                                                  newBanners.filter(
                                                      (b) => b.id !== banner.id,
                                                  ),
                                              )
                                          }
                                      >
                                          <div
                                              className="w-40 h-20 rounded-lg"
                                              style={{
                                                  background: `linear-gradient(to right, ${targetBanner.colors.gradientA}, ${targetBanner.colors.gradientB})`,
                                              }}
                                          />
                                      </div>
                                  );
                              })
                            : "Пусто..."}

                        <div className="flex gap-2 items-center justify-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex w-40 h-20 items-center justify-between gap-2">
                                        <Plus
                                            width={20}
                                            height={20}
                                            className="rounded-full p-1 bg-text-muted/30"
                                        />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="sm:max-w-xs bg-background">
                                    <DropdownMenuGroup className="flex flex-1 w-fit">
                                        {banners
                                            .filter(
                                                (banner) =>
                                                    !newBanners.some(
                                                        (b) =>
                                                            b.id === banner.id,
                                                    ),
                                            )
                                            .map((banner, index) => (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setNewBanners(
                                                            (prev) => [
                                                                ...prev,
                                                                {
                                                                    id: banner.id,
                                                                    awardedAt:
                                                                        new Date().getTime(),
                                                                    awardedBy:
                                                                        "system",
                                                                },
                                                            ],
                                                        )
                                                    }
                                                    key={`badge-${index}`}
                                                >
                                                    <div
                                                        className="w-40 h-20 rounded-lg"
                                                        style={{
                                                            background: `linear-gradient(to right, ${banner.colors.gradientA}, ${banner.colors.gradientB})`,
                                                        }}
                                                    />
                                                </DropdownMenuItem>
                                            ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}
                    <DialogFooter className="pt-4 sm:flex-col">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
