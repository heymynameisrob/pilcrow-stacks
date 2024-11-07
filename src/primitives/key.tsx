import React from "react";

import { cn } from "@/lib/utils";

export function Key({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex justify-center items-center w-5 h-5 px-0.5 py-px rounded border shadow-sm bg-gray-2 text-primary text-xs font-semibold font-sans dark:bg-gray-6",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export function Keys({ keys }: { keys: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key) => (
        <Key key={key}>{key}</Key>
      ))}
    </div>
  );
}
