import React from "react";

import { useBacklinkedDocs } from "@/queries/backlinks";
import { Doc } from "@/lib/types";
import { useOpenDocsStore } from "@/stores/docs";

export function Backlinks({ id }: { id: string }) {
  const { docs } = useBacklinkedDocs(id);
  const { openDoc } = useOpenDocsStore();

  if (!docs || docs.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mt-auto">
      <small className="font-medium text-secondary !text-xs">Backlinks</small>
      <ul className="flex items-center gap-2">
        {docs.map((doc: Doc) => (
          <li key={doc.id}>
            <button
              onMouseDown={() => openDoc(doc.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  return openDoc(doc.id);
                }
              }}
              className="flex items-center gap-1.5 px-2 py-1 h-7 rounded-lg bg-gray-3 text-xs hover:bg-gray-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span>{doc.emoji}</span>
              <span className="font-medium">{doc.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
