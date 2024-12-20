// API Route Example
// https://nextjs.org/docs/api-routes/introduction
import { eq, desc } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: Consider rate limiter

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { publicId } = req.query;

  const json = await getData(publicId as string);
  return res.status(200).json(json);
}

async function getData(publicId: string) {
  try {
    const userQuery = await db
      .select({
        isPublic: schema.users.isPublic,
        id: schema.users.id,
      })
      .from(schema.users)
      .where(eq(schema.users.publicId, publicId))
      .limit(1);

    const isPublic = userQuery[0].isPublic ?? false;

    if (!isPublic) {
      return {
        data: null,
        error: "Not allowed",
        status: 403,
      };
    }

    const userId = userQuery[0].id;

    const data = await db
      .select({
        id: schema.docs.id,
        emoji: schema.docs.emoji,
        title: schema.docs.title,
        lastEdited: schema.docs.lastEdited,
      })
      .from(schema.docs)
      .where(eq(schema.docs.user, userId))
      .orderBy(desc(schema.docs.lastEdited));

    const homepage = await db
      .select({
        homepage: schema.docsInView.homepage,
      })
      .from(schema.docsInView)
      .where(eq(schema.docsInView.userId, userId))
      .limit(1);

    return {
      data: { docs: [...data], homepage: homepage[0].homepage },
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { data: null, status: 500, error: "Failed to fetch user profile" };
  }
}
