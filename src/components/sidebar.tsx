import { AnimatePresence, motion } from "framer-motion";
import { Portal } from "@radix-ui/react-hover-card";

import { useOpenDocsStore } from "@/stores/docs";
import { useDoc } from "@/queries/docs";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/primitives/hover-card";
import { RichText } from "@/components/rich-text";
import { Island } from "@/components/client-island";

export function Sidebar() {
  const { docs } = useOpenDocsStore();

  const limit = 3;

  if (docs.length <= 3) return null;

  return (
    <div className="flex w-[64px] h-full bg-gray-2 pl-2 border-r md:flex-col dark:bg-background animate-in fade-in duration-300 ease">
      {docs.length > 4 && (
        <div className="absolute z-[1] inset-y-0 left-1 w-1 border-l shadow-sm" />
      )}
      <AnimatePresence mode="popLayout" initial={false}>
        {docs.length > 3 ? (
          // TODO: Make animation smoother
          <motion.div
            initial={{
              x: docs.length > 4 ? 65 : 0,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: 65,
            }}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.3,
            }}
            key={String(docs.slice(0, docs.length - limit).at(-1))}
          >
            <SiblingDoc id={docs.slice(0, docs.length - limit).at(-1)!} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function SiblingDoc({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const { doc } = useDoc(id);
  const { openDoc } = useOpenDocsStore();

  if (!doc) return null;

  console.log(doc.content);

  return (
    <HoverCard>
      <div
        className={cn(
          "bg-gray-1 h-full w-full flex items-center justify-start gap-2 whitespace-nowrap border-l shadow-sm dark:bg-gray-1",
          className,
        )}
        style={{ writingMode: "vertical-rl" }}
      >
        <HoverCardTrigger>
          <button onClick={() => openDoc(id)} className="py-2 px-2">
            <h3 className="flex items-center gap-2 font-semibold">
              <div className="w-7 h-7 rounded-md bg-gray-3 flex items-center justify-center">
                {doc.emoji}
              </div>
              <span>{doc.title}</span>
            </h3>
          </button>
        </HoverCardTrigger>
      </div>
      <Portal>
        <HoverCardContent alignOffset={8} side="right" align="start">
          <Island lazy>
            <RichText content={doc.content} />
          </Island>
        </HoverCardContent>
      </Portal>
    </HoverCard>
  );
}
