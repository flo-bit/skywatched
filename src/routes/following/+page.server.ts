import { getFollows } from '$lib/bluesky.js';
import { getRecentRecords } from '$lib/db';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const feed = await getRecentRecords();
	const did = event.locals.user.did;
	const follows = await getFollows({ did });
	const filt = feed.filter((review) =>
		follows.follows.some((person) => person.did == review.author.did)
	);

	return { truefeed: filt };
}
