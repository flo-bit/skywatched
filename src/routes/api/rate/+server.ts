import { error, json, type RequestHandler } from '@sveltejs/kit';
import { AtpBaseClient } from '@atproto/api';
import { REL_COLLECTION } from '$lib';
import { TID } from '@atproto/common';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	const agent = locals.agent;
	if (!user || !agent || agent instanceof AtpBaseClient) {
		return error(401, 'Unauthorized API call');
	}
	const body = await request.json();
	const rating = body.rating;
	const review = body.review;
	const kind = body.kind;
	const id = body.id;
	const did = user.did;

	const rkey = TID.nextStr();

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
			rating: { value: rating * 2, createdAt: new Date().toISOString() }
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

	return json({ status: 'rated' });
};
