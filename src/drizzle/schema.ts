import {
  text,
  pgTableCreator,
  date,
  uuid,
  foreignKey,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

const pgTable = pgTableCreator((name) => `pilcrowstacks_${name}`);

/**
 * Setup for Magic Link login
 * User entry only created after onboarding (first sign-in)
 */
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").unique(),
  image: text("image"),
});

export const docs = pgTable(
  "docs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: text("title"),
    emoji: text("emoji"),
    content: jsonb("content"),
    lastEdited: date("last_edited").defaultNow(),
    user: text("user_id"),
  },
  (table) => {
    return {
      postsUserIdFkey: foreignKey({
        columns: [table.user],
        foreignColumns: [users.id],
        name: "posts_user_id_fkey",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  },
);

export const backlinks = pgTable(
  "backlinks",
  {
    user: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    source: text("source_id")
      .notNull()
      .references(() => docs.id, { onDelete: "cascade" }),
    target: text("target_id")
      .notNull()
      .references(() => docs.id, { onDelete: "cascade" }),
  },
  (table) => ({
    // Composite primary key of both columns to prevent duplicate backlinks
    pk: primaryKey({ columns: [table.source, table.target] }),
  }),
);
