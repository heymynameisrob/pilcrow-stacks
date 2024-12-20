import * as React from "react";
import { Island } from "@/components/client-island";
import { OpenDocsEmptyState } from "@/components/docs/docs-empty";
import { Editor } from "@/components/docs/doc-editor";
import { LIMIT } from "@/lib/utils";
import { ReadOnly } from "@/components/docs/doc-public";

import type { DocsInView } from "@/lib/types";

export function DocsInView({
  docs,
  homepage,
  cursor,
  publicId,
}: {
  docs: string[];
  homepage: string | null | undefined;
  cursor: number;
  publicId?: string;
}) {
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
                  {publicId ? (
                    <ReadOnly docId={doc} publicId={publicId} />
                  ) : (
                    <Editor docId={doc} />
                  )}
                </Island>
              );
            })}
        {!publicId && visibleDocs.length < 3 && <OpenDocsEmptyState />}
      </div>
    </div>
  );
}
