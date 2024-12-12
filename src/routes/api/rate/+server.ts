import { db } from '$lib/server/db';
import { checkWatched, getDetails } from '$lib/server/movies';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

// Given a cursor and limit (opt)
// Return a JSON of FeedViewPost
export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	if (!user) {
		return error(401, 'Unauthorized API call');
	}

	const body = await request.json();
	const rating = body.rating;
	const review = body.review;
	const kind = body.kind;
	const id = body.id;
	const did = user.did;

	const result = await getDetails(id, kind);
	const watched = await checkWatched(id, did, kind);

	if (watched !== false) {
		await db
			.update(table.items)
			.set({ rating, ratingText: review })
			.where(
				and(
					eq(kind === 'movie' ? table.items.movieId : table.items.showId, id),
					eq(table.items.did, did)
				)
			);
	} else {
		await db.insert(table.items).values({
			did: did,
			id: crypto.randomUUID(),
			movieId: kind === 'movie' ? id : null,
			showId: kind === 'tv' ? id : null,
			watched: 1,
			originalTitle: result.original_title ?? result.original_name,
			posterPath: result.poster_path,
			timestamp: new Date(),
			rating,
			ratingText: review
		});
	}
	console.log('rated');

	return json({ status: 'rated' });
};
