import { IRole } from "@/interfaces/interfaces";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
} from "../ui/dropdown-menu";
import RolePill from "../RolePill";
import { Button } from "../ui/button";

interface IProps {
    role: IRole;
    roles: IRole[] | undefined;
}

export default function ProfileRole({ role, roles }: IProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 m-0">
                    <RolePill
                        role={{ ...role }}
                        variant="outline"
                        size="sm"
                        showDot={false}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup className="flex flex-col items-center justify-center bg-background py-1">
                    {roles ? (
                        roles.map((role) => (
                            <RolePill
                                key={role.id}
                                role={{ ...role }}
                                variant="outline"
                                size="sm"
                                showDot={false}
                            />
                        ))
                    ) : (
                        <DropdownMenuLabel>Нет других ролей</DropdownMenuLabel>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
