import { useCommandContext } from "@/components/command-menu";
import { CommandGroup, CommandItem } from "@/primitives/command";
import { useDocs } from "@/queries/docs";
import { useOpenDocsStore } from "@/stores/docs";

export function CommandDocs() {
  const { setOpen } = useCommandContext();
  const { docs } = useDocs();
  const { openDoc } = useOpenDocsStore();

  return (
    <CommandGroup heading="Documents">
      {docs?.map((doc) => (
        <CommandItem
          key={doc.id}
          keywords={[doc.id, doc.title!]}
          onSelect={() => {
            openDoc(doc.id);
            setOpen(false);
          }}
        >
          <p>{doc.emoji}</p>
          <small className="font-medium">{doc.title}</small>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
