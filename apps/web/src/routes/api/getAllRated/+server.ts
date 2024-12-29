import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getAllRated } from '$lib/bluesky';

export const GET: RequestHandler = async ({ locals, request }) => {
	const did = new URL(request.url).searchParams.get('did');
	const agent = locals.agent;

	if (!did) {
		return error(400, 'Did is required');
	}

	const items = await getAllRated({ did, agent });

	const transformedItems = items.map((item) => {
		return {
			id: parseInt(item.value.item.value ?? '0'),
			rating: item.value.rating.value / 2,
			ratingText: item.value.note?.value,
			updatedAt: item.value.note?.updatedAt ?? item.value.rating.createdAt,
			kind: item.value.item.ref === 'tmdb:m' ? 'movie' : 'tv'
		};
	});

	return json({
		movies: transformedItems.filter((item) => item.kind === 'movie'),
		shows: transformedItems.filter((item) => item.kind === 'tv')
	});
};
