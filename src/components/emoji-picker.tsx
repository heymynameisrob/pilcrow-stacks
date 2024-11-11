import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import ky from "ky";
import Picker from "@emoji-mart/react";

import { Popover, PopoverContent, PopoverTrigger } from "@/primitives/popover";
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

  const { data } = useSuspenseQuery({
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
            "h-7 w-7 rounded-md bg-gray-3 hover:bg-gray-4 p-px !text-base dark:bg-gray-4 dark:hover:bg-gray-5",
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
          autoFocus={true}
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
