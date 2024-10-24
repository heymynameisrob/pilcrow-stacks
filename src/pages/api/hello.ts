// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  /**
   * Auth check must happen in front of any route that isn't completely public
   */
  const session = await auth(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  return res.status(200).json({ name: "John Doe" });
}
