import { error, json, type RequestHandler } from '@sveltejs/kit';
import { AtpBaseClient } from '@atproto/api';
import { REL_COLLECTION } from '$lib';

export const DELETE: RequestHandler = async ({ locals, url }) => {
	const user = locals.user;
	const agent = locals.agent;
	if (!user || !agent || agent instanceof AtpBaseClient) {
		return error(401, 'Unauthorized API call');
	}
	// const body = await request.json();
	// const uri = body.uri;
	// or get uri from params
	const uri = url.searchParams.get('uri') ?? '';

	const [did, collection, rkey] = uri.replace('at://', '').split('/');
	console.log(uri);

	console.log(did, user.did);
	if (did !== user.did) {
		return error(401, 'Unauthorized API call');
	}

	if (collection !== REL_COLLECTION) {
		return error(400, 'Invalid collection');
	}

	await agent.com.atproto.repo.deleteRecord({ repo: did, collection: collection, rkey });

	return json({ status: 'deleted', uri: `at://${did}/${REL_COLLECTION}/${rkey}` });
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	const user = locals.user;
	const agent = locals.agent;
	if (!user || !agent || agent instanceof AtpBaseClient) {
		return error(401, 'Unauthorized API call');
	}

	const body = await request.json();
	const uri = body.uri;

	const [did, collection, rkey] = uri.replace('at://', '').split('/');

	if (did !== user.did) {
		return error(401, 'Unauthorized API call');
	}

	if (collection !== REL_COLLECTION) {
		return error(400, 'Invalid collection');
	}

	const rating = body.rating;
	const review = body.review;
	const kind = body.media_type;
	const id = body.id;

	const record: {
		repo: string;
		collection: string;
		rkey: string;
		record: {
			item: {
				ref: string;
				value: string;
			};
			rating: { value: number; createdAt: string };
			note?: {
				value: string;
				createdAt: string;
				updatedAt: string;
			};
			from?: string;
		};
	} = {
		repo: did,
		collection: REL_COLLECTION,
		rkey,
		record: {
			item: {
				ref: `tmdb:${kind === 'movie' ? 'm' : 's'}`,
				value: id.toString()
			},
			rating: { value: rating * 2, createdAt: new Date().toISOString() },
			from: 'skywatched'
		}
	};
	if (review) {
		record.record.note = {
			value: review,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
	}

	await agent.com.atproto.repo.putRecord(record);

	return json({ status: 'ok' });
};
