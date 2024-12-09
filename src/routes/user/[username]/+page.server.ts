import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const username = event.params.username;

	const movies = await db.select().from(table.items).where(eq(table.items.username, username));

	// filter out movies that are not watched
	const watchedItems = movies.filter((movie) => movie.watched === 1);

	// sort movies by timestamp
	watchedItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

	let isUser = false;
	if (event.locals.user?.username === username) {
		isUser = true;
	}

	return { items: watchedItems, isUser, username };
}
