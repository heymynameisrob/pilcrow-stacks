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

  if (req.method === "DELETE") {
    const json = await deleteData(userId, id as string);
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

    return { data: res, status: 200 };
  } catch (err: unknown) {
    console.error("Error fetching user profile:", err);
    return { data: null, status: 500, error: "Failed to save user profile" };
  }
}

async function deleteData(userId: string, docId: string) {
  try {
    const deleted = await db
      .delete(schema.docs)
      .where(and(eq(schema.docs.id, docId), eq(schema.docs.user, userId)))
      .returning()
      .then((res) => res[0]);

    return {
      data: deleted,
      status: 200,
      message: "Document successfully deleted",
    };
  } catch (err: unknown) {
    console.error("Error deleting document:", err);
    return {
      data: null,
      status: 500,
      error: "Failed to delete document",
    };
  }
}
