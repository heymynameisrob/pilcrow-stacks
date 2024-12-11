import { relations } from "drizzle-orm/relations";
import { pilcrowstacksUser, pilcrowstacksDocs, pilcrowstacksDocsInView, pilcrowstacksBacklinks } from "./schema";

export const pilcrowstacksDocsRelations = relations(pilcrowstacksDocs, ({one, many}) => ({
	pilcrowstacksUser: one(pilcrowstacksUser, {
		fields: [pilcrowstacksDocs.userId],
		references: [pilcrowstacksUser.id]
	}),
	pilcrowstacksDocsInViews: many(pilcrowstacksDocsInView),
	pilcrowstacksBacklinks_sourceId: many(pilcrowstacksBacklinks, {
		relationName: "pilcrowstacksBacklinks_sourceId_pilcrowstacksDocs_id"
	}),
	pilcrowstacksBacklinks_targetId: many(pilcrowstacksBacklinks, {
		relationName: "pilcrowstacksBacklinks_targetId_pilcrowstacksDocs_id"
	}),
}));

export const pilcrowstacksUserRelations = relations(pilcrowstacksUser, ({many}) => ({
	pilcrowstacksDocs: many(pilcrowstacksDocs),
	pilcrowstacksDocsInViews: many(pilcrowstacksDocsInView),
	pilcrowstacksBacklinks: many(pilcrowstacksBacklinks),
}));

export const pilcrowstacksDocsInViewRelations = relations(pilcrowstacksDocsInView, ({one}) => ({
	pilcrowstacksUser: one(pilcrowstacksUser, {
		fields: [pilcrowstacksDocsInView.userId],
		references: [pilcrowstacksUser.id]
	}),
	pilcrowstacksDoc: one(pilcrowstacksDocs, {
		fields: [pilcrowstacksDocsInView.homepage],
		references: [pilcrowstacksDocs.id]
	}),
}));

export const pilcrowstacksBacklinksRelations = relations(pilcrowstacksBacklinks, ({one}) => ({
	pilcrowstacksUser: one(pilcrowstacksUser, {
		fields: [pilcrowstacksBacklinks.userId],
		references: [pilcrowstacksUser.id]
	}),
	pilcrowstacksDoc_sourceId: one(pilcrowstacksDocs, {
		fields: [pilcrowstacksBacklinks.sourceId],
		references: [pilcrowstacksDocs.id],
		relationName: "pilcrowstacksBacklinks_sourceId_pilcrowstacksDocs_id"
	}),
	pilcrowstacksDoc_targetId: one(pilcrowstacksDocs, {
		fields: [pilcrowstacksBacklinks.targetId],
		references: [pilcrowstacksDocs.id],
		relationName: "pilcrowstacksBacklinks_targetId_pilcrowstacksDocs_id"
	}),
}));