import { Suspense, useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { XMarkIcon } from "@heroicons/react/16/solid";

import { Button } from "@/primitives/button";
import { useDoc, useDocsInView } from "@/queries/docs";
import { EmojiPicker } from "@/components/emoji-picker";
import { TipTapEditor } from "@/components/tiptap/tiptap-editor";
import { getTitleFromJson } from "@/lib/editor";
import { cn } from "@/lib/utils";
import { useOpenDocsStore } from "@/stores/docs";
import { Backlinks } from "@/components/backlinks";
import { DocHeader } from "@/components/docs/doc-header";

import type { Editor as EditorType } from "@tiptap/react";

export function Editor({ docId }: { docId: string }) {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Queries
  const { doc, saveDoc } = useDoc(docId);
  const { closeDoc, openDoc } = useDocsInView();

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
  const handleMentionLink = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.dataset.type === "mention") {
        const id = target.dataset.id;
        if (!id || !doc) return;

        openDoc(id);
      }
    },
    [doc, openDoc],
  );

  useEffect(() => {
    document.addEventListener("click", handleMentionLink);
    return () => {
      document.removeEventListener("click", handleMentionLink);
    };
  }, [handleMentionLink]);

  if (!doc) return null;

  return (
    <div
      className={cn(
        "relative flex flex-col w-full h-full shrink-0 bg-background border-r last:border-none dark:bg-gray-2",
        isSaving && "opacity-70 pointer-events-none aniamte-pulse",
      )}
    >
      <DocHeader id={doc.id} />
      <section className="flex flex-col px-6 py-8 h-full">
        <TipTapEditor doc={doc} handleOnSave={handleOnSave} />
        <Suspense fallback="Loading...">
          <Backlinks id={doc.id} />
        </Suspense>
      </section>
    </div>
  );
}
