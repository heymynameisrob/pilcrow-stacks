import { create } from "zustand";

export const useOpenDocsStore = create<{
  docs: Array<string> | [];
  openDoc: (id: string) => void;
  closeDoc: (id: string) => void;
  closeAllDocs: () => void;
}>((set, get) => ({
  docs:
    typeof window === "undefined"
      ? []
      : JSON.parse(localStorage.getItem("pilcrow_docs") ?? "[]"),
  openDoc: (id) => {
    const docs = get().docs;
    const existingIds = docs.filter((d) => id !== d);

    set({ docs: [...existingIds, id] });
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
