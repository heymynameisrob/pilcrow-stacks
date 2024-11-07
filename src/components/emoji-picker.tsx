"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import Picker from "@emoji-mart/react";

import { Popover, PopoverContent, PopoverTrigger } from "@/primitives/popover";
import { Toggle } from "@/primitives/toggle";
import { useDoc } from "@/queries/docs";
import { cn } from "@/lib/utils";
import { REVALIDATE_DAY } from "@/lib/fetch";
import { Button } from "@/primitives/button";

type EmojiPickerProps = {
  docId: string;
  emoji: string;
  disabled?: boolean;
  className?: string;
};

export const EmojiPicker = ({
  docId,
  emoji,
  disabled,
  className,
}: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { saveDoc } = useDoc(docId);

  const { data } = useQuery({
    queryKey: ["emojis"],
    queryFn: async () => {
      const res = ky
        .get("https://cdn.jsdelivr.net/npm/@emoji-mart/data")
        .json();
      return res;
    },
    staleTime: REVALIDATE_DAY,
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-9 w-9 rounded-lg bg-gray-3 dark:bg-gray-2 p-px !text-base",
            disabled && "pointer-events-none",
            className,
          )}
        >
          {emoji || "📝"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        avoidCollisions={true}
        className="w-[350px] overflow-hidden border-0 p-0"
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => {
            saveDoc({
              id: docId,
              emoji: emoji.native,
            });
            setIsOpen(false);
          }}
          previewEmoji={emoji}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};
