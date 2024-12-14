import { getProfile, resolveHandle } from '$lib/bluesky.js';
import { getDetails } from '$lib/server/movies.js';
import { AtpBaseClient } from '@atproto/api';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const handle = event.params.handle;

	const did = await resolveHandle({ handle: handle });

	const profile = await getProfile({ did });

	const agent = new AtpBaseClient({ service: 'https://bsky.social' });
	const test = await agent.com.atproto.repo.listRecords({
		repo: did,
		collection: 'my.skylights.rel'
	});

	let isUser = false;
	if (event.locals.user?.did === did) {
		isUser = true;
	}

	const items = [];
	const promises = [];
	let count = 0;
	for (const record of test.data.records) {
		if (record.value.item.ref === 'tmdb:m') {
			const detailsPromise = getDetails(parseInt(record.value.item.value), 'movie').then(
				(details) =>
					items.push({
						movieId: parseInt(record.value.item.value),
						...details,
						rating: record.value.rating.value / 2,
						ratingText: record.value.note?.value
					})
			);
			promises.push(detailsPromise);
			count++;
		} else if (record.value.item.ref === 'tmdb:s') {
			const detailsPromise = getDetails(parseInt(record.value.item.value), 'tv').then((details) =>
				items.push({
					showId: parseInt(record.value.item.value),
					...details,
					rating: record.value.rating.value / 2,
					ratingText: record.value.note?.value
				})
			);
			promises.push(detailsPromise);
			count++;
		}

		if (count > 10) {
			break;
		}
	}
	await Promise.all(promises);

	return { items, isUser, username: event.params.handle, profile };
}
