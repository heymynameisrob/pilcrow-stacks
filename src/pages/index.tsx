import React from "react";
import { useSession } from "next-auth/react";
import { useTitle } from "react-use";
import { getServerSession } from "next-auth";
import { useHotkeys } from "react-hotkeys-hook";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useDocs } from "@/queries/docs";
import { PrevSidebar, NextSidebar } from "@/components/sidebar";
import { DocsInView } from "@/components/docs/docs-view";
import { Info } from "@/components/info";
import { DocsReadOnly } from "@/components/docs/docs-readonly";

import type { GetServerSidePropsContext } from "next";

export default function Page() {
  const { data: session } = useSession();
  const { newDoc } = useDocs();

  useTitle("Pilcrow");

  useHotkeys("Mod+N", () => newDoc(), {
    preventDefault: true,
    enableOnContentEditable: true,
  });

  if (!session) return null;

  return (
    <main className="flex flex-col h-screen md:flex-row">
      <PrevSidebar />
      <DocsInView />
      <NextSidebar />
      <DocsReadOnly />
      <Info />
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
