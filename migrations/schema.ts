import { pgTable, unique, text, timestamp, foreignKey, primaryKey, integer, boolean } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




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

export const nextstarterSession = pgTable("nextstarter_session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
},
(table) => {
	return {
		nextstarterSessionUserIdNextstarterUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [nextstarterUser.id],
			name: "nextstarter_session_userId_nextstarter_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const nextstarterTest = pgTable("nextstarter_test", {
	name: text(),
});

export const nextstarterVerificationToken = pgTable("nextstarter_verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
},
(table) => {
	return {
		nextstarterVerificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "nextstarter_verificationToken_identifier_token_pk"}),
	}
});

export const nextstarterAuthenticator = pgTable("nextstarter_authenticator", {
	credentialId: text().notNull(),
	userId: text().notNull(),
	providerAccountId: text().notNull(),
	credentialPublicKey: text().notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text().notNull(),
	credentialBackedUp: boolean().notNull(),
	transports: text(),
},
(table) => {
	return {
		nextstarterAuthenticatorUserIdNextstarterUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [nextstarterUser.id],
			name: "nextstarter_authenticator_userId_nextstarter_user_id_fk"
		}).onDelete("cascade"),
		nextstarterAuthenticatorUserIdCredentialIdPk: primaryKey({ columns: [table.credentialId, table.userId], name: "nextstarter_authenticator_userId_credentialID_pk"}),
		nextstarterAuthenticatorCredentialIdUnique: unique("nextstarter_authenticator_credentialID_unique").on(table.credentialId),
	}
});

export const nextstarterAccount = pgTable("nextstarter_account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		nextstarterAccountUserIdNextstarterUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [nextstarterUser.id],
			name: "nextstarter_account_userId_nextstarter_user_id_fk"
		}).onDelete("cascade"),
		nextstarterAccountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "nextstarter_account_provider_providerAccountId_pk"}),
	}
});
