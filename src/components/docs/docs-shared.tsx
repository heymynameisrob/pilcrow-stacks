import { toast } from "sonner";
import { GlobeAltIcon } from "@heroicons/react/16/solid";

import { useUser } from "@/queries/user";
import { createSlug } from "@/lib/utils";

export function DocsShared() {
  const { user } = useUser();

  const handleCopyLink = () => {
    if (!user) return;
    navigator.clipboard.writeText(
      `https://pilcrow.xyz/s/${createSlug(user.name!)}-${user.publicId}`,
    );
    toast.success("Copied link to clipboard");
  };

  if (!user?.isPublic) return null;

  return (
    <div
      onClick={handleCopyLink}
      className="fixed bottom-0 right-0 flex items-center gap-2 px-1.5 py-1 bg-cyan-400 text-black z-50 text-xs uppercase font-semibold tracking-wide rounded-tl-lg cursor-pointer"
    >
      <GlobeAltIcon className="w-4 h-4 opacity-70" />
      Public
    </div>
  );
}
