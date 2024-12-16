import { getRecentRecordsForItem } from '$lib/db.js';
import { getDetails, getRecommendations, getTrailer, getWatchProviders } from '$lib/server/movies';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const id = parseInt(event.params.id);
	const kind = event.params.kind;

	if (kind !== 'movie' && kind !== 'tv') {
		return error(404, 'Not found');
	}

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

	const [result, trailer, recommendations, watchProviders, ratings] = await Promise.all([
		resultPromise,
		trailerPromise,
		recommendationsPromise,
		watchProvidersPromise,
		ratingsPromise
	]);

	if (!result || result.success === false) {
		return error(404, 'Not found');
	}

	return {
		result: {
			...result,
			movieId: kind === 'movie' ? id : undefined,
			showId: kind === 'tv' ? id : undefined
		},
		trailer,
		// @ts-expect-error - TODO: fix this
		recommendations: recommendations.map((item) => {
			if (kind === 'movie') {
				return { ...item, movieId: item.id };
			} else {
				return { ...item, showId: item.id };
			}
		}),
		kind,
		watchProviders,
		ratings
	};
}
