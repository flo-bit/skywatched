import { searchMulti,getPopularMovies } from '$lib/server/movies';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const query = event.url.searchParams.get('query');
	const query2=event.url.searchParams.get('query2');

	if (query) {
		const results = (await searchMulti(query))
			.map((result) => {
				if (result.media_type === 'movie') {
					return { ...result, movieId: result.id };
				} else if (result.media_type === 'tv') {
					return { ...result, showId: result.id };
				}
				return null;
			})
			.filter((result) => result !== null && result.poster_path !== null);
		const results2 = (await searchMulti(query2))
			.map((result2) => {
				if (result2.media_type === 'movie') {
					return { ...result2, movieId: result2.id };
				} else if (result2.media_type === 'tv') {
					return { ...result2, showId: result2.id };
				}
				return null;
			})
			.filter((result2) => result2 !== null && result2.poster_path !== null);
		return { results,results2, query,query2 };
	}

	return { results: [],results2: [],  query,query2 };
}
export const actions: Actions = {
	randomize: async (event) => {
		const randmovies=await getPopularMovies();
		const i=Math.floor(Math.random() * randmovies.results.length);
		const j=Math.floor(Math.random() * randmovies.results.length);
		//console.log(randmovies.results.length);
		return redirect(302, '/game/movie/'+randmovies.results[i]?.id+"-/movie/"+randmovies.results[j]?.id+"-/0");}	
};