import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import {
  ArchiveBoxXMarkIcon,
  ArrowRightEndOnRectangleIcon,
  BookOpenIcon,
  BugAntIcon,
  ComputerDesktopIcon,
  DocumentPlusIcon,
  MagnifyingGlassIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/16/solid";

import { useDocs, useDocsInView } from "@/queries/docs";
import { useReadOnlyStore } from "@/stores/docs";
import { CommandGroup, CommandItem } from "@/primitives/command";
import { useCommandContext } from "@/components/command-menu";
import { useUser } from "@/queries/user";
import { createSlug } from "@/lib/utils";
import { toast } from "sonner";
import { GlobeAltIcon } from "@heroicons/react/16/solid";

export function CommandHome() {
  const { setOpen, setCurrentPage } = useCommandContext();
  const { newDoc } = useDocs();
  const { updateUserProfile, user } = useUser();
  const { docs: openDocs, closeDoc, closeAllDocs } = useDocsInView();
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
            <CommandItem
              onSelect={async () => {
                updateUserProfile({
                  ...user,
                  isPublic: !user?.isPublic,
                });
                if (user && !user.isPublic) {
                  navigator.clipboard.writeText(
                    `https://pilcrow.xyz/s/${createSlug(user.name!)}-${user.publicId}`,
                  );
                  toast.success("Copied link to clipboard");
                }
                setOpen(false);
              }}
            >
              <GlobeAltIcon className="w-4 h-4 opacity-70" />
              {user?.isPublic ? (
                <small className="font-medium">Unpublish</small>
              ) : (
                <small className="font-medium">Publish to web</small>
              )}
            </CommandItem>
          </>
        )}
      </CommandGroup>
      <CommandGroup heading="Settings">
        <CommandItem
          onSelect={() => {
            setTheme(theme === "dark" ? "light" : "dark");
            setOpen(false);
          }}
        >
          <ComputerDesktopIcon className="w-4 h-4 opacity-70" />
          <small className="font-medium">Toggle theme</small>
        </CommandItem>
        <CommandItem>
          <a
            href="https://github.com/heymynameisrob/pilcrow-stacks/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <BugAntIcon className="w-4 h-4 opacity-70" />
            <small className="font-medium">Report a bug</small>
          </a>
        </CommandItem>
        <CommandItem onSelect={() => signOut()}>
          <ArrowLeftStartOnRectangleIcon className="w-4 h-4 text-red-500 opacity-70" />
          <small className="font-medium text-red-700 dark:text-red-500">
            Logout
          </small>
        </CommandItem>
      </CommandGroup>
    </>
  );
}
