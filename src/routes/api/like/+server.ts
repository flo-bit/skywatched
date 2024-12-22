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

	const cid = body.cid;
	const uri = body.uri;

	const did = user.did;

	const rkey = TID.nextStr();

	const record: {
		repo: string;
		collection: string;
		rkey: string;
		record: {
			subject: { cid: string; uri: string };
			createdAt: string;
		};
	} = {
		repo: did,
		collection: 'community.lexicon.interaction.like',
		rkey,
		record: {
			subject: { cid, uri },
			createdAt: new Date().toISOString()
		}
	};
	await agent.com.atproto.repo.putRecord(record);

	return json({ status: 'liked' });
};
