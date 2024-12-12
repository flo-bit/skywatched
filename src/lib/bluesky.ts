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
