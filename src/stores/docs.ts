import { create } from "zustand";

import { LIMIT } from "@/lib/utils";

export const usePublicDocsStore = create<{
  cursor: number;
  docs: Array<string> | [];
  setCursor: (pos: number) => void;
  openDoc: (root: string, id: string) => void;
}>((set, get) => ({
  cursor:
    typeof window === "undefined"
      ? 0
      : JSON.parse(localStorage.getItem("pilcrow_docs_cursor") ?? "0"),
  docs:
    typeof window === "undefined"
      ? []
      : JSON.parse(localStorage.getItem("pilcrow_docs") ?? "[]"),
  setCursor: (cursor: number) => {
    set(() => ({ cursor }));
    localStorage.setItem("pilcrow_docs_cursor", JSON.stringify(cursor));
  },
  openDoc: (root, id) => {
    const docs = get().docs;
    const rootIndex = docs.findIndex((d) => d === root);
    const docsBeforeRoot = rootIndex >= 0 ? docs.slice(0, rootIndex + 1) : docs;
    const newDocs = [...docsBeforeRoot, id];
    set({
      docs: newDocs,
      cursor: newDocs.length > 3 ? newDocs.length - LIMIT : 0, // Reset cursor position
    });
    localStorage.setItem("pilcrow_docs", JSON.stringify(newDocs));
  },
}));

export const useReadOnlyStore = create<{
  readOnlyMode: boolean;
  setReadOnlyMode: (bool: boolean) => void;
}>((set) => ({
  readOnlyMode: false,
  setReadOnlyMode: (bool) => {
    set(() => ({ readOnlyMode: bool }));
    console.log("Read Only:", bool);
  },
}));
