import { Island } from "@/components/client-island";
import { OpenDocsEmptyState } from "@/components/docs/docs-empty";
import { Editor } from "@/components/editor";
import { LIMIT } from "@/lib/utils";
import { useOpenDocsStore } from "@/stores/docs";

export function DocsInView() {
  const { docs: openDocs, cursor } = useOpenDocsStore();

  return (
    <div className="relative z-10 flex w-full h-full">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 dark:bg-gray-2">
        {openDocs.length > 0 &&
          openDocs
            .slice(cursor, Math.min(cursor + LIMIT, openDocs.length))
            .map((doc) => {
              return (
                <Island key={doc} suspense={true} fallback={null}>
                  <Editor docId={doc} />
                </Island>
              );
            })}
        {openDocs.length < 3 && <OpenDocsEmptyState />}
      </div>
    </div>
  );
}
