import { useSession } from "next-auth/react";
import { useTitle } from "react-use";

import { auth } from "@/auth";
import { Container, SidebarLayout } from "@/components/layout";

import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await auth(ctx);

  if (!session)
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };

  return {
    props: {
      isLoggedIn: true,
    },
  };
}

export default function Page({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { data: session } = useSession();
  useTitle("Robs app");

  if (!isLoggedIn) return null;

  return (
    <SidebarLayout>
      <Container>
        <h1>Welcome {session?.user?.email}</h1>
      </Container>
    </SidebarLayout>
  );
}
