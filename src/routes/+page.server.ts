import { db } from '$lib/server/db';
import { checkWatched, getDetails, type Kind } from '$lib/server/movies';
import type { Actions } from './$types';
import * as table from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const actions: Actions = {
	mark: async (event) => {
		const username = event.locals.user?.username as string;
		const formData = await event.request.formData();
		const id = parseInt(formData.get('id') as string);
		const kind = formData.get('kind') as Kind;

		const result = await getDetails(id, kind);

		const watched = await checkWatched(id, username, kind);

		if (watched !== false) {
			await db
				.update(table.items)
				.set({ watched: watched !== 0 ? 0 : 1 })
				.where(
					and(
						eq(kind === 'movie' ? table.items.movieId : table.items.showId, id),
						eq(table.items.username, username)
					)
				);
		} else {
			await db.insert(table.items).values({
				username,
				id: crypto.randomUUID(),
				movieId: kind === 'movie' ? id : null,
				showId: kind === 'tv' ? id : null,
				watched: 1,
				originalTitle: result.original_title ?? result.original_name,
				posterPath: result.poster_path,
				timestamp: new Date()
			});
		}
	}
};
