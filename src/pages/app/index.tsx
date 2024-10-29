import React from "react";
import { useSession } from "next-auth/react";
import { useTitle } from "react-use";
import { getServerSession } from "next-auth";
import { PlusIcon } from "@heroicons/react/16/solid";

import { Button } from "@/components/button";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { UserMenu } from "@/components/user-menu";
import { Editor } from "@/components/editor";
import { Island } from "@/components/client-island";
import { useDocs } from "@/queries/docs";
import { Tooltip } from "@/components/tooltip";
import { Keys } from "@/components/key";
import { useKeyboardShortcut } from "@/hooks/keyboard";

import type { GetServerSidePropsContext } from "next";

export default function Page() {
  const { data: session } = useSession();
  const { newDoc, openDoc, docs } = useDocs();
  const limit = 3;

  useTitle("Robs app");

  useKeyboardShortcut({
    keys: ["Shift", "N"],
    onKeyPressed: () => newDoc(),
  });

  if (typeof window === "undefined") return null;
  if (!session) return null;

  return (
    <main className="flex flex-col h-screen md:flex-row">
      <div className="flex bg-gray-1 md:flex-col">
        <div className="flex h-full items-center gap-2 px-2 py-4 overflow-x-scroll md:overflow-y-scroll scrol-mb-4 md:flex-col">
          {docs &&
            docs
              .slice(0, docs.length - limit)
              .reverse()
              .map((doc, index) => (
                <Tooltip content={doc.title} key={index} side="right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0 bg-gray-2 w-9 h-9 rounded-md flex items-center justify-center"
                    onClick={() => openDoc(doc)}
                  >
                    {doc.emoji}
                  </Button>
                </Tooltip>
              ))}
        </div>
        <div className="flex items-center justify-center p-2 bg-gray-3 border-r md:border-r-0 md:border-t">
          <UserMenu position="bottom" />
        </div>
      </div>
      <div className="flex w-full h-full">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3">
          {docs ? (
            docs.slice(docs.length - limit, docs.length).map((doc) => {
              return (
                <Island key={doc.id}>
                  <Editor docId={doc.id} />
                </Island>
              );
            })
          ) : (
            <div className="h-full shrink-0 col-span-3 bg-background rounded-xl text-4xl flex items-center justify-center">
              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => newDoc()}
              >
                <PlusIcon className="w-4 h-4 opacity-70" />
                <>New document</>
              </Button>
            </div>
          )}
        </div>
        <div className="absolute right-0  inset-y-0 w-9 h-full flex items-center justify-center">
          <Tooltip
            side="left"
            sideOffset={4}
            content={
              <div className="flex items-center gap-1.5">
                <small>New document</small>
                <Keys keys={["⇧", "N"]} />
              </div>
            }
          >
            <Button
              variant="secondary"
              size="icon"
              className="gap-1 rounded-none rounded-tl-md rounded-bl-md pointer-events-auto"
              onClick={() => newDoc()}
            >
              <PlusIcon className="w-4 h-4 opacity-70" />
            </Button>
          </Tooltip>
        </div>
      </div>
      {/* <div className="fixed bottom-0 inset-x-0 pointer-events-none py-4 flex items-center justify-center">
        <Button
          variant="default"
          className="gap-1 rounded-full pointer-events-auto"
          onClick={() => newDoc()}
        >
          <PlusIcon className="w-4 h-4 opacity-70" />
          <>New</>
        </Button>
      </div> */}
    </main>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session)
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };

  return {
    props: {
      session,
    },
  };
}
