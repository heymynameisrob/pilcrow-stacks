"use client";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { Editor } from "@tiptap/react";

import { updateScrollView } from "@/components/tiptap/extensions/slash-command";
import { MentionListItem } from "@/components/tiptap/extensions/mentions/mention-list-item";
import { useBacklinks } from "@/queries/backlinks";
import { cn } from "@/lib/utils";

import type { Doc } from "@/lib/types";

interface MentionItems extends Doc {
  source: string;
}

export const MentionList = ({
  items,
  editor,
  command,
}: {
  items: Array<MentionItems>;
  editor: Editor;
  command: any;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { newBacklink } = useBacklinks(); // Source is the current document on page

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];

      if (item) {
        // Document being @ mentoned
        command({ id: item.id, label: item.title });
        console.log({ target: item.id, source: item.source });
        newBacklink({ target: item.id!, source: item.source });
      }
    },
    [command, items, newBacklink],
  );

  /**
   * Handle keyboard events for navigating the list.
   * Tippy.js doesn't provide out-of-the-box support for this.
   */
  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = ref?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return (
    <div
      id="mention"
      ref={ref}
      className={cn(
        "z-50 w-72 overflow-hidden rounded-lg border bg-gray-1 p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "dark:bg-gray-3 dark:shadow-[0px_0px_0px_0.5px_rgba(0,0,0,1),_0px_4px_4px_rgba(0,0,0,0.24)]",
      )}
    >
      <div className="flex px-1 py-1 text-left">
        <span className="font-bold uppercase text-gray-7 text-xs">Notes</span>
      </div>
      {items.length ? (
        items.map((item: any, index: number) => {
          return (
            <MentionListItem
              key={item.id}
              item={item}
              index={index}
              selectedIndex={selectedIndex}
              onSelect={selectItem}
            />
          );
        })
      ) : (
        <div className="text-center text-muted">No notes found</div>
      )}
    </div>
  );
};
