import { getProfile, resolveHandle,getFollows } from '$lib/bluesky.js';
import {getRecentRecords,getRecentRecordOfUser,getAuthorDids } from '$lib/db';
import { settings, user } from '$lib/state.svelte';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const feed = await getRecentRecords();
	const did = event.locals.user.did;
	var filt=feed;
	const followsPromise = getFollows({ did });
	const authors=await getAuthorDids();
	const [follows] = await Promise.all([followsPromise]);
	filt=feed.filter((review)=>(follows.follows.some((person)=>(person.did==review.author.did))));
	console.log(filt);
	
	const truefeed=filt;
	return { truefeed };
}
