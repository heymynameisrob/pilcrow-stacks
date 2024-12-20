import React from "react";
import { eq } from "drizzle-orm";

import { PrevSidebar, NextSidebar } from "@/components/sidebar";
import { DocsInView } from "@/components/docs/docs-view";
import { db, schema } from "@/lib/db";
import { usePublicDocsStore, useReadOnlyStore } from "@/stores/docs";
import { usePublicDocs } from "@/queries/public";

import type { GetServerSidePropsContext } from "next";

export default function Page({ publicId }: { publicId: string }) {
  const { setReadOnlyMode } = useReadOnlyStore();
  const { homepage } = usePublicDocs(publicId);

  const { docs, cursor, setCursor } = usePublicDocsStore();

  React.useEffect(() => {
    setReadOnlyMode(true);
    localStorage.setItem(`pilcrow_${publicId}`, JSON.stringify([homepage]));
  }, [publicId, homepage, setReadOnlyMode]);

  return (
    <main className="flex flex-col h-screen md:flex-row">
      <PrevSidebar docs={docs} setCursor={setCursor} cursor={cursor} />
      <DocsInView
        publicId={publicId}
        docs={docs}
        homepage={homepage}
        cursor={cursor}
      />
      <NextSidebar docs={docs} setCursor={setCursor} cursor={cursor} />
      <PilcrowBanner />
    </main>
  );
}

function PilcrowBanner() {
  return (
    <div className="fixed bottom-0 left-0 z-max flex items-center gap-1 px-2 py-2 h-10 bg-cyan-400 text-black font-medium rounded-tr-lg text-sm">
      Write and share notes on
      <a
        href="https://pilcrow.xyz"
        target="_blank"
        className="text-black font-medium underline"
      >
        pilcrow.xyz
      </a>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const param = (ctx.params?.user as string) ?? "";

  // For nicer urls we use "rob-hough-123" but only 123 is the public id
  const publicId = param.split("-").pop()!;

  const userQuery = await db
    .select({
      id: schema.users.id,
      isPublic: schema.users.isPublic,
      name: schema.users.name,
    })
    .from(schema.users)
    .where(eq(schema.users.publicId, publicId))
    .limit(1);
  const isPublic = userQuery[0]?.isPublic ?? false;

  if (!isPublic) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      publicId,
    },
  };
}
