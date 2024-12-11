import { AnimatePresence, motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { Portal } from "@radix-ui/react-hover-card";

import { useOpenDocsStore } from "@/stores/docs";
import { useDoc, useDocsInView } from "@/queries/docs";
import { cn, LIMIT } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/primitives/hover-card";
import { RichText } from "@/components/rich-text";
import { Island } from "@/components/client-island";

export function PrevSidebar() {
  const { docs, cursor, setCursor } = useDocsInView();

  useHotkeys("Mod+[", () => setCursor(cursor - 1), {
    enabled: cursor > 0,
    preventDefault: true,
    enableOnContentEditable: true,
  });

  if (docs.length <= 3) return null;

  if (cursor === 0) return null;

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
              duration: 0.4,
            }}
            key={String(docs.slice(0, cursor).at(-1))}
          >
            <SiblingDoc direction="prev" id={docs.slice(0, cursor).at(-1)!} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
export function NextSidebar() {
  const { docs, cursor, setCursor } = useDocsInView();

  useHotkeys("Mod+]", () => setCursor(cursor + 1), {
    preventDefault: true,
    enableOnContentEditable: true,
    enabled: cursor + LIMIT < docs.length,
  });

  if (docs.length < 3 || cursor + LIMIT >= docs.length) return null;

  return (
    <div className="relative z-0 flex w-[64px] h-full bg-gray-2 pr-2 md:flex-col dark:bg-background animate-in fade-in duration-300 overflow-hidden">
      <div className="absolute z-[1] inset-y-0 right-1 w-1 border-l shadow-sm" />
      <AnimatePresence mode="popLayout" initial={false}>
        {docs.length > 3 ? (
          // TODO: Make animation smoother
          <motion.div
            initial={{
              x: -65,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: -65,
            }}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.4,
            }}
            key={String(docs[cursor])}
          >
            <SiblingDoc
              direction="next"
              id={docs.slice(cursor + LIMIT, docs.length)[0]!}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function SiblingDoc({
  id,
  className,
  direction,
}: {
  id: string;
  className?: string;
  direction: "prev" | "next";
}) {
  const { doc } = useDoc(id);
  const { cursor, setCursor } = useDocsInView();

  if (!doc) return null;

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
          <button
            onClick={() => {
              if (direction == "prev") {
                setCursor(cursor - 1);
              } else {
                setCursor(cursor + 1);
              }
            }}
            className="py-2 px-2"
          >
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
        <HoverCardContent
          alignOffset={8}
          side={direction === "prev" ? "right" : "left"}
          align="start"
          className="max-h-[360px] overflow-y-scroll"
        >
          <Island lazy>
            <RichText content={doc.content} />
          </Island>
        </HoverCardContent>
      </Portal>
    </HoverCard>
  );
}
