import { env } from '$env/dynamic/private';
import { db } from './db';
import * as table from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export async function searchMovie(query: string) {
	const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${env.TMDB_API_KEY}`
		}
	};

	const response = await fetch(apiUrl, options);
	const data = await response.json();

	return data.results;
}

export async function getDetails(id: number) {
	const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${env.TMDB_API_KEY}`
		}
	};

	const response = await fetch(url, options);
	const data = await response.json();

	return data;
}

export async function getTrailer(id: number): Promise<string | null> {
	const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${env.TMDB_API_KEY}`
		}
	};

	const response = await fetch(url, options);
	const data = await response.json();

	let trailer = data.results?.find(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(video: any) => video.site === 'YouTube' && video.type === 'Trailer' && video.official
	);

	if (!trailer) {
		trailer = data.results?.find(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(video: any) => video.site === 'YouTube' && video.type === 'Trailer'
		);
	}

	return trailer?.key ?? null;
}

export async function getRecommendations(id: number) {
	const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US`;
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${env.TMDB_API_KEY}`
		}
	};

	const response = await fetch(url, options);
	const data = await response.json();

	return data.results;
}

export async function checkWatched(id: number, username: string): Promise<boolean | number> {
	const movie = await db
		.select()
		.from(table.movies)
		.where(and(eq(table.movies.movieId, id), eq(table.movies.username, username)));

	if (movie.length > 0) return movie[0].watched;

	return false;
}

export async function getWatchedMoviesIds(username: string) {
	const movies = await db
		.select({ movieId: table.movies.movieId })
		.from(table.movies)
		.where(and(eq(table.movies.username, username), eq(table.movies.watched, 1)));

	return new Set(movies.map((movie) => movie.movieId));
}
