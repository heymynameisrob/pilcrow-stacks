// API Route Example
// https://nextjs.org/docs/api-routes/introduction
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";

import type { Backlink } from "@/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  /**
   * 00. Auth
   * Every non-public route needs to have an authentication check
   * Here we use httpOnly cookies via next-auth to check against session data in database
   * This tells us if the user is 1) logged in and 2) which user it is
   * This stops any unauthenticated access as well as unauthorized (spoofing other users) access
   */
  const session = await auth(req, res);
  if (!session)
    return res.status(401).json({ message: "Unathenticated. Please login." });
  const userId = session.user.id;
  /**
   * 01. Request type
   * Some requests can be split into different routes (e.g /user and /user/delete)
   * But when you want different methods (GET, POST) on the same route - make a check for it and give it an early return.
   * Treat GET as the default. Use POST for pretty much any mutation (Create, Update, Delete etc)
   */

  if (req.method === "POST") {
    const json = await saveData(userId, req.body);
    return res.status(200).json(json);
  }

  const json = await getData(userId);

  return res.status(200).json(json);
}

async function getData(userId: string) {
  try {
    const data = await db
      .select({
        target: schema.backlinks.target,
        source: schema.backlinks.source,
      })
      .from(schema.backlinks)
      .where(eq(schema.backlinks.user, userId));

    return { data, status: 200, error: null };
  } catch (error) {
    console.error("Error fetching backlinks:", error);
    return { data: null, status: 500, error: "Failed to fetch backlinks" };
  }
}

async function saveData(userId: string, data: Backlink) {
  try {
    const res = await db
      .insert(schema.backlinks)
      .values(data)
      .returning()
      .then((res) => res[0]);
    console.log("backlinks", res);
    return { data: res, status: 200 };
  } catch (err: unknown) {
    console.error("Error saving backlinks:", err);
    return { data: null, status: 500, error: "Failed to save backlink" };
  }
}
