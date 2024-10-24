import { auth } from "@/auth";
import { FullPageLayout } from "@/components/layout";
import { LoginForm } from "@/components/login/login-form";

import type { GetServerSidePropsContext } from "next";

export default function Page({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (isLoggedIn) return null;

  return (
    <FullPageLayout>
      <LoginForm />
    </FullPageLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await auth(ctx);

  if (session)
    return {
      redirect: {
        permanent: false,
        destination: "/app",
      },
    };

  return {
    props: {
      isLoggedIn: false,
    },
  };
}
