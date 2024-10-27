import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// import * as relations from "@/drizzle/relations";
import * as schema from "@/drizzle/schema";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL!,
});
const db = drizzle({ client: pool, schema: { ...schema } });

export { db, schema };
