// API Route Example
// https://nextjs.org/docs/api-routes/introduction
import { eq, desc, asc } from "drizzle-orm";

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

  const json = await getData(userId);

  return res.status(200).json(json);
}

async function getData(userId: string) {
  try {
    const data = await db
      .select({
        id: schema.docs.id,
        emoji: schema.docs.emoji,
        title: schema.docs.title,
      })
      .from(schema.docs)
      .where(eq(schema.docs.user, userId))
      .orderBy(desc(schema.docs.lastEdited));

    return { data, status: 200 };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { data: null, status: 500, error: "Failed to fetch user profile" };
  }
}
