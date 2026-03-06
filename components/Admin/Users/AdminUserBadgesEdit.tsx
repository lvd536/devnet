import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useBadges from "@/hooks/useBadges";
import { Badge } from "@/components/Badge";
import { badgeIcons } from "@/utils/badgeIcons";
import { IUserBadge } from "@/interfaces/interfaces";
import { Plus } from "lucide-react";
import { setUserBadges } from "@/utils/firebaseFunctions";
import { auth } from "@/lib/firebase";

interface Props {
    userBadges: IUserBadge[] | undefined;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AdminUserBadgesEdit({
    open,
    onOpenChange,
    userBadges,
}: Props) {
    const [newBadges, setNewBadges] = useState<IUserBadge[]>(userBadges ?? []);
    const { loading: badgesLoading, badges, error: badgesError } = useBadges();
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        setUserBadges(userId, newBadges)
            .then(() => onOpenChange(false))
            .catch((err) => setError(err.message ?? err));
    }

    if (badgesLoading) return <div>Загрузка...</div>;

    if (badgesError || !badges) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Редактирование бейджиков пользователя
                    </DialogTitle>
                    <DialogDescription>
                        Панель редактирование бейджиков пользователя
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => onSubmit(e)}
                >
                    <Label htmlFor="githubUsername">
                        Бейджики пользователя
                    </Label>
                    <div className="flex flex-1 gap-4">
                        {newBadges
                            ? newBadges.map((badge) => {
                                  const targetBadge = badges.find(
                                      (b) => b.id === badge.id,
                                  )!;
                                  const Icon = badgeIcons[targetBadge.icon];
                                  return (
                                      <div
                                          key={badge.id}
                                          onClick={() =>
                                              setNewBadges(
                                                  newBadges.filter(
                                                      (b) => b.id !== badge.id,
                                                  ),
                                              )
                                          }
                                      >
                                          <Badge
                                              icon={Icon}
                                              description={
                                                  targetBadge.description
                                              }
                                              rarity={targetBadge.rarity}
                                              title={targetBadge.title}
                                          />
                                      </div>
                                  );
                              })
                            : "Пусто..."}

                        <div className="flex gap-2 items-center justify-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center justify-between gap-2">
                                        <Plus
                                            width={20}
                                            height={20}
                                            className="rounded-full p-1 bg-text-muted/30"
                                        />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="sm:max-w-xs bg-background">
                                    <DropdownMenuGroup className="flex flex-1 w-fit">
                                        {badges
                                            .filter(
                                                (badge) =>
                                                    !newBadges.some(
                                                        (b) =>
                                                            b.id === badge.id,
                                                    ),
                                            )
                                            .map((badge, index) => {
                                                const Icon =
                                                    badgeIcons[badge.icon];
                                                return (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setNewBadges(
                                                                (prev) => [
                                                                    ...prev,
                                                                    {
                                                                        id: badge.id,
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
                                                        <Badge
                                                            icon={Icon}
                                                            description={
                                                                badge.description
                                                            }
                                                            rarity={
                                                                badge.rarity
                                                            }
                                                            title={badge.title}
                                                        />
                                                    </DropdownMenuItem>
                                                );
                                            })}
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
