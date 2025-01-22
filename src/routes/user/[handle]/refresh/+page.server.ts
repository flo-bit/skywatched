import { env } from '$env/dynamic/private';
import { resolveHandle } from '$lib/bluesky.js';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const handle = event.params.handle;

	const did = await resolveHandle({ handle: handle });

	const response = await fetch(`${env.BACKEND_URL}/api/refresh-user?did=${did}`);
	const data = await response.json();
	console.log(data);

	redirect(302, `/user/${handle}`);
}
