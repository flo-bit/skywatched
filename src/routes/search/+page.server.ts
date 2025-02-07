import { searchMulti } from '$lib/server/movies';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const query = event.url.searchParams.get('query');

	if (query) {
		const results = await searchMulti(query);

		return { results, query };
	}

	return { results: [], query };
}
