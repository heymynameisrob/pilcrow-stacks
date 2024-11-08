import React from "react";
import { useSession } from "next-auth/react";
import { useTitle } from "react-use";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { UserMenu } from "@/components/user-menu";
import { Editor } from "@/components/editor";
import { Island } from "@/components/client-island";
import { useOpenDocsStore, useReadOnlyStore } from "@/stores/docs";
import { OpenDocsEmptyState } from "@/components/docs/docs-empty";
import { DocQueueItem } from "@/components/docs/doc-queue-item";

import type { GetServerSidePropsContext } from "next";

export default function Page() {
  const { data: session } = useSession();
  const { docs: openDocs } = useOpenDocsStore();
  const { readOnlyMode } = useReadOnlyStore();

  const limit = 3;

  useTitle("Pilcrow");

  if (!session) return null;

  return (
    <main className="flex flex-col h-screen md:flex-row">
      <div className="flex bg-gray-2 border-r md:flex-col dark:bg-gray-1">
        <div className="flex h-full items-center gap-2 px-2 py-4 overflow-x-scroll md:overflow-y-scroll scrol-mb-4 md:flex-col">
          {openDocs.length > 3 &&
            openDocs
              .slice(0, openDocs.length - limit)
              .map((id) => <DocQueueItem key={id} id={id} />)}
        </div>
        <div className="flex items-center justify-center p-2 bg-gradient-to-t from-gray-4 to-gray-2 dark:to-gray-1">
          <UserMenu position="bottom" />
        </div>
      </div>
      <div className="flex w-full h-full">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3">
          {openDocs.length > 0 &&
            openDocs
              .slice(Math.max(0, openDocs.length - limit), openDocs.length)
              .map((doc) => {
                return (
                  <Island key={doc} suspense={true} fallback={null}>
                    <Editor docId={doc} />
                  </Island>
                );
              })}
          {openDocs.length < 3 && (
            <OpenDocsEmptyState isEmptyState={openDocs.length === 0} />
          )}
        </div>
      </div>
      {readOnlyMode && (
        <div className="absolute bottom-0 right-0 px-1.5 py-1 bg-indigo-600 text-white font-mono z-50 text-xs uppercase font-semibold tracking-wide rounded-tl-lg">
          Read-only
        </div>
      )}
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
