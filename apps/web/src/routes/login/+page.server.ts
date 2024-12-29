import { redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/user/' + event.locals.user.handle);
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {}
};
