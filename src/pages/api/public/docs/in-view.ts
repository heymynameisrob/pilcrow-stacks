// API Route Example
// https://nextjs.org/docs/api-routes/introduction
import { eq, desc, and } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { DocsInView } from "@/lib/types";

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
        docIds: schema.docsInView.docIds,
        cursor: schema.docsInView.cursor,
        homepage: schema.docsInView.homepage,
      })
      .from(schema.docsInView)
      .where(eq(schema.docsInView.userId, userId))
      .limit(1);

    if (data[0]?.homepage && data[0]?.docIds && data[0]?.docIds.length > 0) {
      const newDocIds = data[0].docIds.includes(data[0].homepage)
        ? [
            data[0].homepage,
            ...data[0].docIds.filter((id) => id !== data[0].homepage),
          ]
        : [data[0].homepage, ...data[0].docIds];

      return {
        data: { ...data[0], docIds: newDocIds },
        status: 200,
      };
    }

    return {
      data: data[0],
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching docs in view:", error);
    return { data: null, status: 500, error: "Failed to fetch docs in view" };
  }
}
