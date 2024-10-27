import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/16/solid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { Tooltip } from "@/components/tooltip";
import { Avatar } from "@/components/avatar";
import { useUser } from "@/queries/user";

export function UserMenu() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  return (
    <DropdownMenu>
      <Tooltip content="Switch theme" side="right">
        <DropdownMenuTrigger asChild>
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
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value: string) => setTheme(value)}
        >
          <DropdownMenuRadioItem className="gap-2" value="light">
            <SunIcon className="w-4 h-4 opacity-80" />
            <small>Light</small>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="gap-2" value="dark">
            <MoonIcon className="w-4 h-4 opacity-80" />
            <small>Dark</small>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="gap-2" value="system">
            <ComputerDesktopIcon className="w-4 h-4 opacity-80" />
            <small>System</small>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
