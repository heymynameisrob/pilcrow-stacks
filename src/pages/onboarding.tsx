import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut, useSession } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useTitle } from "react-use";
import { eq } from "drizzle-orm";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { FullPageLayout } from "@/components/layout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Separator } from "@/components/separator";
import { api } from "@/lib/fetch";
import { db, schema } from "@/lib/db";

type OnboardingReturnType = {
  ok: boolean;
};

const formSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(2, { message: "Tell me your name horse-master!" })
    .max(150, { message: "Too long bozo" }),
});

export default function Page({ email }: { email: string | null }) {
  const { data: session } = useSession();
  useTitle("Onboarding");

  if (typeof window === "undefined") return null;
  if (!session || !email) return null;

  return (
    <FullPageLayout>
      <div className="flex flex-col justify-start gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="!text-2xl">Welcome</h1>
          <p className="text-secondary">Tell us about yourself</p>
        </div>
        <Separator />
        <OnboardingForm email={email} />
      </div>
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-2 p-4">
        <small className="text-secondary">
          Logged in as <strong>{email}</strong>
        </small>
        <button
          className="text-sm font-medium underline"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </FullPageLayout>
  );
}

function OnboardingForm({ email }: { email: string }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, email } = values;

    setIsSubmitting(true);
    const res: OnboardingReturnType = await api
      .post("/api/user", { json: { name, email } })
      .json();
    if (res.ok) {
      router.push("/app");
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:w-[360px] space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  icon={<EnvelopeIcon className="w-5 h-5 opacity-60" />}
                  className="h-11"
                  readOnly
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Frodo Baggins"
                  icon={<UserCircleIcon className="w-5 h-5 opacity-60" />}
                  className="h-11"
                  autoFocus
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          className="w-full"
          disabled={isSubmitting}
        >
          Save
        </Button>
      </form>
    </Form>
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

  // Check if user already exists in Postgres and is thus onboarded
  const isOnboarded = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id));

  if (isOnboarded)
    return {
      redirect: {
        permanent: false,
        destination: "/app",
      },
    };

  return {
    props: {
      session,
      email: session?.user?.email || null,
    },
  };
}
