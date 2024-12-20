// API Route Example
// https://nextjs.org/docs/api-routes/introduction
import { eq, and } from "drizzle-orm";

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

  const { id, publicId } = req.query;

  console.log(publicId, id);

  const json = await getData(publicId as string, id as string);

  return res.status(200).json(json);
}

async function getData(publicId: string, docId: string) {
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
