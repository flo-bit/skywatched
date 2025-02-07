import { redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { register } from '$lib/Components/relative-time';

export const load: PageServerLoad = async (event) => {
	if (event.cookies.get('sid')) {
		const sid = event.cookies.get('sid');
		
		
	}
	return {};
};

