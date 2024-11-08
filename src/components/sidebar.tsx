import { DocQueueItem } from "@/components/docs/doc-queue-item";
import { UserMenu } from "@/components/user-menu";
import { useOpenDocsStore } from "@/stores/docs";

export function Sidebar() {
  const { docs } = useOpenDocsStore();

  const limit = 3;

  return (
    <div className="flex bg-gray-2 border-r md:flex-col dark:bg-background">
      <div className="flex h-full items-center gap-2 px-2 py-4 overflow-x-scroll md:overflow-y-scroll scrol-mb-4 md:flex-col">
        {docs.length > 3 &&
          docs
            .slice(0, docs.length - limit)
            .map((id: string) => <DocQueueItem key={id} id={id} />)}
      </div>
      <div className="flex items-center justify-center p-2">
        <UserMenu position="bottom" />
      </div>
    </div>
  );
}
