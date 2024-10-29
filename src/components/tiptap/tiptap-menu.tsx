import {
  BoldIcon,
  CodeBracketIcon,
  EyeDropperIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@heroicons/react/16/solid";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { BubbleMenu } from "@tiptap/react";
import { forwardRef, useEffect, useRef, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/toggle";

import "tippy.js/animations/scale.css";

const colorClasses = [
  { name: "reset", color: "default", background: "default" },
  {
    name: "red",
    color: "text-red-600 dark:text-red-500",
    background: "bg-red-400 dark:bg-red-500",
  },
  {
    name: "orange",
    color: "text-orange-600 dark:text-orange-500",
    background: "bg-orange-400 dark:bg-orange-500",
  },
  {
    name: "amber",
    color: "text-amber-600 dark:text-amber-500",
    background: "bg-amber-400 dark:bg-amber-500",
  },
  {
    name: "yellow",
    color: "text-yellow-600 dark:text-yellow-500",
    background: "bg-yellow-400 dark:bg-yellow-500",
  },
  {
    name: "lime",
    color: "text-lime-600 dark:text-lime-500",
    background: "bg-lime-400 dark:bg-lime-500",
  },
  {
    name: "green",
    color: "text-green-600 dark:text-green-500",
    background: "bg-green-400 dark:bg-green-500",
  },
  {
    name: "emerald",
    color: "text-emerald-600 dark:text-emerald-500",
    background: "bg-emerald-400 dark:bg-emerald-500",
  },
  {
    name: "teal",
    color: "text-teal-600 dark:text-teal-500",
    background: "bg-teal-400 dark:bg-teal-500",
  },
  {
    name: "cyan",
    color: "text-cyan-600 dark:text-cyan-500",
    background: "bg-cyan-400 dark:bg-cyan-500",
  },
  {
    name: "sky",
    color: "text-sky-600 dark:text-sky-500",
    background: "bg-sky-400 dark:bg-sky-500",
  },
  {
    name: "blue",
    color: "text-blue-600 dark:text-blue-500",
    background: "bg-blue-400 dark:bg-blue-500",
  },
  {
    name: "indigo",
    color: "text-indigo-600 dark:text-indigo-500",
    background: "bg-indigo-400 dark:bg-indigo-500",
  },
  {
    name: "violet",
    color: "text-violet-600 dark:text-violet-500",
    background: "bg-violet-400 dark:bg-violet-500",
  },
  {
    name: "purple",
    color: "text-purple-600 dark:text-purple-500",
    background: "bg-purple-400 dark:bg-purple-500",
  },
  {
    name: "fuchsia",
    color: "text-fuchsia-600 dark:text-fuchsia-500",
    background: "bg-fuchsia-400 dark:bg-fuchsia-500",
  },
  {
    name: "pink",
    color: "text-pink-600 dark:text-pink-500",
    background: "bg-pink-400 dark:bg-pink-500",
  },
  {
    name: "rose",
    color: "text-rose-600 dark:text-rose-500",
    background: "bg-rose-400 dark:bg-rose-500",
  },
];

export function TipTapMenu({ editor }: any) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <DropdownMenu>
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          animation: "scale",
          inertia: true,
        }}
        className="dark rounded-xl border border-secondary bg-gray-2 p-1 text-primary shadow-[0px_103px_29px_0px_rgba(0,_0,_0,_0.00),_0px_66px_26px_0px_rgba(0,_0,_0,_0.04),_0px_37px_22px_0px_rgba(0,_0,_0,_0.13),_0px_16px_16px_0px_rgba(0,_0,_0,_0.21),_0px_4px_9px_0px_rgba(0,_0,_0,_0.25);] animate-in zoom-in-95 slide-in-from-bottom-2 duration-150 ease-out"
      >
        <div className="flex items-center gap-1" ref={ref}>
          <MenuFormatOptions editor={editor} />
          <MenuColorMenu editor={editor} ref={ref} />
        </div>
      </BubbleMenu>
    </DropdownMenu>
  );
}

