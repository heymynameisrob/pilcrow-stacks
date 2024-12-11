import { pgTable, unique, text, foreignKey, jsonb, timestamp, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




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

export const pilcrowstacksDocs = pgTable("pilcrowstacks_docs", {
	id: text().primaryKey().notNull(),
	title: text(),
	emoji: text(),
	content: jsonb(),
	lastEdited: timestamp("last_edited", { mode: 'string' }).defaultNow().notNull(),
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

export const pilcrowstacksDocsInView = pgTable("pilcrowstacks_docs_in_view", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	docIds: jsonb("doc_ids").notNull(),
	cursor: text().default('0').notNull(),
	homepage: text(),
	lastUpdated: timestamp("last_updated", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		pilcrowstacksDocsInViewUserIdPilcrowstacksUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [pilcrowstacksUser.id],
			name: "pilcrowstacks_docs_in_view_user_id_pilcrowstacks_user_id_fk"
		}).onDelete("cascade"),
		pilcrowstacksDocsInViewHomepagePilcrowstacksDocsIdFk: foreignKey({
			columns: [table.homepage],
			foreignColumns: [pilcrowstacksDocs.id],
			name: "pilcrowstacks_docs_in_view_homepage_pilcrowstacks_docs_id_fk"
		}).onDelete("cascade"),
	}
});

export const pilcrowstacksBacklinks = pgTable("pilcrowstacks_backlinks", {
	userId: text("user_id").notNull(),
	sourceId: text("source_id").notNull(),
	targetId: text("target_id").notNull(),
},
(table) => {
	return {
		pilcrowstacksBacklinksUserIdPilcrowstacksUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [pilcrowstacksUser.id],
			name: "pilcrowstacks_backlinks_user_id_pilcrowstacks_user_id_fk"
		}).onDelete("cascade"),
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
