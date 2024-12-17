import { Agent } from '@atproto/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const agent = event.locals.agent;

	if (!agent || !(agent instanceof Agent)) return { user: event.locals.user, settings: undefined };

	try {
		const settings_record = await agent.com.atproto.repo.getRecord({
			repo: event.locals.user.did,
			collection: 'app.skywatched.settings',
			rkey: 'self'
		});

		const settings = settings_record.data.value as unknown as {
			streaming_region: {
				code: string;
				name: string;
			};
			crosspost_enabled: boolean;
		};
		return { user: event.locals.user, settings };
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_e) {
		return { user: event.locals.user, settings: undefined };
	}
};
