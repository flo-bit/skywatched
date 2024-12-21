import { atclient } from '$lib/server/client';
import { Agent, AtpBaseClient } from '@atproto/api';

import { decryptToString } from '$lib/server/crypts';
import { decodeBase64, decodeBase64urlIgnorePadding } from '@oslojs/encoding';

import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
	const sid = event.cookies.get('sid');
	if (sid) {
		try {
			if (event.locals.user) {
				return resolve(event);
			}
			const decoded = decodeBase64urlIgnorePadding(sid);
			const key = decodeBase64(env.NYX_PASSWORD || '');
			const decrypted = await decryptToString(key, decoded);
			const oauthSession = await atclient.restore(decrypted);

			const agent = new Agent(oauthSession);
			event.locals.agent = agent;

			const user = await agent.getProfile({ actor: decrypted });
			event.locals.user = user.data;
		} catch (error) {
			console.error(error);
			event.cookies.delete('sid', { path: '/' });

			const agent = new AtpBaseClient({ service: 'https://api.bsky.app' });
			event.locals.agent = agent;
		}
	} else {
		if (event.locals.agent) {
			return resolve(event);
		}
		const agent = new AtpBaseClient({ service: 'https://api.bsky.app' });
		event.locals.agent = agent;
	}

	return resolve(event);
};
