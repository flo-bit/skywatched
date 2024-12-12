export const watchedItems = $state({
	ratedMovies: new Map<number, number>(),
	ratedShows: new Map<number, number>(),

	hasRated: (item: { movieId?: number; showId?: number }) => {
		const id = item.movieId ?? item.showId;
		if (!id) return false;
		return item.movieId ? watchedItems.ratedMovies.has(id) : watchedItems.ratedShows.has(id);
	},

	addRated: (item: { movieId?: number; showId?: number; rating: number }) => {
		const id = item.movieId ?? item.showId;
		if (!id) return;
		if (item.movieId) watchedItems.ratedMovies.set(id, item.rating);
		else watchedItems.ratedShows.set(id, item.rating);
	},

	getRating: (item: { movieId?: number; showId?: number }) => {
		const id = item.movieId ?? item.showId;
		if (!id) return 0;
		return item.movieId ? watchedItems.ratedMovies.get(id) : watchedItems.ratedShows.get(id);
	}
});

export const rateMovieModal: {
	showModal: boolean;

	selectedItem: {
		movieId: number | undefined;
		showId: number | undefined;
		kind: string | undefined;
		name: string | undefined;
		currentRating: number | undefined;
		currentReview: string | undefined;
	};
} = $state({
	showModal: false,

	selectedItem: {
		movieId: undefined,
		showId: undefined,
		kind: undefined,
		name: undefined,
		currentRating: undefined,
		currentReview: undefined
	}
});

let showLoginModelState = $state(false);

export function showLoginModel() {
	function toggle() {
		showLoginModelState = !showLoginModelState;
	}

	return {
		get value() {
			return showLoginModelState;
		},
		toggle
	};
}
