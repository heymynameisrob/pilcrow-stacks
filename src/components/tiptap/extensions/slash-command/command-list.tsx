import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { Editor } from "@tiptap/react";

import { updateScrollView } from "@/components/tiptap/extensions/slash-command";
import { CommandItemProps } from "@/components/tiptap/extensions/slash-command/suggestions";
import { CommandListItem } from "@/components/tiptap/extensions/slash-command/command-list-item";

export const CommandList = ({
  items,
  editor,
  command,
}: {
  items: Array<CommandItemProps>;
  editor: Editor;
  command: any;
  range?: any;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];

      if (item && item.id === "ai-complete") {
        const selection = editor?.state.selection;
        if (!selection) return;

        editor?.commands.deleteRange({
          from: selection.from - 1,
          to: selection.from,
        });
      }

      return command(item);
    },
    [command, editor, items],
  );

  /**
   * Handle keyboard events for navigating the list.
   * Tippy.js doesn't provide out-of-the-box support for this.
   */
  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      console.log("Keydown", e.key);
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
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div
      id="slash-command"
      ref={commandListContainer}
      className="z-50 h-auto max-h-[240px] w-64 overflow-y-auto rounded-lg border bg-gray-1 p-1 text-primary shadow-md animate-in animate-out dark:shadow-[0px_0px_0px_0.5px_rgba(0,0,0,1),_0px_4px_4px_rgba(0,0,0,0.24)]"
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <CommandListItem
            key={item.id}
            item={item}
            index={index}
            selectedIndex={selectedIndex}
            isLoading={false}
            onSelect={selectItem}
          />
        );
      })}
    </div>
  ) : null;
};
