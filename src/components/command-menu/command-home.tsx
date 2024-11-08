import { useTheme } from "next-themes";
import {
  ArchiveBoxXMarkIcon,
  ArrowRightEndOnRectangleIcon,
  BookOpenIcon,
  ComputerDesktopIcon,
  DocumentPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";

import { CommandGroup, CommandItem } from "@/primitives/command";
import { useDocs } from "@/queries/docs";
import { useOpenDocsStore, useReadOnlyStore } from "@/stores/docs";
import { useCommandContext } from "@/components/command-menu";

export function CommandHome() {
  const { setOpen, setCurrentPage } = useCommandContext();
  const { newDoc } = useDocs();
  const { docs: openDocs, closeDoc, closeAllDocs } = useOpenDocsStore();
  const { setReadOnlyMode, readOnlyMode } = useReadOnlyStore();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <CommandGroup>
        <CommandItem
          onSelect={() => {
            newDoc();
            setOpen(false);
          }}
        >
          <DocumentPlusIcon className="w-4 h-4 opacity-70" />
          <small className="font-medium">New document</small>
        </CommandItem>
        <CommandItem
          onSelect={() => {
            setCurrentPage("docs");
          }}
        >
          <MagnifyingGlassIcon className="w-4 h-4 opacity-70" />
          <small className="font-medium">Goto document...</small>
        </CommandItem>
        {openDocs.length > 0 && (
          <>
            <CommandItem
              onSelect={() => {
                closeDoc(openDocs.pop() as string);
                setOpen(false);
              }}
            >
              <ArrowRightEndOnRectangleIcon className="w-4 h-4 opacity-70" />
              <small className="font-medium">Close last document</small>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                closeAllDocs();
                setOpen(false);
              }}
            >
              <ArchiveBoxXMarkIcon className="w-4 h-4 opacity-70" />
              <small className="font-medium">Close all documents</small>
            </CommandItem>
          </>
        )}
      </CommandGroup>
      <CommandGroup heading="Settings">
        <CommandItem
          onSelect={() => {
            setReadOnlyMode(!readOnlyMode);
            setOpen(false);
          }}
        >
          <BookOpenIcon className="w-4 h-4 opacity-70" />
          <small className="font-medium">Toggle read-only mode</small>
        </CommandItem>
        <CommandItem
          onSelect={() => {
            setTheme(theme === "dark" ? "light" : "dark");
            setOpen(false);
          }}
        >
          <ComputerDesktopIcon className="w-4 h-4 opacity-70" />
          <small className="font-medium">Toggle theme</small>
        </CommandItem>
      </CommandGroup>
    </>
  );
}
