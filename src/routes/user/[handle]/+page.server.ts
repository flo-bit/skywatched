import { getProfile, resolveHandle,getFollows } from '$lib/bluesky.js';
import { getRecentRecordOfUser,getAuthorDids } from '$lib/db';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const handle = event.params.handle;

	const did = await resolveHandle({ handle: handle });

	const profilePromise = getProfile({ did });
	const itemsPromise = getRecentRecordOfUser({ did });
	const followsPromise = getFollows({ did });
	const authors=await getAuthorDids();
	const [profile, items,follows] = await Promise.all([profilePromise, itemsPromise,followsPromise]);
	var i=follows.follows.length-1;
	while(i>=0){
		if(authors.includes(follows.follows[i].did)){
		}
		else{
			follows.follows.splice(i,1);
		}
		i--;
		
	}

	return { isUser: event.locals.user?.did === did, username: event.params.handle, profile, items,follows };
}
