import type { Agent, AtpBaseClient } from '@atproto/api';
import type { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			agent: Agent | AtpBaseClient | undefined;
			user: ProfileViewDetailed;
		}
	}
}

export {};
