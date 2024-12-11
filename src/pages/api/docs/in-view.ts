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
  const session = await auth(req, res);
  if (!session)
    return res.status(401).json({ message: "Unathenticated. Please login." });
  const userId = session.user.id;

  if (req.method === "GET") {
    const json = await getData(userId);
    return res.status(200).json(json);
  }

  if (req.method === "PUT") {
    const data = req.body;
    console.log("asdasdsad");
    const json = await updateDocsInView(userId, data);
    return res.status(200).json(json);
  }

  return res.status(405).json({ message: "Method not allowed" });
}

async function getData(userId: string) {
  try {
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

async function updateDocsInView(userId: string, data: DocsInView) {
  try {
    const existing = await db.query.docsInView.findFirst({
      where: eq(schema.docsInView.userId, userId),
    });

    if (existing) {
      // Update
      await db
        .update(schema.docsInView)
        .set({ ...data })
        .where(eq(schema.docsInView.userId, userId));
    } else {
      // Insert
      await db.insert(schema.docsInView).values({
        ...data,
        userId,
      });
    }

    return {
      data,
      status: 200,
    };
  } catch (error) {
    console.error("Error updating docs in view:", error);
    return { data: null, status: 500, error: "Failed to update docs in view" };
  }
}
