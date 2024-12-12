import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const AuthSession = sqliteTable('auth_session', {
	key: text('key', { mode: 'text' }).primaryKey().unique(),
	session: text('session', { mode: 'json' }).notNull()
});

export const AuthState = sqliteTable('auth_state', {
	key: text('key', { mode: 'text' }).primaryKey().unique(),
	state: text('state', { mode: 'json' }).notNull()
});

export const items = sqliteTable('items', {
	id: text('id').primaryKey(),
	movieId: integer('movie_id'),
	showId: integer('show_id'),
	did: text('did').notNull(),
	watched: integer('watched').notNull(),
	rating: integer('rating'),
	ratingText: text('rating_text'),
	posterPath: text('poster_path'),
	originalTitle: text('original_title').notNull(),
	timestamp: integer('timestamp', { mode: 'timestamp' }).notNull()
});

export type Movies = typeof items.$inferSelect;
