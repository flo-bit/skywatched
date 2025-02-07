import type { Item, Ref } from '$lib/types';

const CACHE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes
const CACHE_VERSION = '2';

export const settings: {
	streamingRegion: string | undefined;
	crosspostEnabled: boolean | undefined;
} = $state({
	streamingRegion: undefined,
	crosspostEnabled: undefined
});

export const user: {
	displayName: string | undefined;
	handle: string | undefined;
	avatar: string | undefined;
	did: string | undefined;
} = $state({
	displayName: undefined,
	handle: undefined,
	avatar: undefined,
	did: undefined
});

export const watchedItems = $state({
	ratedItems: new Map<Item['ref'], { rating: number; ratingText?: string; updatedAt: string }>(),

	hasRated: (item: { ref: Ref }) => {
		return watchedItems.ratedItems.has(item.ref);
	},

	addRated: (item: Item & { rating: number; ratingText?: string }) => {
		watchedItems.ratedItems.set(item.ref, {
			rating: item.rating,
			ratingText: item.ratingText,
			updatedAt: new Date().toISOString()
		});

		watchedItems.saveToLocalStorage();
	},

	getRating: (item: { ref: Ref }) => {
		return watchedItems.ratedItems.get(item.ref);
	},

	load: async () => {
		if (!user.did) return;

		const version = localStorage.getItem('skywatched-version');
		if (!version || version !== CACHE_VERSION) {
			localStorage.clear();
			// set version
			localStorage.setItem('skywatched-version', CACHE_VERSION);
		}

		const cachedRatedItems = localStorage.getItem(`ratedItems-${user.did}`);
		const lastUpdate = localStorage.getItem(`ratedItems-${user.did}-lastUpdate`);
		if (
			cachedRatedItems &&
			lastUpdate &&
			new Date(lastUpdate).getTime() + CACHE_EXPIRATION_TIME > Date.now()
		) {
			watchedItems.ratedItems = new Map(JSON.parse(cachedRatedItems).value);
			console.log('using cached rated items, last update:', lastUpdate);
		} else {
			const response = await fetch(`/api/rated?did=${user.did}`);
			const items = await response.json();

			watchedItems.ratedItems = new Map(items);
			console.log('using api rated items');
			watchedItems.saveToLocalStorage();
		}
		console.log('rated items:', watchedItems.ratedItems);
	},

	saveToLocalStorage: () => {
		if (!user.did) return;

		localStorage.setItem(`ratedItems-${user.did}-lastUpdate`, new Date().toISOString());
		localStorage.setItem(
			`ratedItems-${user.did}`,
			JSON.stringify(watchedItems.ratedItems, replacer)
		);

		console.log('saved to local storage', watchedItems.ratedItems, new Date().toISOString());
	}
});

function replacer(key: string, value: unknown) {
	if (value instanceof Map) {
		return {
			dataType: 'Map',
			value: Array.from(value.entries())
		};
	} else {
		return value;
	}
}
