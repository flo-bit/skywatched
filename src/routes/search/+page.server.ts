import { searchMovie } from '$lib/server/movies';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	// get search params
	const query = url.searchParams.get('query');

	if (query) {
		const results = await searchMovie(query);

		return { results, query };
	}

	return { results: [], query };
}
