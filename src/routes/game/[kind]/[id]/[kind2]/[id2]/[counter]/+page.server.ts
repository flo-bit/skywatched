import { getRecentRecordsForItem } from '$lib/db.js';
import {
	getCast,
	getDetails,
	getRecommendations,
	getTrailer,
	getWatchProviders,
	getPersonDetails,
	getCombinedCredits
} from '$lib/server/movies';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const id = parseInt(event.params.id.split('-')[0]);
	const id2 = parseInt(event.params.id2.split('-')[0]);
	const kind = event.params.kind;
	const kind2= event.params.kind2;
	const ids=id;
	const ids2=id2;
	const couter=event.params.counter;
	if(kind==kind2&&id==id2){
		redirect(302,"/win/"+couter);
	}
	
	if (kind !== 'movie' && kind !== 'tv' && kind!=='cast') {
		return error(404, 'Not found');
	}
	if (kind2 !== 'movie' && kind2 !== 'tv' && kind2!=='cast') {
		return error(404, 'Not found');
	}

	if (!id) {
		return error(404, 'Not found');
	}
	if (!id2) {
		return error(404, 'Not found');
	}
	var temp;
	var temp2;
	var casting;
	var casting2;
	var person;
	var person2;
	var credits;
	var credits2;
	if(kind==="cast"){
		temp = getDetails(68730,"movie");
		casting=getCast(68730,"movie");
		person=getPersonDetails(id);
		person2=getPersonDetails(id2);
		credits=id;
		credits2=id2;
	}
	else{
		temp = getDetails(id, kind);
		casting=getCast(id,kind);
		person=getPersonDetails(37625);
		person2=getPersonDetails(37625);
		credits=37625;
		credits2=37625;

	}
	if(kind2==="cast"){
		temp2 = getDetails(68730,"movie");
		casting2=getCast(68730,"movie");
		person2=getPersonDetails(id2);
		credits2=id2;
	}
	else{
		temp2 = getDetails(id2, kind2);
		casting2=getCast(id2,kind2);
		person2=getPersonDetails(37625);
		credits2=37625;

	}
	const resultPromise = temp;
	const personPromise=person;
	const person2Promise=person2;
	//if(kind==="cast"){
	//	const resultPromise = getDetails(68730,"movie")
	//}
	//else{
	//	const resultPromise = getDetails(id, kind);
	//}
	const resultPromise2 = temp2;

	const castPromise = casting;
	const castPromise2 = casting2;
	const creditsPromise= credits;
	const creditsPromise2= credits2;
	const combinedCredits = await getCombinedCredits(credits);
	const creditsSet = new Set<string>();
	const combinedCredits2 = await getCombinedCredits(credits2);
	const creditsSet2 = new Set<string>();
	combinedCredits.cast = combinedCredits.cast
		.filter((item: { id: string; poster_path: string }) => {
			if (creditsSet.has(item.id)) {
				return false;
			}
			creditsSet.add(item.id);
			return item.poster_path;
		})
		.sort((a: { order: number }, b: { order: number }) => b.order - a.order)
		.map((item: { id: string; media_type: string }) => {
			return {
				...item,
				movieId: item.media_type === 'movie' ? item.id : undefined,
				showId: item.media_type === 'tv' ? item.id : undefined
			};
		});
	combinedCredits2.cast = combinedCredits2.cast
		.filter((item: { id: string; poster_path: string }) => {
			if (creditsSet2.has(item.id)) {
				return false;
			}
			creditsSet2.add(item.id);
			return item.poster_path;
		})
		.sort((a: { order: number }, b: { order: number }) => b.order - a.order)
		.map((item: { id: string; media_type: string }) => {
			return {
				...item,
				movieId: item.media_type === 'movie' ? item.id : undefined,
				showId: item.media_type === 'tv' ? item.id : undefined
			};
		});

	const [result,result2, cast,cast2,personDetails,person2Details,creditDetails,creditDetails2] = await Promise.all([
		resultPromise,
		resultPromise2,
		castPromise,
		castPromise2,
		personPromise,
		person2Promise,
		creditsPromise,
		creditsPromise2
	]);

	if (!result || result.success === false) {
		return error(404, 'Not found');
	}

	return {
		result: {
			...result,
			movieId: kind === 'movie' ? id : undefined,
			showId: kind === 'tv' ? id : undefined
		},
		result2: {
			...result2,
			movieId: kind2 === 'movie' ? id2 : undefined,
			showId: kind2 === 'tv' ? id2 : undefined
		},
		kind,
		kind2,
		cast,
		cast2,
		couter,
		personDetails,
		person2Details,
		creditDetails,
		creditDetails2,
		ids,
		ids2,
		combinedCredits: combinedCredits.cast,
		combinedCredits2: combinedCredits2.cast
	};
}
