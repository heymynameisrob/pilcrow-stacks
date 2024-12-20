import { GlobeAltIcon } from "@heroicons/react/16/solid";

import { useUser } from "@/queries/user";

export function DocsShared() {
  const { user } = useUser();

  if (!user?.isPublic) return null;

  return (
    <div className="fixed bottom-0 right-0 flex items-center gap-2 px-1.5 py-1 bg-cyan-400 text-black z-50 text-xs uppercase font-semibold tracking-wide rounded-tl-lg">
      <GlobeAltIcon className="w-4 h-4 opacity-70" />
      Public
    </div>
  );
}
