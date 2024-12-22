import { atclient } from '$lib/server/client';
import { isValidHandle } from '@atproto/syntax';
import { error, redirect, type Actions } from '@sveltejs/kit';

import { getRecentRecords, type MainRecord } from '$lib/db';

let feed: MainRecord[] = [];
let lastUpdated: Date | undefined = undefined;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const now = new Date();
	// if lastUpdated is more than 2 minutes ago, update the feed
	if (!lastUpdated || now.getTime() - lastUpdated.getTime() > 2 * 60 * 1000) {
		feed = await getRecentRecords();
		lastUpdated = now;
	}
	return { feed };
}

export const actions: Actions = {
	login: async ({ request }) => {
		const formData = await request.formData();
		let handle = formData.get('handle') as string;

		if (handle.startsWith('@')) {
			handle = handle.slice(1);
		}

		if (!isValidHandle(handle)) {
			error(400, { message: 'invalid handle' });
		}

		const url = await atclient.authorize(handle, { scope: 'atproto transition:generic' });
		if (!url) {
			error(500);
		}
		redirect(301, url.toString());
	},
	logout: async ({ cookies }) => {
		cookies.delete('sid', { path: '/' });
		redirect(301, '/');
	}
};
