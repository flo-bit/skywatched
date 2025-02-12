import { error, json, type RequestHandler } from '@sveltejs/kit';
import { AtpBaseClient } from '@atproto/api';
import { TID } from '@atproto/common';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	const agent = locals.agent;
	if (!user || !agent || agent instanceof AtpBaseClient) {
		return error(401, 'Unauthorized API call');
	}
	const body = await request.json();

	const did = body.did;

	const did2 = user.did;

	const rkey = TID.nextStr();

	const record: {
		repo: string;
		collection: string;
		rkey: string;
		record: {
			subject: string;
			createdAt: string;
		};
	} = {
		repo: did2,
		collection: 'app.bsky.graph.follow',
		rkey,
		record: {
			subject: did,
			createdAt: new Date().toISOString()
		}
	};
	await agent.com.atproto.repo.createRecord(record);

	return json({ status: 'liked' });
};
