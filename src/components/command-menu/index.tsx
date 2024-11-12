import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/primitives/command";
import { CommandDocs } from "@/components/command-menu/command-docs";
import { CommandHome } from "@/components/command-menu/command-home";

type ContextType = {
  currentPage: "docs" | "home";
  setCurrentPage: Dispatch<SetStateAction<"docs" | "home">>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const CommandContext = createContext<ContextType>({
  currentPage: "home",
  setCurrentPage: () => {},
  open: false,
  setOpen: () => {},
});

export function useCommandContext() {
  const ctx = useContext(CommandContext);
  return ctx;
}
export function CommandMenu() {
  const [currentPage, setCurrentPage] = useState<"home" | "docs">("home");
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  useHotkeys(
    "Mod+K",
    () => {
      setOpen(!open);
      setCurrentPage("home");
    },
    {
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );

  useHotkeys(
    "Mod+P",
    () => {
      setOpen(!open);
      setCurrentPage("docs");
    },
    {
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );

  const page = useMemo(() => {
    switch (currentPage) {
      case "docs":
        return <CommandDocs />;
      default:
        return <CommandHome />;
    }
  }, [currentPage]);

  const onKeyDown = useCallback(
    (e: any) => {
      if (!open) return;

      if (e.key === "Backspace" && currentPage !== "home" && value.length < 1) {
        e.preventDefault();
        return setCurrentPage("home");
      }

      if (e.key === "Backspace" && value.length < 1) {
        e.preventDefault();
        return setOpen(false);
      }
    },
    [open, value.length, currentPage],
  );

  const values = useMemo(() => {
    return {
      currentPage,
      setCurrentPage,
      open,
      setOpen,
    };
  }, [currentPage, setCurrentPage, open, setOpen]);

  return (
    <CommandContext.Provider value={values}>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={
            currentPage === "docs"
              ? "Search docs..."
              : "Search for a command..."
          }
          currentPage={currentPage}
          value={value}
          onKeyDown={onKeyDown}
          onValueChange={(value) => setValue(value)}
        />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          {page}
        </CommandList>
      </CommandDialog>
    </CommandContext.Provider>
  );
}
