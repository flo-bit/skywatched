import { db } from '$lib/server/db';
import { checkWatched, getDetails, searchMovie } from '$lib/server/movies';
import type { Actions } from './$types';
import * as table from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	// redirect to / if not logged in
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const query = event.url.searchParams.get('query');

	if (query) {
		const results = await searchMovie(query);

		return { results: results.map((result) => ({ ...result, movieId: result.id })), query };
	}

	return { results: [], query };
}

export const actions: Actions = {
	mark: async (event) => {
		const username = event.locals.user?.username as string;
		const movieId = parseInt((await event.request.formData()).get('id') as string);

		const result = await getDetails(movieId);

		const watched = await checkWatched(movieId, username);

		console.log(watched, username, movieId, result);

		if (watched !== false) {
			await db
				.update(table.movies)
				.set({ watched: watched ? 0 : 1 })
				.where(and(eq(table.movies.movieId, movieId), eq(table.movies.username, username)));
		} else {
			await db.insert(table.movies).values({
				username,
				id: crypto.randomUUID(),
				movieId: movieId,
				watched: 1,
				originalTitle: result.original_title,
				posterPath: result.poster_path,
				timestamp: new Date()
			});
		}
	}
};
