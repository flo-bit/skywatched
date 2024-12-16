import { getRecordByUri } from '$lib/db';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const uri = params.uri;

	const record = await getRecordByUri({ uri });

	if (!record) {
		throw error(404, 'Review not found');
	}

	return { record };
}
