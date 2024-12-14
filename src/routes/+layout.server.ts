import {
	getWatchedMoviesIds,
	getWatchedMoviesIdsFromPDS,
	getWatchedShowsIds,
	getWatchedShowsIdsFromPDS
} from '$lib/server/movies';
import { Agent } from '@atproto/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (event.locals.user && event.locals.agent && event.locals.agent instanceof Agent) {
		const watchedMovies = await getWatchedMoviesIdsFromPDS(
			event.locals.agent,
			event.locals.user.did
		);
		const watchedShows = await getWatchedShowsIdsFromPDS(event.locals.agent, event.locals.user.did);

		return { user: event.locals.user, watchedMovies, watchedShows };
	}

	return { user: event.locals.user };
};
