import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";

import { cn } from "@/lib/utils";

export const EmojiList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback(
    (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command({ name: item.name });
      }
    },
    [props],
  );

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => {
    return {
      onKeyDown: (x: any) => {
        if (x.event.key === "ArrowUp") {
          setSelectedIndex(
            (selectedIndex + props.items.length - 1) % props.items.length,
          );
          return true;
        }

        if (x.event.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % props.items.length);
          return true;
        }

        if (x.event.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }

        return false;
      },
    };
  }, [selectedIndex, setSelectedIndex, selectItem, props.items.length]);

  return (
    <div className="z-50 h-auto max-h-[240px] w-64 overflow-y-auto rounded-lg border bg-gray-1 p-1 text-primary shadow-md animate-in animate-out dark:shadow-[0px_0px_0px_0.5px_rgba(0,0,0,1),_0px_4px_4px_rgba(0,0,0,0.24)]">
      {props.items.map((item: any, index: number) => (
        <div
          className={cn(
            "flex w-full flex-row items-center gap-2 h-9 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-3",
            index === selectedIndex
              ? "bg-black/10 dark:bg-white/10 dark:shadow-[inset_0px_1px_0px_hsla(0_,0%_,100%_,.02)_,inset_0px_0px_0px_1px_hsla(0_,0%_,100%_,.02)_,0px_1px_2px_rgba(0_,0_,0_,.12)_,0px_2px_4px_rgba(0_,0_,0_,.08)_,0px_0px_0px_0.5px_rgba(0_,0_,0_,.24)]"
              : "",
          )}
          key={index}
          onClick={() => selectItem(index)}
        >
          <small className="text-xs">{item.emoji}</small>
          <small className="text-xs text-primary">:{item.name}:</small>
        </div>
      ))}
    </div>
  );
});

EmojiList.displayName = "EmojiList";
