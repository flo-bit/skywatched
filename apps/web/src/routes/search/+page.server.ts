import { searchMulti } from '$lib/server/movies';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const query = event.url.searchParams.get('query');

	if (query) {
		const results = (await searchMulti(query))
			.map((result) => {
				if (result.media_type === 'movie') {
					return { ...result, movieId: result.id };
				} else if (result.media_type === 'tv') {
					return { ...result, showId: result.id };
				}
				return null;
			})
			.filter((result) => result !== null && result.poster_path !== null);

		return { results, query };
	}

	return { results: [], query };
}
