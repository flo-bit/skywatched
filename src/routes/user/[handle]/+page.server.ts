import { getProfile, resolveHandle, getFollows } from '$lib/bluesky.js';
import { getRecentRecordOfUser, getAuthorDids } from '$lib/db';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const handle = event.params.handle;

	const did = await resolveHandle({ handle: handle });

	const profilePromise = getProfile({ did });
	const reviewsPromise = getRecentRecordOfUser({ did });

	const authorsPromise = getAuthorDids();

	const [profile, reviews, authors] = await Promise.all([
		profilePromise,
		reviewsPromise,
		authorsPromise
	]);

	if (event.locals.user) {
		const follows = await getFollows({ did: event.locals.user.did });

		return {
			isUser: event.locals.user?.did === did,
			username: event.params.handle,
			profile,
			items: reviews,
			follows: follows.follows.filter((profile) => authors.includes(profile.did)),
			following: follows.follows.some((profile) => profile.did == did),
			did
		};
	}

	return {
		isUser: false,
		profile,
		items: reviews,
		did
	};
}
