import { getProfile, resolveHandle } from '$lib/bluesky.js';
import { getRecentRecordOfUser } from '$lib/db';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const handle = event.params.handle;

	const did = await resolveHandle({ handle: handle });

	const profilePromise = getProfile({ did });
	const itemsPromise = getRecentRecordOfUser({ did });

	const [profile, items] = await Promise.all([profilePromise, itemsPromise]);

	return { isUser: event.locals.user?.did === did, username: event.params.handle, profile, items };
}
