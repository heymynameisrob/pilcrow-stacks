import Link from "next/link";
import { signOut } from "next-auth/react";
import { CogIcon, Squares2X2Icon, BugAntIcon } from "@heroicons/react/16/solid";

import { Button } from "@/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/primitives/dropdown-menu";
import { Tooltip } from "@/primitives/tooltip";
import { Avatar } from "@/components/gradient-avatar";
import { useUser } from "@/queries/user";

export function UserMenu({
  position = "bottom",
}: {
  position: "top" | "bottom";
}) {
  const { user } = useUser();

  if (!user) return null;

  return (
    <DropdownMenu>
      <Tooltip
        content={user.name!}
        side={position === "top" ? "bottom" : "top"}
        align="end"
      >
        <DropdownMenuTrigger asChild className="rounded-full">
          <Button size="icon" variant="ghost">
            <Avatar name={user.name!} />
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent side="top" align="start">
        <DropdownMenuLabel className="flex flex-col">
          <small>{user.name!}</small>
          <small className="text-secondary font-normal">{user.email}</small>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/app" className="gap-2">
              <Squares2X2Icon className="opacity-60" />
              <>Dashboard</>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/app/settings" className="gap-2">
              <CogIcon className="opacity-60" />
              <>Settings</>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`https://twitter.com/intent/tweet?text=@heymynameisrob%20Oi!%20I%20found%20a%20bug%20in%20${process.env.PROJECT_NAME!}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <BugAntIcon className="opacity-60" />
              <>Report a bug</>
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => signOut()} className="text-red-600">
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
