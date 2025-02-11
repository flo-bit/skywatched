export type Ref = `tmdb:m-${number}` | `tmdb:s-${number}`;

export type Item = {
	id: number;

	ref: Ref;

	title: string;
	poster_path: string;
	backdrop_path: string;

	overview: string;

	release_date: string;
	first_air_date: string;
	media_type: 'movie' | 'tv';

	genre_ids: number[];

	vote_average: number;
	vote_count: number;

	popularity: number;

	original_title: string;
	original_language: string;

	video: boolean;

	trailer_url?: string;

	rating?: number;
	ratingText?: string;
	updatedAt?: string;

	uri?: string;
};
