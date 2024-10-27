import NextAuth, { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";

import { IS_DEV } from "@/lib/flags";

const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export const authOptions: AuthOptions = {
  adapter: UpstashRedisAdapter(kv, {
    baseKeyPrefix: `${process.env.PROJECT_NAME!}:`,
  }),
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    // ...
  ],
  callbacks: {
    session({ session, user }) {
      // Next-auth is weird and splits user data into seperate bits for the session and actual user data.
      // None of these exist because we sign-in with email magic link
      // Basically very little season to mess with this.
      // You can get user profile data from Postgres database instead.
      session.user.id = user.id;
      session.user.name = session.user.name ?? null;
      session.user.image = null;

      return session;
    },
  },
  debug: IS_DEV,
  pages: {
    newUser: "/onboarding",
  },
};

export default NextAuth(authOptions);
