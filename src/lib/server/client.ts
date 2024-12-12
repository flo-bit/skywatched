import { NodeOAuthClient } from '@atproto/oauth-client-node';
import { db } from './db';
import { SessionStore, StateStore } from './storage';
import { dev } from '$app/environment';

const publicUrl = 'https://nyx-kappa.vercel.app';
const port = 5173;
const url = dev ? `http://[::1]:${port}` : publicUrl;
const enc = encodeURIComponent;

const encodeCallbackUrl = enc(`${url}/oauth/callback`);
const devClientId = `http://localhost?redirect_uri=${encodeCallbackUrl}&scope=${enc('atproto transition:generic')}`;
const clientId = !dev ? `${publicUrl}/client-metadata.json` : devClientId;

export const atclient = new NodeOAuthClient({
	stateStore: new StateStore(db),
	sessionStore: new SessionStore(db),
	clientMetadata: {
		client_name: 'nyx',
		client_id: clientId,
		client_uri: url,
		redirect_uris: [`${url}/oauth/callback`],
		scope: 'atproto transition:generic',
		grant_types: ['authorization_code', 'refresh_token'],
		application_type: 'web',
		token_endpoint_auth_method: 'none',
		dpop_bound_access_tokens: true
	}
});