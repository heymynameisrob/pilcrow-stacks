"use client";
import React, { useEffect, useMemo, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";
import { Markdown } from "tiptap-markdown";
import Link from "@tiptap/extension-link";

import { cn } from "@/lib/utils";
import { defaultExtensions } from "@/components/tiptap/extensions";

export const RichText = ({
  content,
  className,
  extensions,
}: {
  content: any;
  className?: string;
  extensions?: any[];
}) => {
  const editor = useEditor({
    content,
    extensions: [...defaultExtensions],
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
