import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getRecentRecordOfUser, type MainRecord } from '$lib/db';

export const GET: RequestHandler = async ({ request }) => {
	const did = new URL(request.url).searchParams.get('did');

	if (!did) {
		return error(400, 'Did is required');
	}

	const items: MainRecord[] = await getRecentRecordOfUser({ did });

	const transformedItems = items.map((item) => {
		return [
			item.record.item.ref + '-' + item.record.item.value,
			{
				id: parseInt(item.record.item.value ?? '0'),
				rating: (item.record.rating?.value ?? 0) / 2,
				ratingText: item.record.note?.value,
				updatedAt: item.record.note?.updatedAt ?? item.record.rating?.createdAt
			}
		];
	});

	return json(transformedItems);
};
