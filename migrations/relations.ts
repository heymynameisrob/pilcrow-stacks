import { relations } from "drizzle-orm/relations";
import { nextstarterUser, nextstarterSession, nextstarterAuthenticator, nextstarterAccount } from "./schema";

export const nextstarterSessionRelations = relations(nextstarterSession, ({one}) => ({
	nextstarterUser: one(nextstarterUser, {
		fields: [nextstarterSession.userId],
		references: [nextstarterUser.id]
	}),
}));

export const nextstarterUserRelations = relations(nextstarterUser, ({many}) => ({
	nextstarterSessions: many(nextstarterSession),
	nextstarterAuthenticators: many(nextstarterAuthenticator),
	nextstarterAccounts: many(nextstarterAccount),
}));

export const nextstarterAuthenticatorRelations = relations(nextstarterAuthenticator, ({one}) => ({
	nextstarterUser: one(nextstarterUser, {
		fields: [nextstarterAuthenticator.userId],
		references: [nextstarterUser.id]
	}),
}));

export const nextstarterAccountRelations = relations(nextstarterAccount, ({one}) => ({
	nextstarterUser: one(nextstarterUser, {
		fields: [nextstarterAccount.userId],
		references: [nextstarterUser.id]
	}),
}));