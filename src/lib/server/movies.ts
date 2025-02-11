import { env } from '$env/dynamic/private';
import type { Item } from '$lib/types';

export type Kind = 'movie' | 'tv';

export function ref(id: number, kind: Kind) {
	return `tmdb:${kind === 'movie' ? 'm' : 's'}-${id}`;
}

export async function searchMulti(query: string): Promise<Item[]> {
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

	return data.results
		.filter(
			(result: { poster_path: string; media_type: string }) =>
				result.poster_path !== null && result.media_type !== 'person'
		)
		.map((result: { id: number; media_type: string; title?: string; name?: string }) => {
			return {
				ref: ref(result.id, result.media_type as Kind),
				title: result.title ?? result.name,
				...result
			};
		}) as Item[];
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

	return {
		...data,
		ref: ref(data.id, kind)
	};
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
		(video: { site: string; type: string; official: boolean }) =>
			video.site === 'YouTube' && video.type === 'Trailer' && video.official
	);

	if (!trailer) {
		trailer = data.results?.find(
			(video: { site: string; type: string }) =>
				video.site === 'YouTube' && video.type === 'Trailer'
		);
	}

	return trailer?.key ?? null;
}

export async function getRecommendations(id: number, kind: Kind): Promise<Item[]> {
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

	return data.results.map((item: { id: number }) => ({
		...item,
		ref: ref(item.id, kind)
	})) as Item[];
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
export async function getPopularMovies() {
	const i=Math.floor(Math.random() * 6);
	const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=`+i;
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${env.TMDB_API_KEY}`
		}
	};

	const response = await fetch(url, options);
	const data = await response.json();
	//console.log(data.results[0]);

	return data;
}

