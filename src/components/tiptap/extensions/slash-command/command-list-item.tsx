"use client";
import React from "react";

import { CommandItemProps } from "@/components/tiptap/extensions/slash-command/suggestions";
import { cn } from "@/lib/utils";
import { Key } from "@/primitives/key";

/* eslint-disable no-unused-vars */
type CommandListItemProps = {
  item: CommandItemProps;
  index: number;
  selectedIndex: number;
  isLoading: boolean;
  onSelect: (index: number) => void;
};
/* eslint-disable no-unused-vars */

export const CommandListItem = ({
  item,
  index,
  selectedIndex,
  onSelect,
}: CommandListItemProps) => {
  return (
    <button
      className={cn(
        "flex w-full flex-row items-center justify-between gap-2 h-9 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-3",
        index === selectedIndex
          ? "bg-black/10 dark:bg-white/10 dark:shadow-[inset_0px_1px_0px_hsla(0_,0%_,100%_,.02)_,inset_0px_0px_0px_1px_hsla(0_,0%_,100%_,.02)_,0px_1px_2px_rgba(0_,0_,0_,.12)_,0px_2px_4px_rgba(0_,0_,0_,.08)_,0px_0px_0px_0.5px_rgba(0_,0_,0_,.24)]"
          : "",
      )}
      key={item.id}
      onClick={() => onSelect(index)}
    >
      <div className="flex flex-row items-center justify-center gap-2 [&_svg]:pointer-events-none [&_svg]:opacity-70 [&_svg]:shrink-0">
        {item.icon}
        <small className="font-medium">{item.title}</small>
      </div>
      {item.shortcut && (
        <Key className="w-auto px-1 dark:border-secondary">{item.shortcut}</Key>
      )}
    </button>
  );
};