function MenuFormatOptions({ editor }: any) {
  const onSetLink = () => {
    const isLink = editor.isActive("link");

    if (isLink) {
      editor.commands.unsetLink();
      return;
    }

    const url = window.prompt("Enter the URL of the link:");
    editor.commands.setLink({ href: url });
  };

  return (
    <div className="flex items-center gap-px">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        title="Bold"
        aria-label="Bold"
        data-microtip-position="top"
        role="tooltip"
        onPressedChange={() => editor.commands.toggleBold()}
      >
        <BoldIcon
          className={cn(
            "h-4 w-4",
            editor.isActive("bold") ? "text-primary" : "text-secondary",
          )}
        />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        title="Italic"
        aria-label="Italic"
        data-microtip-position="top"
        role="tooltip"
        onPressedChange={() => editor.commands.toggleItalic()}
      >
        <ItalicIcon
          className={cn(
            "h-4 w-4",
            editor.isActive("italic") ? "text-primary" : "text-secondary",
          )}
        />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        title="Underline"
        aria-label="Underline"
        data-microtip-position="top"
        role="tooltip"
        onPressedChange={() => editor.commands.toggleUnderline()}
      >
        <UnderlineIcon
          className={cn(
            "h-4 w-4",
            editor.isActive("underline") ? "text-primary" : "text-secondary",
          )}
        />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        title="Strike"
        aria-label="Strike"
        data-microtip-position="top"
        role="tooltip"
        onPressedChange={() => editor.commands.toggleStrike()}
      >
        <StrikethroughIcon
          className={cn(
            "h-4 w-4",
            editor.isActive("strike") ? "text-primary" : "text-secondary",
          )}
        />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        title="Code"
        aria-label="Code"
        data-microtip-position="top"
        role="tooltip"
        onPressedChange={() => editor.commands.toggleCode()}
      >
        <CodeBracketIcon
          className={cn(
            "h-4 w-4",
            editor.isActive("code") ? "text-primary" : "text-secondary",
          )}
        />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        title="Link"
        aria-label="Link"
        data-microtip-position="top"
        role="tooltip"
        onPressedChange={onSetLink}
      >
        <LinkIcon
          className={cn(
            "h-4 w-4",
            editor.isActive("link") ? "text-primary" : "text-secondary",
          )}
        />
      </Toggle>
    </div>
  );
}

const MenuColorMenu = forwardRef(({ editor }: any, ref: any) => {
  const [color, setColor] = useState<string>(colorClasses[0].color);

  const handleSetColor = (color: string) => {
    if (color === "default") {
      editor.chain().focus().unsetColor().run();
      setColor("default");
      return;
    }

    editor.chain().focus().setColor(color).run();
    setColor(color);
  };

  /**
   * Sets color in dropdown menu if node has color
   * Updates on editor change
   */
  useEffect(() => {
    if (editor.isActive("textStyle")) {
      const colorClass = editor.getAttributes("textStyle").color;

      setColor(colorClass || "default");
    }
  }, [editor]);

  return (
    <>
      <DropdownMenuTrigger>
        <div
          title="Color"
          aria-label="Color"
          data-microtip-position="top"
          role="tooltip"
          className={
            "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 data-[state=open]:bg-ui-high"
          }
        >
          <EyeDropperIcon className={cn("h-4 w-4 text-secondary", color)} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuPortal container={ref.current}>
        <DropdownMenuContent className="dark z-50 max-w-[10rem] overflow-hidden rounded-lg border border-primary bg-ui p-1 text-primary shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          <DropdownMenuRadioGroup
            value={color}
            onValueChange={handleSetColor}
            className="max-h-[20rem] overflow-y-scroll"
          >
            <>
              {colorClasses.map((color: any) => (
                <DropdownMenuRadioItem
                  value={color.color}
                  key={color.name}
                  className="h-8"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md bg-ui-high !text-xs leading-none",
                        color.color,
                      )}
                    >
                      A
                    </div>
                    <small className="!text-sm capitalize">{color.name}</small>
                  </div>
                </DropdownMenuRadioItem>
              ))}
              <DropdownMenuSeparator />
              {colorClasses.map((color: any) => (
                <DropdownMenuRadioItem
                  value={color.background}
                  key={color.name}
                  className="h-8"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md bg-ui-high !text-xs leading-none text-white",
                        color.background,
                      )}
                    >
                      A
                    </div>
                    <small className="!text-sm capitalize">{color.name}</small>
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </>
  );
});

MenuColorMenu.displayName = "MenuColorMenu";
