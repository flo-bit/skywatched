import { error, json, type RequestHandler } from '@sveltejs/kit';
import { AtpBaseClient } from '@atproto/api';
import { REL_COLLECTION } from '$lib';

export const DELETE: RequestHandler = async ({ request, locals, url }) => {
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

	await agent.com.atproto.repo.deleteRecord({ repo: did, collection: REL_COLLECTION, rkey });

	return json({ status: 'deleted', uri: `at://${did}/${REL_COLLECTION}/${rkey}` });
};
