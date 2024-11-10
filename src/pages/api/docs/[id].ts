// API Route Example
// https://nextjs.org/docs/api-routes/introduction
import { eq, and } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";

import type { Doc } from "@/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await auth(req, res);
  if (!session)
    return res.status(401).json({ message: "Unathenticated. Please login." });
  const userId = session.user.id;

  const { id } = req.query;

  if (req.method === "POST") {
    const json = await saveData(userId, req.body);
    return res.status(200).json(json);
  }

  const json = await getData(userId, id as string);

  return res.status(200).json(json);
}

async function getData(userId: string, docId: string) {
  try {
    const data = await db
      .select()
      .from(schema.docs)
      .where(and(eq(schema.docs.user, userId), eq(schema.docs.id, docId)))
      .then((res) => res[0]);

    return { data, status: 200 };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { data: null, status: 500, error: "Failed to fetch user profile" };
  }
}

async function saveData(userId: string, data: Doc) {
  try {
    const res = await db
      .update(schema.docs)
      .set({
        ...data,
        lastEdited: new Date().toISOString(),
        user: userId,
      })
      .where(eq(schema.docs.id, data.id))
      .returning()
      .then((res) => res[0]);
    console.log(data, res);
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
