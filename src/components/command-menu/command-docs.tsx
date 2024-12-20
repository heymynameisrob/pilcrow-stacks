import { useCommandContext } from "@/components/command-menu";
import { fromNow } from "@/lib/utils";
import { CommandGroup, CommandItem } from "@/primitives/command";
import { useDocs, useDocsInView } from "@/queries/docs";

export function CommandDocs() {
  const { setOpen } = useCommandContext();
  const { docs } = useDocs();
  const { openDoc } = useDocsInView();

  if (!docs) return null;

  const sortedDocs = docs.sort((a, b) => {
    const dateA = new Date(a.lastEdited!);
    const dateB = new Date(b.lastEdited!);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <CommandGroup heading="Documents">
      {sortedDocs?.map((doc) => (
        <CommandItem
          key={doc.id}
          keywords={[doc.id, doc.title!]}
          onSelect={() => {
            openDoc({ targetId: doc.id });
            setOpen(false);
          }}
        >
          <p>{doc.emoji}</p>
          <small className="font-medium">{doc.title}</small>
          <small className="text-secondary">
            {fromNow(new Date(doc.lastEdited!))}
          </small>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
