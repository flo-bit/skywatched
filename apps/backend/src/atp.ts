import { AtpBaseClient } from "@atproto/api";

export async function getProfile({ did, agent }: { did: string, agent?: AtpBaseClient }) {
	if (!agent) {
		agent = new AtpBaseClient({ service: 'https://api.bsky.app' });
	}

	const { data } = await agent.app.bsky.actor.getProfile({ actor: did });
	return data;
}

export async function getAllRated({ did, agent }: { did: string, agent?: AtpBaseClient }) {
	if (!agent) {
		agent = new AtpBaseClient({ service: 'https://bsky.social' });
	}

	let cursor: string | undefined = undefined;
	let items: any[] = [];
	do {
		const item = await agent.com.atproto.repo.listRecords({
			repo: did,
			collection: "my.skylights.rel",
			limit: 100,
			cursor
		});
		items = items.concat(item.data.records);
		cursor = item.data.cursor;
	} while (cursor && items.length < 10000);

	return items;
}

