import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

import { FullPageLayout } from "@/components/layout";
import { LoginForm } from "@/components/login/login-form";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db, schema } from "@/lib/db";

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

  const isOnboarded = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session?.user.id));

  if (session)
    return {
      redirect: {
        permanent: false,
        destination: isOnboarded ? "/app" : "/onboarding",
      },
    };

  return {
    props: {
      session,
    },
  };
}
