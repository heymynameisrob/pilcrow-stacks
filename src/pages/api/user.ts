// API Route Example
// https://nextjs.org/docs/api-routes/introduction
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

import { db, schema } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import type { ApiReturnType, User } from "@/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  /**
   * 00. Auth
   * Every non-public route needs to have an authentication check
   * Here we use httpOnly cookies via next-auth to check against session data in database
   * This tells us if the user is 1) logged in and 2) which user it is
   * This stops any unauthenticated access as well as unauthorized (spoofing other users) access
   */
  const session = await getServerSession(req, res, authOptions);

  if (!session)
    return res.status(401).json({ message: "Unathenticated. Please login." });
  const userId = session.user.id;

  /**
   * 01. Request type
   * Some requests can be split into different routes (e.g /user and /user/delete)
   * But when you want different methods (GET, POST) on the same route - make a check for it and give it an early return.
   * Treat GET as the default. Use POST for pretty much any mutation (Create, Update, Delete etc)
   */

  if (req.method === "POST") {
    await saveData(userId, req.body);
    return res.status(200).json({ ok: true });
  }

  const json = await getData(userId);

  return res.status(200).json(json);
}

/**
 * 02. Server Function
 * Abstact database queries into seperate functions to keep the API route cleaner
 * This should never be exposed outside of the file (or to the frontend).
 * In most cases, you just need to update these functions and leave the rest
 */
async function getData(userId: string): Promise<ApiReturnType<Partial<User>>> {
  try {
    const data = await db
      .select({
        name: schema.users.name,
        email: schema.users.email,
        id: schema.users.id,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .then((res) => res[0]);

    return { data, status: 200 };
  } catch (e) {
    console.error("api/user", (e as Error).message);
    return { data: null, status: 500, error: e as Error };
  }
}

async function saveData(userId: string, data: { email: string; name: string }) {
  try {
    const res = await db
      .insert(schema.users)
      .values({
        ...data,
        id: userId,
      })
      .returning()
      .then((res) => res[0]);
    return { data: res, status: 200 };
  } catch (e) {
    console.error("api/user", (e as Error).message);
    return { data: null, status: 500, error: e as Error };
  }
}

// Public - Only EVER set cache-control headers on public data
// Everything is private, no-store by default as most routes are user-session based
// This is general use SWR (stale-while-revalidate) that'll do for most public-data purposes
// It sets a cache with Vercel CDN for 7 days, after that any requests trigger a revalidation
// Use this instead of Redis
//
// res.setHeader(
//   "Cache-Control",
//   "public, max-age=604800, stale-while-revalidate=86400",
// );
