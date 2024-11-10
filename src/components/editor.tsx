import { Suspense, useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { XMarkIcon } from "@heroicons/react/16/solid";

import { Button } from "@/primitives/button";
import { useDoc } from "@/queries/docs";
import { EmojiPicker } from "@/components/emoji-picker";
import { TipTapEditor } from "@/components/tiptap/tiptap-editor";
import { getTitleFromJson } from "@/lib/editor";
import { cn } from "@/lib/utils";
import { useOpenDocsStore } from "@/stores/docs";
import { Backlinks } from "@/components/backlinks";

import type { Editor as EditorType } from "@tiptap/react";

export function Editor({ docId }: { docId: string }) {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Queries
  const { doc, saveDoc } = useDoc(docId);
  const { closeDoc, openDoc } = useOpenDocsStore();

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
      <div className="sticky top-0 flex items-center justify-between w-full h-12 px-2 py-2">
        <header role="banner" className="flex items-center gap-2 px-2">
          <Suspense fallback={<div className="h-7 w-7 rounded-mg bg-gray-3" />}>
            <EmojiPicker emoji={doc.emoji || "📝"} docId={docId} />
          </Suspense>
          <small className="font-medium text-primary">{doc.title}</small>
        </header>
        <Button
          size="icon"
          title="Close"
          variant="ghost"
          onClick={() => closeDoc(doc.id)}
        >
          <XMarkIcon className="w-4 h-4 opacity-60" />
        </Button>
      </div>
      <section className="flex flex-col px-6 py-8 h-full">
        <TipTapEditor doc={doc} handleOnSave={handleOnSave} />
        <Suspense fallback="Loading...">
          <Backlinks id={doc.id} />
        </Suspense>
      </section>
    </div>
  );
}
