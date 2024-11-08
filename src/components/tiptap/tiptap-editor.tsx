import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ky from "ky";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { EditorState } from "@tiptap/pm/state";

import { useOpenDocsStore, useReadOnlyStore } from "@/stores/docs";
import { defaultExtensions } from "@/components/tiptap/extensions";
import { Mention } from "@/components/tiptap/extensions/mentions/mention";
import { defaultEditorProps } from "@/components/tiptap/tiptap-props";
import { renderMentions } from "@/components/tiptap/extensions/mentions";
import { TipTapMenu } from "@/components/tiptap/tiptap-menu";
import { useBacklinks } from "@/queries/backlinks";

import type { ApiReturnType, Doc } from "@/lib/types";

export const TipTapEditor = ({
  doc,
  handleOnSave,
}: {
  doc: any;
  handleOnSave: (editor: Editor) => void;
}) => {
  // Local states
  const [focused, setFocused] = useState<boolean>(false);
  const previousState = useRef<EditorState>();

  // Queries & Stores
  const { removeBacklink } = useBacklinks();
  const { closeDoc } = useOpenDocsStore();
  const { readOnlyMode } = useReadOnlyStore();

  useHotkeys("Esc", () => closeDoc(doc.id), {
    enabled: focused,
    preventDefault: true,
    enableOnContentEditable: true,
  });

  /**
   * Setup the editor with the default extensions and editor props.
   */

  const editor = useEditor({
    content: doc.content || "# New document",
    immediatelyRender: false,
    extensions: [
      ...defaultExtensions,
      Mention.configure({
        HTMLAttributes: {
          class:
            "bg-gray-2 px-1 py-0.5 rounded-lg underline text-accent font-normal cursor-pointer hover:bg-gray-3 dark:bg-gray-4 dark:hover:bg-gray-5",
        },
        suggestion: {
          items: async ({ query }: { query: string }) => {
            // We call this fetch here, not in react-query, because tiptap and react-query wont place nice together.
            // Seeing as this is just a fetch call, that is only called when we open items, it's not a big deal

            const { data }: ApiReturnType<Array<Doc>> = await ky
              .get("/api/docs")
              .json();

            if (!data || data.length === 0) return [];

            return (
              data
                ?.filter((doc: Partial<Doc>) => {
                  // convert query to slug and check if it matches
                  return doc?.title
                    ?.toLowerCase()
                    .includes(query.toLowerCase());
                })
                .map((d: Partial<Doc>) => ({
                  ...d,
                  source: doc.id,
                })) ?? []
            );
          },
          render: renderMentions,
        },
      }),
    ],
    editorProps: {
      ...defaultEditorProps,
    },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onUpdate: ({ editor }) => {
      if (!editor) return;

      checkForNodeDeletions({ editor });
      if (handleOnSave) handleOnSave(editor);
    },
  });

  /**
   * Check for deleted mention nodes and remove backlinks
   * Set previous state to ref and compare the diff with current nodes
   */
  const checkForNodeDeletions = useCallback(
    ({ editor }: { editor: Editor }) => {
      // Compare previous/current nodes to detect deleted ones
      const prevMentionNodes: any = [];
      previousState.current?.doc.forEach((node) => {
        if (node.content) {
          node.content.forEach((item: any) => {
            if (item.type.name === "mention") {
              prevMentionNodes.push(item);
            }
          });
        }
      });

      const mentionNodes: any = [];
      editor.state.doc.forEach((node: any) => {
        if (node.content) {
          node.content.forEach((item: any) => {
            if (item.type.name === "mention") {
              mentionNodes.push(item);
            }
          });
        }
      });

      console.log(prevMentionNodes, mentionNodes);

      previousState.current = editor.state;

      prevMentionNodes.forEach((node: any) => {
        if (!mentionNodes.includes(node)) {
          removeBacklink({ target: node.attrs.id, source: doc.id });
        }
      });
    },
    [removeBacklink, doc.id],
  );

  /**
   * Setup editor and make editable
   */

  useEffect(() => {
    if (editor) {
      editor.setOptions({ editable: !readOnlyMode });
      editor.commands.focus("end");
    }
  }, [editor, readOnlyMode]);

  if (!editor) return null;

  return (
    editor && (
      <>
        <TipTapMenu editor={editor} />
        <EditorContent
          disabled={readOnlyMode}
          editor={editor}
          className="prose max-w-prose h-full"
        />
      </>
    )
  );
};
