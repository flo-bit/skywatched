import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const username = event.params.username;

	const movies = await db.select().from(table.movies).where(eq(table.movies.username, username));

	// filter out movies that are not watched
	const watchedMovies = movies.filter((movie) => movie.watched === 1);

	let isUser = false;
	if (event.locals.user?.username === username) {
		isUser = true;
	}

	return { movies: watchedMovies, isUser, username };
}
