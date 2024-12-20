import React from "react";
import { useSession } from "next-auth/react";
import { useTitle } from "react-use";
import { getServerSession } from "next-auth";
import { useHotkeys } from "react-hotkeys-hook";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useDocs, useDocsInView } from "@/queries/docs";
import { PrevSidebar, NextSidebar } from "@/components/sidebar";
import { DocsInView } from "@/components/docs/docs-view";
import { Info } from "@/components/info";
import { DocsShared } from "@/components/docs/docs-shared";
import { useReadOnlyStore } from "@/stores/docs";
import { CommandMenu } from "@/components/command-menu";
import { Island } from "@/components/client-island";

import type { GetServerSidePropsContext } from "next";

export default function Page() {
  const { data: session } = useSession();
  const { newDoc } = useDocs();
  const { docs: docs, homepage, cursor, setCursor } = useDocsInView();
  const { readOnlyMode } = useReadOnlyStore();

  useTitle("Pilcrow");

  useHotkeys("Mod+N", () => newDoc(), {
    preventDefault: true,
    enableOnContentEditable: true,
  });

  if (!session) return null;

  return (
    <main className="flex flex-col h-screen md:flex-row">
      <PrevSidebar docs={docs} setCursor={setCursor} cursor={cursor} />
      <DocsInView docs={docs} homepage={homepage} cursor={cursor} />
      <NextSidebar docs={docs} setCursor={setCursor} cursor={cursor} />
      <DocsShared />
      <Info />
      <Island lazy fallback={null}>
        <CommandMenu />
      </Island>
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
