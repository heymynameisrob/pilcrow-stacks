import * as schema from "@/drizzle/schema";
import * as relations from "@/drizzle/relations";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL!,
});
const db = drizzle({ client: pool, schema: { ...schema, ...relations } });

export { db, schema };
