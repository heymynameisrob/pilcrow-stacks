// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { auth } from "@/auth";
import { db, schema } from "@/db";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await auth();
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const json = await db.select().from(schema.test);

  return res.status(200).json(json);
}
