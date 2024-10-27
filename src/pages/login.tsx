import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";

import { FullPageLayout } from "@/components/layout";
import { LoginForm } from "@/components/login/login-form";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import type { GetServerSidePropsContext } from "next";

export default function Page() {
  return (
    <FullPageLayout>
      <LoginForm />
    </FullPageLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session)
    return {
      redirect: {
        permanent: false,
        destination: "/app",
      },
    };

  return {
    props: {
      session,
    },
  };
}
