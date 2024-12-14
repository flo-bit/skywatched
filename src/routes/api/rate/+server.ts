import { db } from '$lib/server/db';
import { checkWatched, getDetails } from '$lib/server/movies';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { AtpBaseClient } from '@atproto/api';
import { REL_COLLECTION } from '$lib';
import { TID } from '@atproto/common';

// Given a cursor and limit (opt)
// Return a JSON of FeedViewPost
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

	await agent.com.atproto.repo.putRecord({
		repo: did,
		collection: REL_COLLECTION,
		rkey,
		record: {
			item: {
				ref: `tmdb:${kind === 'movie' ? 'm' : 's'}`,
				value: id.toString()
			},
			rating: { value: rating * 2, createdAt: new Date().toISOString() },
			note: {
				value: review,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
		}
	});

	return json({ status: 'rated' });
};
