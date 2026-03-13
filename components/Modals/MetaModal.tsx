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
import { IUserSummary } from "@/interfaces/interfaces";
import MetaUser from "../MetaUser";

interface IProps {
    label: string;
    description?: string;
    triggerLabel: string;
    users?: IUserSummary[];
}

export default function MetaModal({
    label,
    description,
    triggerLabel,
    users,
}: IProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="text-text-secondary p-0">
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{label}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col border-t border-t-border overflow-y-auto">
                    {users && users.length > 0 ? (
                        users.map((user, index) => (
                            <MetaUser user={user} key={`userMeta-${index}`} />
                        ))
                    ) : (
                        <p className="text-md text-center text-text-muted my-2">
                            Пусто...
                        </p>
                    )}
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button">Закрыть</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
