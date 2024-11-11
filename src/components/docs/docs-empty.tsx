import { PlusIcon } from "@heroicons/react/16/solid";

import { useOS } from "@/hooks/os";
import { useDocs } from "@/queries/docs";
import { Button } from "@/primitives/button";
import { Keys } from "@/primitives/key";

export function OpenDocsEmptyState() {
  const { newDoc } = useDocs();
  const os = useOS();

  return (
    <div
      className={
        "relative grid place-items-center gap-6 w-full shrink-0 bg-background px-12 py-8 border-r dark:bg-gray-2"
      }
    >
      <div className="flex flex-col items-center gap-6">
        <h2>Open a document or create a new one</h2>
        <div className="flex flex-col items-center gap-2 text-center">
          <Button onClick={() => newDoc()} className="gap-1">
            <PlusIcon className="w-4 h-4 opacity-70" />
            <>New document</>
          </Button>
          <div className="flex items-center gap-1 py-3 text-sm text-secondary">
            or hit <Keys keys={[os === "mac" ? "⌘" : "Ctrl", "P"]} /> to search
            documents
          </div>
        </div>
      </div>
    </div>
  );
}
