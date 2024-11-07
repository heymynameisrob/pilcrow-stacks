import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { XMarkIcon } from "@heroicons/react/16/solid";

import { Button } from "@/primitives/button";
import { useDoc } from "@/queries/docs";
import { EmojiPicker } from "@/components/emoji-picker";
import { TipTapEditor } from "@/components/tiptap/tiptap-editor";
import { getTitleFromJson } from "@/lib/editor";
import { cn } from "@/lib/utils";
import { useOpenDocsStore } from "@/stores/docs";

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
      emoji: "📝",
      lastEdited: new Date().toISOString(),
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
        "relative flex flex-col gap-6 w-full h-full shrink-0 bg-background px-6 py-8 border-r last:border-none",
        isSaving && "opacity-70 pointer-events-none aniamte-pulse",
      )}
    >
      <Button
        size="icon"
        title="Close"
        variant="ghost"
        className="absolute top-1 right-1"
        onClick={() => closeDoc(doc.id)}
      >
        <XMarkIcon className="w-4 h-4 opacity-60" />
      </Button>
      <EmojiPicker emoji={doc.emoji || "📝"} docId={docId} />
      <TipTapEditor doc={doc} handleOnSave={handleOnSave} />
    </div>
  );
}
