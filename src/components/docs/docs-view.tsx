import { Island } from "@/components/client-island";
import { OpenDocsEmptyState } from "@/components/docs/docs-empty";
import { Editor } from "@/components/docs/doc-editor";
import { LIMIT } from "@/lib/utils";
import { useDocsInView } from "@/queries/docs";

import type { DocsInView } from "@/lib/types";

export function DocsInView() {
  const { docs: docs, homepage, cursor } = useDocsInView();

  const visibleDocs = docs.length > 0 ? docs : homepage ? [homepage] : [];

  return (
    <div className="relative z-10 flex w-full h-full">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 dark:bg-gray-2">
        {visibleDocs.length > 0 &&
          visibleDocs
            .slice(cursor, Math.min(cursor + LIMIT, visibleDocs.length))
            .map((doc) => {
              return (
                <Island key={doc} suspense={true} fallback={null}>
                  <Editor docId={doc} />
                </Island>
              );
            })}
        {visibleDocs.length < 3 && <OpenDocsEmptyState />}
      </div>
    </div>
  );
}
