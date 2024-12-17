import { searchMulti } from '$lib/server/movies';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
	const q = new URL(request.url).searchParams.get('q');

	if (!q) {
		return error(400, 'Query is required');
	}

	const results = await searchMulti(q);

	return json(results);
};
