export const watchedItems = $state({
	ratedMovies: new Map<number, { rating: number; ratingText?: string; updatedAt: string }>(),
	ratedShows: new Map<number, { rating: number; ratingText?: string; updatedAt: string }>(),

	hasRated: (item: { movieId?: number; showId?: number }) => {
		const id = item.movieId ?? item.showId;
		if (!id) return false;
		return item.movieId ? watchedItems.ratedMovies.has(id) : watchedItems.ratedShows.has(id);
	},

	addRated: (item: { movieId?: number; showId?: number; rating: number; ratingText?: string }) => {
		const id = item.movieId ?? item.showId;
		if (!id) return;
		if (item.movieId)
			watchedItems.ratedMovies.set(id, {
				rating: item.rating,
				ratingText: item.ratingText,
				updatedAt: new Date().toISOString()
			});
		else
			watchedItems.ratedShows.set(id, {
				rating: item.rating,
				ratingText: item.ratingText,
				updatedAt: new Date().toISOString()
			});
	},

	getRating: (item: { movieId?: number; showId?: number }) => {
		const id = item.movieId ?? item.showId;
		if (!id) return undefined;
		return item.movieId ? watchedItems.ratedMovies.get(id) : watchedItems.ratedShows.get(id);
	}
});

type RateMovieModalItem = {
	movieId: number | undefined;
	showId: number | undefined;
	kind: string | undefined;
	name: string | undefined;
	posterPath: string | undefined;
	currentRating: number | undefined;
	currentReview: string | undefined;

	editUri?: string;
};

export const rateMovieModal: {
	showModal: boolean;

	selectedItem: RateMovieModalItem;

	show: (item: RateMovieModalItem) => void;
	hide: () => void;
	showEmpty: () => void;
} = $state({
	showModal: false,

	selectedItem: {
		movieId: undefined,
		showId: undefined,
		kind: undefined,
		name: undefined,
		posterPath: undefined,
		currentRating: undefined,
		currentReview: undefined,

		editUri: undefined
	},

	show: (item: RateMovieModalItem) => {
		rateMovieModal.selectedItem = item;
		rateMovieModal.showModal = true;
	},

	hide: () => {
		rateMovieModal.showModal = false;
	},

	showEmpty: () => {
		rateMovieModal.selectedItem = {
			movieId: undefined,
			showId: undefined,
			kind: undefined,
			name: undefined,
			posterPath: undefined,
			currentRating: undefined,
			currentReview: undefined,

			editUri: undefined
		};
		rateMovieModal.showModal = true;
	}
});

export const crosspostModal: {
	showModal: boolean;
	uri: string | undefined;
	review: string | undefined;
	rating: number | undefined;
	title: string | undefined;

	show: (uri: string, review: string, rating: number, title: string) => void;
	hide: () => void;
} = $state({
	showModal: false,
	uri: undefined,
	review: undefined,
	rating: undefined,
	title: undefined,

	show: (uri: string, review: string, rating: number, title: string) => {
		crosspostModal.uri = uri;
		crosspostModal.review = review;
		crosspostModal.rating = rating;
		crosspostModal.title = title;
		crosspostModal.showModal = true;
	},

	hide: () => {
		crosspostModal.showModal = false;
		crosspostModal.uri = undefined;
		crosspostModal.review = undefined;
		crosspostModal.rating = undefined;
		crosspostModal.title = undefined;
	}
});

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
} = $state({
	displayName: undefined,
	handle: undefined,
	avatar: undefined
});

export const showLoginModal = $state({
	value: false,
	toggle: () => {
		showLoginModal.value = !showLoginModal.value;
	}
});

export const showSidebar = $state({
	value: false,
	toggle: () => {
		showSidebar.value = !showSidebar.value;
	}
});

export const videoPlayer: {
	showing: boolean;
	id: string | undefined;

	show: (id: string) => void;
	hide: () => void;
} = $state({
	showing: false,
	id: undefined,

	show: (id: string) => {
		videoPlayer.id = id;
		videoPlayer.showing = true;
	},

	hide: () => {
		videoPlayer.id = undefined;
		videoPlayer.showing = false;
	}
});
