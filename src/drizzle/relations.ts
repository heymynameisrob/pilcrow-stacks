import { relations } from "drizzle-orm/relations";

import { sessions, users, authenticators, accounts } from "@/drizzle/schema";

export const sessionRelations = relations(sessions, ({ one }) => ({
  nextstarterUser: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  nextstarterSessions: many(sessions),
  nextstarterAuthenticators: many(authenticators),
  nextstarterAccounts: many(accounts),
}));

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
  nextstarterUser: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  nextstarterUser: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
