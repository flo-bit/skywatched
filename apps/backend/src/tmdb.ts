import { env } from "bun";

export type Kind = 'movie' | 'tv';

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

export async function getFormattedDetails(value: string, ref: 'tmdb:s' | 'tmdb:m') {
	const details = await getDetails(parseInt(value), ref === 'tmdb:s' ? 'tv' : 'movie') as {
		poster_path: string;
		title?: string;
		name?: string;
		release_date?: string;
		tagline: string;
		overview: string;
		genres: {
			id: number;
			name: string;
		}[];
		backdrop_path: string;
	};

	const title = details.title ?? details.name ?? '';
	const genres = details.genres?.map(genre => genre.name) ?? [];

	return {
		...details,
		title,
		genres,
	};
}