import { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "next-themes";
import {
  DocumentPlusIcon,
  ArrowRightEndOnRectangleIcon,
  ArchiveBoxXMarkIcon,
  ComputerDesktopIcon,
  BookOpenIcon,
} from "@heroicons/react/16/solid";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/primitives/command";
import { useOpenDocsStore, useReadOnly } from "@/stores/docs";
import { useDocs } from "@/queries/docs";

export function CommandMenu() {
  const { docs, newDoc } = useDocs();
  const {
    docs: openDocs,
    closeDoc,
    openDoc,
    closeAllDocs,
  } = useOpenDocsStore();
  const { setReadOnlyMode, readOnlyMode } = useReadOnly();
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  useHotkeys("Mod+K", () => setOpen(true), {
    preventDefault: true,
    enableOnContentEditable: true,
    enableOnFormTags: true,
  });

  const onKeyDown = useCallback(
    (e: any) => {
      if (!open) return;

      if (e.key === "Backspace" && value.length < 1) {
        e.preventDefault();
        setOpen(false);
      }
    },
    [open, value.length],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search for documents"
        value={value}
        onKeyDown={onKeyDown}
        onValueChange={(value) => setValue(value)}
      />
      <CommandList>
        <CommandEmpty>No results</CommandEmpty>
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
        <CommandGroup heading="Documents">
          {docs?.map((doc) => (
            <CommandItem
              key={doc.id}
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
      </CommandList>
    </CommandDialog>
  );
}
