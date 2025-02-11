import { Agent, AtpBaseClient } from '@atproto/api';

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
export async function getFollows({ did, agent = undefined }: { did: string; agent?: AgentType }) {
	if (!agent) {
		agent = new AtpBaseClient({ service: 'https://api.bsky.app' });
	}

	const { data } = await agent.app.bsky.graph.getFollows({ actor: did });
	return data;
}
