import { atclient } from '$lib/server/client';
import { isValidHandle } from '@atproto/syntax';
import { error, redirect, type Actions } from '@sveltejs/kit';

import { getRecentRecords } from '$lib/db';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return { feed: (await getRecentRecords()).slice(0, 10) };
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
