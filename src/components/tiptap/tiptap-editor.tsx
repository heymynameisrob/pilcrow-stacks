import { useCallback, useEffect, useRef, useState } from "react";
import ky from "ky";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { EditorState } from "@tiptap/pm/state";
import { Loader } from "lucide-react";

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
  const [ready, setReady] = useState<boolean>(false);
  const previousState = useRef<EditorState>();

  // Queries
  const { removeBacklink } = useBacklinks();

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
            "bg-ui-low border border-secondary px-1 py-0.5 rounded-lg underline text-accent font-normal cursor-pointer hover:bg-ui",
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
    onUpdate: ({ editor }) => {
      if (!editor || !ready) return;

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

      previousState.current = editor.state;

      prevMentionNodes.forEach((node: any) => {
        if (!mentionNodes.includes(node)) {
          removeBacklink({ target: node.attrs.id, source: doc.id });
        }
      });
    },
    [removeBacklink, doc],
  );

  // /**
  //  * AI Completion - This is here because it's triggered by the slash command
  //  * But has to be in the editor so it works when the command list closes after firing
  //  * Also we can "stream" by inserting the text as it comes in
  //  */
  // const prev = useRef("");

  // const { completion, isLoading } = useCompletion({
  //   id: "complete",
  //   api: "/api/ai/complete",
  //   onFinish: (completion) => {
  //     console.log("completion", completion);
  //     editor?.commands.setTextSelection({
  //       from: editor.state.selection.from - completion.length,
  //       to: editor.state.selection.from,
  //     });
  //   },
  //   onError: (error) => {
  //     console.error("Something went wrong.", error.message);
  //     va.track("ai-completion-error", {
  //       error: error.message,
  //     });
  //   },
  // });

  // // Insert chunks of the generated text
  // useEffect(() => {
  //   const diff = completion.slice(prev.current.length);
  //   prev.current = completion;
  //   editor?.commands.insertContent(diff);
  // }, [isLoading, editor, completion]);

  /**
   * Setup editor and make editable
   */

  useEffect(() => {
    if (!editor || ready) return;

    editor.setEditable(true);
    doc.content && editor.commands.focus("end");
    setReady(true);
  }, [editor, doc, ready]);

  if (!ready)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader className="h-4 w-4 animate-spin text-primary" />
      </div>
    );

  return (
    editor && (
      <>
        <TipTapMenu editor={editor} />
        <EditorContent editor={editor} className="prose max-w-prose h-full" />
      </>
    )
  );
};
