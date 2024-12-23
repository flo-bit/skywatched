import { error, redirect, type Actions } from '@sveltejs/kit';
import available_regions from './available_regions.json';
import { AtpBaseClient } from '@atproto/api';
/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	// check if search params has ?new
	const isNew = url.searchParams.has('new');

	return {
		isNew
	};
}
export const actions: Actions = {
	settings: async ({ request, locals }) => {
		const agent = locals.agent;
		if (!locals.user || !agent || agent instanceof AtpBaseClient) {
			return error(401, 'Unauthorized call');
		}

		const formData = await request.formData();
		const crosspost = (formData.get('crosspost-enabled') ?? 'false') as string;

		const region = formData.get('region') as string;
		const region_data = available_regions.find((r) => r.english_name === region);

		await agent.com.atproto.repo.putRecord({
			repo: locals.user.did,
			collection: 'app.skywatched.settings',
			rkey: 'self',
			record: {
				streaming_region: {
					code: region_data?.iso_3166_1,
					name: region_data?.english_name
				},
				crosspost_enabled: crosspost === 'true'
			}
		});

		return redirect(302, '/user/' + locals.user.handle);
	}
};
