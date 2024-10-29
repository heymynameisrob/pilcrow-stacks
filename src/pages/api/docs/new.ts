// API Route Example
// https://nextjs.org/docs/api-routes/introduction
import { format } from "date-fns";

import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await auth(req, res);
  if (!session)
    return res.status(401).json({ message: "Unathenticated. Please login." });
  const userId = session.user.id;

  if (req.method !== "POST") {
    return res.status(504).json({ message: "Wrong method" });
  }

  const json = await saveData(userId);
  return res.status(200).json(json);
}

async function saveData(userId: string) {
  try {
    const res = await db
      .insert(schema.docs)
      .values({
        title: format(new Date(), "MM/dd/yyyy"),
        emoji: "📝",
        user: userId,
      })
      .returning()
      .then((res) => res[0]);
    return { data: res, status: 200 };
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
