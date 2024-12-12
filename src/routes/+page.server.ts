import { db } from '$lib/server/db';
import { checkWatched, getDetails, type Kind } from '$lib/server/movies';
import * as table from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

import { atclient } from '$lib/server/client';
import { isValidHandle } from '@atproto/syntax';
import { error, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	mark: async (event) => {
		const did = event.locals.user?.did as string;
		const formData = await event.request.formData();
		const id = parseInt(formData.get('id') as string);
		const kind = formData.get('kind') as Kind;

		const result = await getDetails(id, kind);

		const watched = await checkWatched(id, did, kind);

		if (watched !== false) {
			await db
				.update(table.items)
				.set({ watched: watched !== 0 ? 0 : 1 })
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
				timestamp: new Date()
			});
		}
	},
	login: async ({ request }) => {
		const formData = await request.formData();
		const handle = formData.get('handle') as string;
		if (!isValidHandle(handle)) {
			error(400, { message: 'invalid handle' });
		}

		const url = await atclient.authorize(handle, { scope: 'atproto transition:generic' });
		if (!url) {
			error(500);
		}
		redirect(301, url.toString());
	},
	logout: async ({ cookies }) => {
		cookies.delete('sid', { path: '/' });
		redirect(301, '/');
	}
};

