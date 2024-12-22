import { getCombinedCredits, getPersonDetails } from '$lib/server/movies';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const id = parseInt(event.params.id.split('-')[0]);

	if (!id) {
		return error(404, 'Not found');
	}

	const combinedCredits = await getCombinedCredits(id);
	const personDetails = await getPersonDetails(id);

	const creditsSet = new Set<string>();

	combinedCredits.cast = combinedCredits.cast
		.filter((item: { id: string; poster_path: string }) => {
			if (creditsSet.has(item.id)) {
				return false;
			}
			creditsSet.add(item.id);
			return item.poster_path;
		})
		.sort((a: { order: number }, b: { order: number }) => b.order - a.order)
		.map((item: { id: string; media_type: string }) => {
			return {
				...item,
				movieId: item.media_type === 'movie' ? item.id : undefined,
				showId: item.media_type === 'tv' ? item.id : undefined
			};
		});

	return {
		combinedCredits: combinedCredits.cast,
		personDetails
	};
}
