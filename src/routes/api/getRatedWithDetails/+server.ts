import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getRatedItemsWithDetails } from '$lib/bluesky';

export const GET: RequestHandler = async ({ request }) => {
	const did = new URL(request.url).searchParams.get('did');

	if (!did) {
		return error(400, 'Did is required');
	}

	const items = await getRatedItemsWithDetails({ did });

	return json({ items });
};
