import { defineConfig } from "drizzle-kit";
import "@/drizzle/envConfig";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.PROD_DB!,
  },
  tablesFilter: ["pilcrowstacks_*"],
});
