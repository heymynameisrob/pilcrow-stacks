import { InferSelectModel } from "drizzle-orm";

import { schema } from "@/lib/db";

export type User = InferSelectModel<typeof schema.users>;

export type ApiReturnType<T> = {
  data: T | null;
  status: number;
  error?: Error;
};
