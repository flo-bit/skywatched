import { getDetails, getRecommendations, getTrailer } from '$lib/server/movies';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const id = parseInt(event.params.id);
	const kind = event.params.kind;

	if (kind !== 'movie' && kind !== 'tv') {
		return error(404, 'Not found');
	}

	if (id) {
		let result = await getDetails(id, kind);

		if (!result || result.success === false) {
			return error(404, 'Not found');
		}

		result = {
			...result,
			movieId: kind === 'movie' ? id : undefined,
			showId: kind === 'tv' ? id : undefined
		};

		const trailer = await getTrailer(id, kind);

		const recommendations = (await getRecommendations(id, kind)).map((item) => {
			if (kind === 'movie') {
				return { ...item, movieId: item.id };
			} else {
				return { ...item, showId: item.id };
			}
		});

		return { result, trailer, recommendations, kind };
	}

	// not found
	return error(404, 'Not found');
}
