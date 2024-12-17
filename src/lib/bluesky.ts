import { REL_COLLECTION } from '$lib';
import { Agent, AtpBaseClient } from '@atproto/api';
import type { Record } from '@atproto/api/src/client/types/com/atproto/repo/listRecords';

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
	let items: Record[] = [];
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
