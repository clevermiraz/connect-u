import { AvatarProps } from "@radix-ui/react-avatar";
import { User } from "next-auth";
import Image from "next/image";

import { Icons } from "@/components/Icons";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "name" | "image">;
}

export default function UserAvatar({ user, ...props }: UserAvatarProps) {
    return (
        <Avatar {...props}>
            {user?.image ? (
                <div className="relative aspect-square h-full w-full">
                    <Image fill src={user.image} alt="Profile Image" referrerPolicy="no-referrer" />
                </div>
            ) : (
                <AvatarFallback>
                    <span className="sr-only"> {user.name}</span>
                    <Icons.user className="h-4 w-4" />
                </AvatarFallback>
            )}
        </Avatar>
    );
}
