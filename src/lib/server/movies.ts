import { env } from '$env/dynamic/private';
import { db } from './db';
import * as table from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { Agent } from '@atproto/api';

export type Kind = 'movie' | 'tv';

export async function searchMulti(query: string) {
	const apiUrl = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`;
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

export async function getDetails(id: number, kind: Kind) {
	const url = `https://api.themoviedb.org/3/${kind}/${id}?language=en-US`;
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

export async function getTrailer(id: number, kind: Kind): Promise<string | null> {
	const url = `https://api.themoviedb.org/3/${kind}/${id}/videos?language=en-US`;
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

export async function getRecommendations(id: number, kind: Kind) {
	const url = `https://api.themoviedb.org/3/${kind}/${id}/recommendations?language=en-US`;
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

export async function getWatchProviders(id: number, kind: Kind) {
	const url = `https://api.themoviedb.org/3/${kind}/${id}/watch/providers?language=en-US`;
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

export async function checkWatched(id: number, did: string, kind: Kind): Promise<boolean | number> {
	const movie = await db
		.select()
		.from(table.items)
		.where(
			and(
				eq(kind === 'movie' ? table.items.movieId : table.items.showId, id),
				eq(table.items.did, did)
			)
		);

	if (movie.length > 0) return movie[0].watched;

	return false;
}

export async function getWatchedMoviesIds(did: string) {
	const movies = await db
		.select({
			movieId: table.items.movieId,
			rating: table.items.rating,
			ratingText: table.items.ratingText
		})
		.from(table.items)
		.where(and(eq(table.items.did, did), eq(table.items.watched, 1)));

	return new Map(movies.map((movie) => [movie.movieId ?? 0, movie.rating ?? 0]));
}

export async function getWatchedShowsIds(did: string) {
	const shows = await db
		.select({
			showId: table.items.showId,
			rating: table.items.rating,
			ratingText: table.items.ratingText
		})
		.from(table.items)
		.where(and(eq(table.items.did, did), eq(table.items.watched, 1)));

	return new Map(shows.map((show) => [show.showId ?? 0, show.rating ?? 0]));
}

export async function getWatchedMoviesIdsFromPDS(agent: Agent, did: string) {
	const allRecords = await agent.com.atproto.repo.listRecords({
		repo: did,
		collection: 'my.skylights.rel'
	});

	const movies = allRecords.data.records.filter((record) => record.value.item.ref === 'tmdb:m');

	return new Map(
		movies.map((movie) => [
			parseInt(movie.value.item.value ?? '0'),
			{
				rating: movie.value.rating.value / 2,
				ratingText: movie.value.note?.value,
				updatedAt: movie.value.note?.updatedAt ?? movie.value.rating.createdAt
			}
		])
	);
}

export async function getWatchedShowsIdsFromPDS(agent: Agent, did: string) {
	const allRecords = await agent.com.atproto.repo.listRecords({
		repo: did,
		collection: 'my.skylights.rel'
	});

	const shows = allRecords.data.records.filter((record) => record.value.item.ref === 'tmdb:s');

	return new Map(
		shows.map((show) => [
			parseInt(show.value.item.value ?? '0'),
			{
				rating: show.value.rating.value / 2,
				ratingText: show.value.note?.value,
				updatedAt: show.value.note?.updatedAt ?? show.value.rating.createdAt
			}
		])
	);
}

export async function getCast(id: number, kind: Kind) {
	const url = `https://api.themoviedb.org/3/${kind}/${id}/credits?language=en-US`;
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${env.TMDB_API_KEY}`
		}
	};

	const response = await fetch(url, options);
	const data = await response.json();

	return data.cast;
}

export async function getPersonDetails(personId: number) {
	const url = `https://api.themoviedb.org/3/person/${personId}?language=en-US`;
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

export async function getCombinedCredits(personId: number) {
	const url = `https://api.themoviedb.org/3/person/${personId}/combined_credits?language=en-US`;
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
