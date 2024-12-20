// API Route Example
// https://nextjs.org/docs/api-routes/introduction
import { eq } from "drizzle-orm";

import { db, schema } from "@/lib/db";
import { auth } from "@/lib/auth";

import type { ApiReturnType, User } from "@/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await auth(req, res);
  if (!session)
    return res.status(401).json({ message: "Unathenticated. Please login." });
  const userId = session.user.id;

  if (req.method === "POST") {
    const json = await saveData(userId, req.body);
    console.log("JSON", json);
    return res.status(200).json(json);
  }

  const json = await getData(userId);

  return res.status(200).json(json);
}

async function getData(userId: string): Promise<ApiReturnType<Partial<User>>> {
  try {
    const data = await db
      .select({
        name: schema.users.name,
        email: schema.users.email,
        isPublic: schema.users.isPublic,
        publicId: schema.users.publicId,
        id: schema.users.id,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .then((res) => res[0]);

    return { data, status: 200 };
  } catch (e) {
    console.error("api/user", (e as Error).message);
    return { data: null, status: 500, error: e as Error };
  }
}

async function saveData(userId: string, userData: User) {
  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .then((res) => res[0]);

    if (existingUser) {
      const data = await db
        .update(schema.users)
        .set({ ...userData })
        .where(eq(schema.users.id, userId))
        .returning()
        .then((res) => res[0]);

      return {
        data,
        status: 200,
      };
    } else {
      // Insert new user
      const data = await db
        .insert(schema.users)
        .values({
          ...userData,
          id: userId,
        })
        .returning()
        .then((res) => res[0]);
      return { data, status: 200 };
    }
  } catch (e) {
    console.error("api/user", (e as Error).message);
    return { data: null, status: 500, error: e as Error };
  }
}
