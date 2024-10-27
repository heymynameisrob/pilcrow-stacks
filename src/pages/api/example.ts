// API Route Example
// https://nextjs.org/docs/api-routes/introduction
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";

import type { User } from "@/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  // Increase for expensive or long functions (e.g AI)
  maxDuration: 5,
};

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
  const session = await auth(req, res);
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
    const json = await saveData(userId, req.body);
    return res.status(200).json(json);
  }

  const json = getData(userId);

  return res.status(200).json(json);
}

/**
 * 02. Server Function
 * Abstact database queries into seperate functions to keep the API route cleaner
 * In most cases, you just need to update these functions and leave the rest
 */
async function getData(userId: string) {
  try {
    const data = await db
      .select({
        name: schema.users.name,
        email: schema.users.email,
        id: schema.users.id,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId));

    return { data, status: 200, error: null };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { data: null, status: 500, error: "Failed to fetch user profile" };
  }
}

async function saveData(userId: string, data: Partial<User>) {
  try {
    const res = await db
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, userId))
      .returning()
      .then((res) => res[0]);
    return res;
  } catch (err: unknown) {
    console.error("Error fetching user profile:", err);
    return { data: null, status: 500, error: "Failed to save user profile" };
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
