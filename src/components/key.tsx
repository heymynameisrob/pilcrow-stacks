import React from "react";

export function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex justify-center items-center w-5 h-5 px-0.5 py-px rounded bg-gray-2 text-primary text-xs font-semibold font-sans dark:bg-gray-3">
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
