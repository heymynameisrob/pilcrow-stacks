import * as React from "react";
import { useDebouncedCallback } from "use-debounce";

import { useDoc, useDocsInView } from "@/queries/docs";
import { TipTapEditor } from "@/components/tiptap/tiptap-editor";
import { getTitleFromJson } from "@/lib/editor";
import { cn } from "@/lib/utils";
import { Backlinks } from "@/components/backlinks";
import { DocHeader } from "@/components/docs/doc-header";

import type { Editor as EditorType } from "@tiptap/react";

export function Editor({ docId }: { docId: string }) {
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const editorRef = React.useRef<HTMLDivElement>(null);

  // Queries
  const { doc, saveDoc } = useDoc(docId);
  const { openDoc } = useDocsInView();

  /**
   * 1 - Handle Save
   * Debounce value so we only save to query after ~1s
   */
  const handleOnSave = useDebouncedCallback(async (editor: EditorType) => {
    const content = editor.getJSON();
    if (!content) return;

    const title = getTitleFromJson(content) || "Untitled";

    setIsSaving(true);

    // Save - Normal doc
    saveDoc({
      id: docId,
      title,
      content,
    });

    setIsSaving(false);
  }, 750);

  /**
   * 2 - Handle Mentions
   * Open new document when @ mention is clicked
   */
  const handleMentionLink = React.useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.dataset.type === "mention") {
        const id = target.dataset.id;
        if (!id || !docId) return;
        console.log("Fire!", docId, target);

        openDoc({ rootId: docId, targetId: id });
      }
    },
    [docId, openDoc],
  );

  React.useEffect(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    editorElement.addEventListener("click", handleMentionLink);
    return () => {
      editorElement.removeEventListener("click", handleMentionLink);
    };
  }, [handleMentionLink]);

  if (!doc) return null;

  return (
    <div
      ref={editorRef}
      className={cn(
        "relative flex flex-col w-full h-full shrink-0 bg-background border-r last:border-none dark:bg-gray-2",
        isSaving && "opacity-70 pointer-events-none aniamte-pulse",
      )}
    >
      <DocHeader id={doc.id} />
      <section className="flex flex-col px-6 py-8 h-full">
        <TipTapEditor doc={doc} handleOnSave={handleOnSave} />
        <React.Suspense fallback="Loading...">
          <Backlinks id={doc.id} />
        </React.Suspense>
      </section>
    </div>
  );
}
