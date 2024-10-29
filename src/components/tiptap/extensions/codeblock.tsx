"use client";

import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";
import { type Editor, NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { ClipboardIcon as CopyIcon } from "@heroicons/react/16/solid";

import { Button } from "@/primitives/button";

export const CodeBlockComponent = ({
  node,
  editor,
}: {
  node: any;
  editor: Editor;
}) => {
  useHotkeys(
    "tab",
    (e) => {
      if (editor.isActive("codeBlock")) {
        const { selection } = editor.view.state;
        const { $anchor } = selection;
        e.preventDefault();
        // indent text
        editor.commands.insertContentAt($anchor.pos, "&#9;");
      }
    },
    {
      enableOnContentEditable: true,
      enabled: editor.isActive("codeBlock"),
    },
  );

  useHotkeys(
    "enter",
    () => {
      // check if codeblock is focused
      if (editor.isActive("codeBlock")) {
        const { selection } = editor.view.state;
        const { $anchor } = selection;
        // indent text
        editor.commands.insertContentAt($anchor.pos, "&#9;");
      }
    },
    {
      enableOnContentEditable: true,
      enabled: editor.isActive("codeBlock"),
    },
  );

  return (
    <NodeViewWrapper className="group relative">
      <Button
        size="sm"
        variant="ghost"
        className="pointer-events-none absolute right-2 top-2 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(node.textContent);
          toast.success("Copied to clipboard");
        }}
      >
        <CopyIcon />
      </Button>
      <pre className="rounded-lg">
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};
