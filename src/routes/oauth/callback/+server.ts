import { atclient } from '$lib/server/client';
import { error, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '../../$types';
import { env } from '$env/dynamic/private';
import { encryptString } from '$lib/server/crypts';
import { decodeBase64, encodeBase64urlNoPadding } from '@oslojs/encoding';
import { Agent } from '@atproto/api';
import type { OAuthSession } from '@atproto/oauth-client-node';

export async function GET({ request, cookies }: RequestEvent) {
	const params = new URLSearchParams(request.url.split('?')[1]);

	let mySession: OAuthSession;
	try {
		const { session } = await atclient.callback(params);
		mySession = session;
		const key = decodeBase64(env.NYX_PASSWORD || '');
		const encrypted = await encryptString(key, session.did);
		const encoded = encodeBase64urlNoPadding(encrypted);
		cookies.set('sid', encoded, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			httpOnly: true,
			sameSite: 'lax'
		});
	} catch (err) {
		console.error(err);
		error(500, { message: (err as Error).message });
	}

	try {
		const agent = new Agent(mySession);

		await agent.com.atproto.repo.getRecord({
			repo: mySession.did,
			collection: 'app.skywatched.settings',
			rkey: 'self'
		});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_e) {
		redirect(301, '/settings?new');
	}

	redirect(301, '/');
}
