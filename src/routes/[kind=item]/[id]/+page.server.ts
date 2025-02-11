import { getRecentRecordsForItem } from '$lib/db.js';
import {
	getCast,
	getDetails,
	getRecommendations,
	getTrailer,
	getWatchProviders
} from '$lib/server/movies';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const id = parseInt(event.params.id.split('-')[0]);
	const kind = event.params.kind;

	if (!id) {
		return error(404, 'Not found');
	}
	const resultPromise = getDetails(id, kind);

	const trailerPromise = getTrailer(id, kind);

	const recommendationsPromise = getRecommendations(id, kind);

	const watchProvidersPromise = getWatchProviders(id, kind);

	const ratingsPromise = getRecentRecordsForItem({
		ref: 'tmdb:' + (kind === 'movie' ? 'm' : 's'),
		value: id.toString()
	});

	const castPromise = getCast(id, kind);

	const [result, trailer, recommendations, watchProviders, ratings, cast] = await Promise.all([
		resultPromise,
		trailerPromise,
		recommendationsPromise,
		watchProvidersPromise,
		ratingsPromise,
		castPromise
	]);

	if (!result || result.success === false) {
		return error(404, 'Not found');
	}

	return {
		item: {
			...result,
			title: result.title ?? result.name,
			ref: (kind === 'movie' ? 'tmdb:m-' : 'tmdb:s-') + id
		},
		trailer,
		recommendations,
		kind,
		watchProviders,
		ratings,
		cast
	};
}
