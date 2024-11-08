// API Route Example
// https://nextjs.org/docs/api-routes/introduction
import { eq, and, inArray } from "drizzle-orm";

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

  const json = await getData(userId, id as string);

  return res.status(200).json(json);
}

async function getData(userId: string, docId: string) {
  try {
    const backlinks = await db
      .select({
        source: schema.backlinks.source,
      })
      .from(schema.backlinks)
      .where(
        and(
          eq(schema.backlinks.user, userId),
          eq(schema.backlinks.target, docId),
        ),
      );

    if (!backlinks) return { data: null, status: 200 };

    const data = await db
      .select()
      .from(schema.docs)
      .where(
        and(
          eq(schema.docs.user, userId),
          inArray(
            schema.docs.id,
            backlinks.map((link) => link.source),
          ),
        ),
      );

    return { data, status: 200 };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { data: null, status: 500, error: "Failed to fetch user profile" };
  }
}
