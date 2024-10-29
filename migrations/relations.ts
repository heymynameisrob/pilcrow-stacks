import { relations } from "drizzle-orm/relations";
import { pilcrowstacksUser, pilcrowstacksDocs, pilcrowstacksBacklinks } from "./schema";

export const pilcrowstacksDocsRelations = relations(pilcrowstacksDocs, ({one, many}) => ({
	pilcrowstacksUser: one(pilcrowstacksUser, {
		fields: [pilcrowstacksDocs.userId],
		references: [pilcrowstacksUser.id]
	}),
	pilcrowstacksBacklinks_sourceId: many(pilcrowstacksBacklinks, {
		relationName: "pilcrowstacksBacklinks_sourceId_pilcrowstacksDocs_id"
	}),
	pilcrowstacksBacklinks_targetId: many(pilcrowstacksBacklinks, {
		relationName: "pilcrowstacksBacklinks_targetId_pilcrowstacksDocs_id"
	}),
}));

export const pilcrowstacksUserRelations = relations(pilcrowstacksUser, ({many}) => ({
	pilcrowstacksDocs: many(pilcrowstacksDocs),
}));

export const pilcrowstacksBacklinksRelations = relations(pilcrowstacksBacklinks, ({one}) => ({
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