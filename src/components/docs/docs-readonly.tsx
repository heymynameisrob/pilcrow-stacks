import { useReadOnlyStore } from "@/stores/docs";

export function DocsReadOnly() {
  const { readOnlyMode } = useReadOnlyStore();

  if (!readOnlyMode) return null;

  return (
    <div className="absolute bottom-0 right-0 px-1.5 py-1 bg-indigo-600 text-white font-mono z-50 text-xs uppercase font-semibold tracking-wide rounded-tl-lg">
      Read-only
    </div>
  );
}
