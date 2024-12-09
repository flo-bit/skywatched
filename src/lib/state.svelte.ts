export const watchedItems = $state({
	watchedMovies: new Set<number>(),
	watchedShows: new Set<number>(),

	hasWatched: (item: { movieId?: number; showId?: number }) => {
		const id = item.movieId ?? item.showId;
		if (!id) return false;
		return item.movieId ? watchedItems.watchedMovies.has(id) : watchedItems.watchedShows.has(id);
	},

	addWatched: (item: { movieId?: number; showId?: number }) => {
		const id = item.movieId ?? item.showId;
		if (!id) return;
		if (item.movieId) watchedItems.watchedMovies.add(id);
		else watchedItems.watchedShows.add(id);
	},

	removeWatched: (item: { movieId?: number; showId?: number }) => {
		const id = item.movieId ?? item.showId;
		if (!id) return;
		if (item.movieId) watchedItems.watchedMovies.delete(id);
		else watchedItems.watchedShows.delete(id);
	}
});
