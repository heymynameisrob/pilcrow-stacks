import { cn } from "@/lib/utils";
import { Button } from "@/primitives/button";
import { Tooltip } from "@/primitives/tooltip";
import { useDoc } from "@/queries/docs";
import { useOpenDocsStore } from "@/stores/docs";

export function DocQueueItem({ id }: { id: string }) {
  const { doc } = useDoc(id);
  const { openDoc } = useOpenDocsStore();

  if (!doc) return null;

  return (
    <Tooltip content={doc.title} side="right">
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "shrink-0 bg-gray-2 w-9 h-9 rounded-lg flex items-center justify-center",
          "bg-background shadow-flat dark:bg-gray-2 dark:shadow-raised",
        )}
        onClick={() => openDoc(doc.id)}
      >
        {doc.emoji}
      </Button>
    </Tooltip>
  );
}
