"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import Picker from "@emoji-mart/react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Toggle } from "@/components/toggle";
import { useDoc } from "@/queries/docs";
import { cn } from "@/lib/utils";
import { REVALIDATE_DAY } from "@/lib/fetch";

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
  const [_emoji, setEmoji] = useState<string>(emoji);
  const { saveDoc } = useDoc(docId);

  const { data } = useQuery({
    queryKey: ["emojis"],
    queryFn: async () => {
      const res = ky
        .get("https://cdn.jsdelivr.net/npm/@emoji-mart/data")
        .json();
      return res;
    },
    persister: undefined,
    staleTime: REVALIDATE_DAY,
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Toggle
          pressed={isOpen}
          onPressedChange={setIsOpen}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          data-emoji
          className={cn(
            "h-11 w-11 rounded-lg bg-gray-2 p-px !text-sm",
            disabled && "pointer-events-none",
            className,
          )}
        >
          {_emoji || "📝"}
        </Toggle>
      </PopoverTrigger>
      <PopoverContent
        align="start"
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
            setEmoji(emoji.native);
            setIsOpen(false);
          }}
          previewEmoji={_emoji}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};
