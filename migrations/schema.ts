import { pgTable, foreignKey, text, jsonb, date, unique, primaryKey, pgSequence } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"


export const nextstarterPostsIdSeq = pgSequence("nextstarter_posts_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })


export const pilcrowstacksDocs = pgTable("pilcrowstacks_docs", {
	id: text().primaryKey().notNull(),
	title: text(),
	emoji: text(),
	content: jsonb(),
	lastEdited: date("last_edited").defaultNow(),
	userId: text("user_id"),
},
(table) => {
	return {
		postsUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [pilcrowstacksUser.id],
			name: "posts_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const pilcrowstacksUser = pgTable("pilcrowstacks_user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text(),
	image: text(),
},
(table) => {
	return {
		pilcrowstacksUserEmailUnique: unique("pilcrowstacks_user_email_unique").on(table.email),
	}
});

export const pilcrowstacksBacklinks = pgTable("pilcrowstacks_backlinks", {
	sourceId: text("source_id").notNull(),
	targetId: text("target_id").notNull(),
},
(table) => {
	return {
		pilcrowstacksBacklinksSourceIdPilcrowstacksDocsIdFk: foreignKey({
			columns: [table.sourceId],
			foreignColumns: [pilcrowstacksDocs.id],
			name: "pilcrowstacks_backlinks_source_id_pilcrowstacks_docs_id_fk"
		}).onDelete("cascade"),
		pilcrowstacksBacklinksTargetIdPilcrowstacksDocsIdFk: foreignKey({
			columns: [table.targetId],
			foreignColumns: [pilcrowstacksDocs.id],
			name: "pilcrowstacks_backlinks_target_id_pilcrowstacks_docs_id_fk"
		}).onDelete("cascade"),
		pilcrowstacksBacklinksSourceIdTargetIdPk: primaryKey({ columns: [table.sourceId, table.targetId], name: "pilcrowstacks_backlinks_source_id_target_id_pk"}),
	}
});
