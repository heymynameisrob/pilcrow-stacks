import { useSession } from "next-auth/react";
import { useTitle } from "react-use";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { AppLayout, Container, SidebarLayout } from "@/components/layout";

import type { GetServerSidePropsContext } from "next";

export default function Page() {
  // Props are passsed by default as set in __app.tsx
  const { data: session } = useSession();

  useTitle("Robs app");

  if (typeof window === "undefined") return null;
  if (!session) return null;

  return (
    <AppLayout>
      <Container>
        <h1>Welcome {session?.user?.email}</h1>
      </Container>
    </AppLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  // if (!session)
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/login",
  //     },
  //   };

  return {
    props: {
      session,
    },
  };
}
