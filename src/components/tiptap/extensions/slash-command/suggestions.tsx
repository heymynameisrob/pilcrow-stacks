import { ReactNode } from "react";
import {
  CheckSquare,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  TextIcon,
} from "lucide-react";
import {
  InformationCircleIcon,
  ListBulletIcon,
  CodeBracketSquareIcon,
  SquaresPlusIcon,
} from "@heroicons/react/16/solid";

import { getEmbedUrl } from "@/lib/editor";
import { QuoteIcon } from "@radix-ui/react-icons";
import { NumberedListIcon } from "@heroicons/react/16/solid";
import { MinusIcon } from "@heroicons/react/16/solid";
import { AtSymbolIcon } from "@heroicons/react/16/solid";

export type CommandItemProps = {
  id: string;
  title: string;
  icon: ReactNode;
  shortcut?: string;
};

export const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      id: "task-list",
      title: "To-do List",
      shortcut: "[ ]",
      searchTerms: ["todo", "task", "list"],
      icon: <CheckSquare size={16} strokeWidth={2} absoluteStrokeWidth />,
      command: ({ editor, range }: any) =>
        editor.chain().focus().deleteRange(range).toggleTaskList().run(),
    },
    {
      id: "text",
      title: "Text",
      searchTerms: ["text", "p"],
      icon: <TextIcon size={16} strokeWidth={2} absoluteStrokeWidth />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode("paragraph").run();
      },
    },
    {
      id: "heading1",
      title: "Heading 1",
      searchTerms: ["base", "heading", "medium", "h1", "#"],
      shortcut: "#",
      icon: <Heading1Icon size={16} strokeWidth={2} absoluteStrokeWidth />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      id: "heading2",
      title: "Heading 2",
      searchTerms: ["base", "heading", "medium", "h2", "##"],
      shortcut: "##",
      icon: <Heading2Icon size={16} strokeWidth={2} absoluteStrokeWidth />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      id: "heading3",
      title: "Heading 3",
      shortcut: "###",
      searchTerms: ["base", "heading", "small", "h3", "###"],
      icon: <Heading3Icon size={16} strokeWidth={2} absoluteStrokeWidth />,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      id: "callout",
      title: "Callout",
      searchTerms: ["panel", "info"],
      icon: <InformationCircleIcon className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setCallout().run();
      },
    },
    {
      id: "bullet-list",
      title: "Bullet List",
      shortcut: "-",
      searchTerms: ["unordered", "point"],
      icon: <ListBulletIcon className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      id: "number-list",
      title: "Numbered List",
      shortcut: "1.",
      searchTerms: ["ordered", "number", "point"],
      icon: <NumberedListIcon className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      id: "blockquote",
      title: "Blockquote",
      shortcut: ">",
      searchTerms: ["blockquote"],
      icon: <QuoteIcon className="w-4 h-4" />,
      command: ({ editor, range }: any) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
    },
    {
      id: "codeblock",
      title: "Codeblock",
      shortcut: "```",
      searchTerms: ["base", "code", "codeblock"],
      icon: <CodeBracketSquareIcon className="w-4 h-4" />,
      command: ({ editor, range }: any) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      id: "divider",
      title: "Divider",
      shortcut: "---",
      searchTerms: ["divider", "hr", "---"],
      icon: <MinusIcon className="w-4 h-4" />,
      command: ({ editor, range }: any) =>
        editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
    },
    {
      id: "embed",
      title: "Embed",
      searchTerms: [
        "media",
        "embed",
        "video",
        "media",
        "figma",
        "loom",
        "youtube",
      ],
      icon: <SquaresPlusIcon className="w-4 h-4" />,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).run();

        const url = window.prompt("Enter the URL:");
        const embedUrl = getEmbedUrl(url);

        if (embedUrl) {
          editor.chain().focus().setIframe({ src: embedUrl }).run();
        }

        return;
      },
    },
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.shortcut?.toLowerCase().includes(search) ||
        (item.searchTerms &&
          item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
};
