import { create } from "zustand";

import { LIMIT } from "@/lib/utils";

export const useOpenDocsStore = create<{
  cursor: number;
  docs: Array<string> | [];
  setCursor: (pos: number) => void;
  openDoc: (id: string) => void;
  closeDoc: (id: string) => void;
  closeAllDocs: () => void;
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
  openDoc: (id) => {
    const docs = get().docs;
    const existingIds = docs.filter((d) => id !== d);
    const newDocs = [...existingIds, id];
    set({
      docs: newDocs,
      cursor: newDocs.length > 3 ? newDocs.length - LIMIT : 0, // Reset cursor position
    });
    localStorage.setItem("pilcrow_docs", JSON.stringify([...existingIds, id]));
  },
  closeDoc: (id) => {
    const filteredDocs = get().docs.filter((doc) => doc !== id);
    set(() => ({ docs: filteredDocs }));
    localStorage.setItem("pilcrow_docs", JSON.stringify(filteredDocs));
  },
  closeAllDocs: () => {
    set(() => ({ docs: [] }));
    localStorage.removeItem("pilcrow_docs");
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
