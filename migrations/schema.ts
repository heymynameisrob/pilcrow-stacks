import { pgTable, serial, text, date, uuid, boolean, unique, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const nextstarterPosts = pgTable("nextstarter_posts", {
	id: serial().primaryKey().notNull(),
	title: text(),
	date: date().defaultNow(),
	content: text(),
	userId: uuid("user_id"),
	pubic: boolean().default(false),
});

export const nextstarterUser = pgTable("nextstarter_user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
},
(table) => {
	return {
		nextstarterUserEmailUnique: unique("nextstarter_user_email_unique").on(table.email),
	}
});
