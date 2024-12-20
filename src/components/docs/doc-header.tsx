import React from "react";
import { HomeIcon, XMarkIcon, TrashIcon } from "@heroicons/react/16/solid";
import { MoreHorizontalIcon } from "lucide-react";

import { EmojiPicker } from "@/components/emoji-picker";
import { useDoc, useDocsInView } from "@/queries/docs";
import { Button } from "@/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/primitives/dropdown-menu";
import { Badge } from "@/primitives/badge";
import { Tooltip } from "@/primitives/tooltip";

export function DocHeader({ id }: { id: string }) {
  const { doc } = useDoc(id);
  const { closeDoc, homepage } = useDocsInView();

  if (!doc) return null;

  return (
    <div className="sticky top-0 flex items-center justify-between w-full h-12 px-2 py-2">
      <header role="banner" className="flex items-center gap-2 px-2">
        {id === homepage ? (
          <Tooltip content="This is your homepage" align="start">
            <Badge className="h-7 w-7 justify-center rounded-md bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400">
              <HomeIcon className="shrink-0 w-4 h-4 opacity-70" />
            </Badge>
          </Tooltip>
        ) : (
          <React.Suspense
            fallback={<div className="h-7 w-7 rounded-mg bg-gray-3" />}
          >
            <EmojiPicker emoji={doc.emoji || "📝"} docId={id} />
          </React.Suspense>
        )}
        <small className="font-medium text-primary">{doc.title}</small>
        <DocHeaderMenu docId={id} />
      </header>
      <Button
        size="icon"
        title="Close"
        variant="ghost"
        onClick={() => closeDoc(doc.id)}
      >
        <XMarkIcon className="w-4 h-4 opacity-60" />
      </Button>
    </div>
  );
}

function DocHeaderMenu({ docId }: { docId: string }) {
  const { setHomepage, homepage } = useDocsInView();
  const { deleteDoc } = useDoc(docId);

  const handleDeleteDoc = () => {
    const confirmed = confirm("Are you sure? This action cannot be undone.");
    if (confirmed) {
      return deleteDoc();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-gray-3"
        >
          <MoreHorizontalIcon className="w-4 h-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onSelect={() => setHomepage(docId === homepage ? undefined : docId)}
          className="gap-1.5"
        >
          <HomeIcon className="shrink-0 w-4 h-4 opacity-70" />
          {docId === homepage ? "Unset as homepage" : "Set as homepage"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleDeleteDoc} className="gap-1.5">
          <TrashIcon className="w-4 h-4 opacity-70 text-red-700 dark:text-red-500" />
          <span className="text-red-700 dark:text-red-400">Delete doc</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
