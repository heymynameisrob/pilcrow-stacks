import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/db/schema";
// import * as relations from "@/db/relations";

import { neonConfig } from "@neondatabase/serverless";

if (process.env.NODE_ENV === "development") {
  neonConfig.wsProxy = (host) => `${host}:54330/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const db = drizzle(sql, { schema: { ...schema } });

export { db, schema };
