import * as React from "react";

import { TipTapEditor } from "@/components/tiptap/tiptap-editor";
import { cn } from "@/lib/utils";
import { usePublicDoc } from "@/queries/public";
import { usePublicDocsStore } from "@/stores/docs";

export function ReadOnly({
  docId,
  publicId,
}: {
  docId: string;
  publicId: string;
}) {
  const editorRef = React.useRef<HTMLDivElement>(null);

  // Queries
  const { doc } = usePublicDoc(docId, publicId);
  const { openDoc } = usePublicDocsStore();

  /**
   * 2 - Handle Mentions
   * Open new document when @ mention is clicked
   */
  const handleMentionLink = React.useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.dataset.type === "mention") {
        const id = target.dataset.id;
        if (!id || !doc) return;

        openDoc(docId, id);
      }
    },
    [doc, docId, openDoc],
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
      )}
    >
      <section className="flex flex-col gap-4 px-6 py-8 h-full">
        <div className="h-7 w-7 rounded-mg bg-gray-3 flex items-center justify-center">
          {doc.emoji}
        </div>
        <TipTapEditor doc={doc} />
      </section>
    </div>
  );
}
