import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

import { Popover, PopoverContent, PopoverTrigger } from "@/primitives/popover";
import { Button } from "@/primitives/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/primitives/command";

export const CodeBlockComponent = (props: any) => {
  const [value, setValue] = useState<string>(props.node.attrs.language);
  const [open, setOpen] = useState<boolean>(false);

  useHotkeys(
    "tab",
    (e) => {
      if (props.editor.isActive("codeBlock")) {
        const { selection } = props.editor.view.state;
        const { $anchor } = selection;
        e.preventDefault();
        // indent text
        props.editor.commands.insertContentAt($anchor.pos, "&#9;");
      }
    },
    {
      enableOnContentEditable: true,
      enabled: props.editor.isActive("codeBlock"),
    },
  );

  useHotkeys(
    "enter",
    () => {
      // check if codeblock is focused
      if (props.editor.isActive("codeBlock")) {
        const { selection } = props.editor.view.state;
        const { $anchor } = selection;
        const textBefore = props.editor.view.state.doc.textBetween(
          $anchor.start(),
          $anchor.pos,
        );
        // only indent if there is content
        if (textBefore.trim().length > 0) {
          props.editor.commands.insertContentAt($anchor.pos, "&#9;");
        }
      }
    },
    {
      enableOnContentEditable: true,
      enabled: props.editor.isActive("codeBlock"),
    },
  );

  return (
    <NodeViewWrapper className="group relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="px-2 py-0 h-7 text-sm absolute top-1 right-0 max-w-32 gap-1.5 text-secondary hover:bg-transparent hover:text-primary"
          >
            {value}
            <ChevronDownIcon className="w-4 h-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              className="dark:bg-gray-2"
              placeholder="Change language"
            />
            <CommandList className="p-1">
              {props.extension.options.lowlight
                .listLanguages()
                .map((lang: string, index: number) => (
                  <CommandItem
                    key={index}
                    value={lang}
                    onSelect={() => {
                      props.updateAttributes({ language: lang });
                      setValue(lang);
                      setOpen(false);
                    }}
                  >
                    {lang}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <pre className="rounded-md border shadow-sm">
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};
