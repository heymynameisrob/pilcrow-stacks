import { PlusIcon } from "@heroicons/react/16/solid";

import { useOS } from "@/hooks/os";
import { useDocs } from "@/queries/docs";
import { Button } from "@/primitives/button";
import { Keys } from "@/primitives/key";

export function OpenDocsEmptyState({
  isEmptyState,
}: {
  isEmptyState: boolean;
}) {
  const { newDoc } = useDocs();
  const os = useOS();

  if (isEmptyState) {
    return (
      <div
        className={
          "relative flex flex-col w-full shrink-0 bg-background px-12 py-8 border-r"
        }
      >
        <div className="prose max-w-prose">
          <h1>Welcome to Pilcrow</h1>
          <p>
            Every time you create a new document, it&apos;s added to a stack on
            top of the ones before.
          </p>
          <p>
            It&apos;s a notetaking app that runs at the speed of your
            inspiration, following your thoughts as soon as you have them
          </p>
          <p>
            You can write in here exactly like you would on something like
            Notion or Google docs. Try / commands, pasting links and images. You
            name it
          </p>
          <p>
            But the most powerful tool is @. You can tag your existing documents
            in to create backlinks. Joining up your thoughts to create deep,
            meaningful connections.
          </p>
          <p>
            This is a completely different way to take notes. There is no need
            for organising your documents into folders, endlessly tagging, and
            searching.
          </p>
          <Button onClick={() => newDoc()} className="gap-1">
            <PlusIcon className="w-4 h-4 opacity-70" />
            <>New document</>
          </Button>
          <div className="flex items-center gap-1 py-3">
            or hit <Keys keys={[os === "mac" ? "⌘" : "Ctrl", "K"]} /> to see
            more options
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "relative grid place-items-center gap-6 w-full shrink-0 bg-background px-12 py-8 border-r"
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
            or hit <Keys keys={[os === "mac" ? "⌘" : "Ctrl", "K"]} /> to see
            more options
          </div>
        </div>
      </div>
    </div>
  );
}
