import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const AuthSession = sqliteTable('auth_session', {
	key: text('key', { mode: 'text' }).primaryKey().unique(),
	session: text('session', { mode: 'json' }).notNull()
});

export const AuthState = sqliteTable('auth_state', {
	key: text('key', { mode: 'text' }).primaryKey().unique(),
	state: text('state', { mode: 'json' }).notNull()
});
