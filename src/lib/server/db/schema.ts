import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const movies = sqliteTable('movies', {
	id: integer('id').primaryKey(),
	username: text('username')
		.notNull()
		.references(() => user.username),
	watched: integer('watched').notNull(),
	rating: integer('rating'),
	ratingText: text('rating_text'),
	posterPath: text('poster_path'),
	originalTitle: text('original_title').notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Movies = typeof movies.$inferSelect;
