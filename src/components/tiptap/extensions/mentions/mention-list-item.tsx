import React from "react";
import { ArrowTurnDownLeftIcon as ReturnIcon } from "@heroicons/react/16/solid";

import { cn } from "@/lib/utils";

import type { Doc } from "@/lib/types";

/* eslint-disable no-unused-vars */
type Props = {
  item: Doc;
  index: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
};
/* eslint-disable no-unused-vars */

export const MentionListItem = ({
  item,
  index,
  selectedIndex,
  onSelect,
}: Props) => {
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
      <div className="flex flex-row items-center justify-center gap-2">
        <small className="truncate whitespace-nowrap font-medium">
          {item.emoji}
        </small>
        <small className="truncate whitespace-nowrap font-medium">
          {item.title!}
        </small>
      </div>
      {index === selectedIndex && <ReturnIcon className="w-4 h-4 opacity-70" />}
    </button>
  );
};
