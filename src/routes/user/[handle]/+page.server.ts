import { getProfile, resolveHandle } from '$lib/bluesky.js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const handle = event.params.handle;

	const did = await resolveHandle({ handle: handle });

	const profile = await getProfile({ did });

	const isUser = event.locals.user?.did === did;

	return { isUser, username: event.params.handle, profile };
}
