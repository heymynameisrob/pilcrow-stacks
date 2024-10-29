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
    <div
      className={cn(
        "border shadow-lg relative z-50 w-32 overflow-hidden rounded-md bg-background to-transparent p-1 text-primary outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:bg-gray-2",
        "dark:bg-gray-3 dark:shadow-[0px_0px_0px_0.5px_rgba(0,0,0,1),_0px_4px_4px_rgba(0,0,0,0.24)]",
      )}
    >
      {props.items.map((item: any, index: number) => (
        <div
          className={`flex w-full flex-row items-center gap-1 rounded px-1 py-2 hover:bg-ui-low focus:bg-gray-3 ${
            index === selectedIndex
              ? "dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:shadow-[inset_0px_1px_0px_hsla(0_,0%_,100%_,.02)_,inset_0px_0px_0px_1px_hsla(0_,0%_,100%_,.02)_,0px_1px_2px_rgba(0_,0_,0_,.12)_,0px_2px_4px_rgba(0_,0_,0_,.08)_,0px_0px_0px_0.5px_rgba(0_,0_,0_,.24)]"
              : ""
          }`}
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
