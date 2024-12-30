import { getRecentRecords } from '$lib/db';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const feed = await getRecentRecords();
	return { feed };
}
