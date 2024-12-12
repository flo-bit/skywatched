import { resolveHandle } from '$lib/bluesky.js';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const handle = event.params.handle;

	const did = await resolveHandle({ handle: handle });

	const movies = await db.select().from(table.items).where(eq(table.items.did, did));

	// filter out movies that are not watched
	const watchedItems = movies.filter((movie) => movie.watched === 1);

	// sort movies by timestamp
	watchedItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

	let isUser = false;
	if (event.locals.user?.did === did) {
		isUser = true;
	}

	return { items: watchedItems, isUser, username: event.params.handle };
}
