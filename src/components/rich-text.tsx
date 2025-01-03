import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Mention } from "@tiptap/extension-mention";

import { cn } from "@/lib/utils";
import { defaultExtensions } from "@/components/tiptap/extensions";

export const RichText = ({
  content,
  className,
}: {
  content: any;
  className?: string;
}) => {
  const editor = useEditor({
    content,
    immediatelyRender: false,
    extensions: [
      ...defaultExtensions,
      Mention.configure({
        HTMLAttributes: {
          class:
            "bg-gray-2 px-1 py-0.5 rounded-lg underline text-accent font-normal cursor-pointer hover:bg-gray-3 dark:bg-gray-4 dark:hover:bg-gray-5",
        },
      }),
    ],
    editable: false,
    editorProps: {
      attributes: {
        class: cn(
          "pointer-events-none",
          "prose prose-sm",
          "focus:outline-none",
          "prose-code:before:hidden prose-code:after:hidden",
          "prose-h1:text-base prose-h2:text-base prose-h3:text-base prose-h4:text-base prose-h5:text-base prose-h6:text-base",
          "prose-h1:font-semibold prose-h2:font-semibold prose-h3:font-semibold prose-h4:font-semibold prose-h5:font-semibold prose-h6:font-semibold",
          className,
        ),
      },
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} contentEditable={false} />;
};
