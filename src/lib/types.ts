import { InferSelectModel } from "drizzle-orm";

import { schema } from "@/lib/db";

export type User = InferSelectModel<typeof schema.users>;
export type Doc = InferSelectModel<typeof schema.docs>;
export type Backlink = InferSelectModel<typeof schema.backlinks>;

export type ApiReturnType<T> = {
  data: T | null;
  status: number;
  error?: Error;
};
