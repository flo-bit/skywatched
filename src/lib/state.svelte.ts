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
		currentReview: undefined
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
			currentReview: undefined
		};
		rateMovieModal.showModal = true;
	}
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
