import { getPopularMovies, getTrailer } from '$lib/server/movies';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const feed = await getPopularMovies();

	const trailerPromises = [];

	for (const movie of feed) {
		const trailer = getTrailer(movie.id, 'movie');
		trailerPromises.push(trailer);
	}

	const trailers = (await Promise.all(trailerPromises))
		.filter((trailer) => trailer !== null)
		.map((trailer, index) => ({
			id: feed[index].id,
			title: feed[index].title,
			trailer: trailer,
			poster_path: feed[index].poster_path,
			backdrop_path: feed[index].backdrop_path
		}));

	return { trailers };
}
