import { REL_COLLECTION } from '$lib';
import { Agent, AtpBaseClient } from '@atproto/api';
import { getDetails } from './server/movies';

type AgentType = Agent | AtpBaseClient | null;

export async function resolveHandle({
	handle,
	agent = undefined
}: {
	handle: string;
	agent?: AgentType;
}) {
	if (!agent) {
		agent = new AtpBaseClient({ service: 'https://api.bsky.app' });
	}

	const data = await agent.com.atproto.identity.resolveHandle({ handle });
	return data.data.did;
}

export async function getProfile({ did, agent = undefined }: { did: string; agent?: AgentType }) {
	if (!agent) {
		agent = new AtpBaseClient({ service: 'https://api.bsky.app' });
	}

	const { data } = await agent.app.bsky.actor.getProfile({ actor: did });
	return data;
}
export async function getAllRated({ did, agent = undefined }: { did: string; agent?: AgentType }) {
	if (!agent) {
		agent = new AtpBaseClient({ service: 'https://bsky.social' });
	}

	let cursor: string | undefined = undefined;
	let items = [];
	do {
		const test = await agent.com.atproto.repo.listRecords({
			repo: did,
			collection: REL_COLLECTION,
			limit: 100,
			cursor
		});
		items = items.concat(test.data.records);
		cursor = test.data.cursor;
	} while (cursor);

	return items;
}

export async function getRatedItemsWithDetails({ did }: { did: string }) {
	const agent = new AtpBaseClient({ service: 'https://bsky.social' });

	const test = await agent.com.atproto.repo.listRecords({
		repo: did,
		collection: 'my.skylights.rel'
	});

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
						ratingText: record.value.note?.value,
						updatedAt: record.value.note?.updatedAt ?? record.value.rating.createdAt
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
					ratingText: record.value.note?.value,
					updatedAt: record.value.note?.updatedAt ?? record.value.rating.createdAt
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

	return items;
}
