import type { Item } from '$lib/types';

export const showLoginModal = $state({
	value: false,
	toggle: () => {
		showLoginModal.value = !showLoginModal.value;
	}
});

export const showSidebar = $state({
	value: false,
	toggle: () => {
		showSidebar.value = !showSidebar.value;
	}
});

type RateMovieModalItem = Item & {
	currentRating: number | undefined;
	currentReview: string | undefined;

	editUri?: string;
};

export const rateMovieModal: {
	showModal: boolean;

	selectedItem?: RateMovieModalItem;

	show: (item: RateMovieModalItem) => void;
	hide: () => void;
	showEmpty: () => void;
} = $state({
	showModal: false,

	selectedItem: undefined,

	show: (item: RateMovieModalItem) => {
		rateMovieModal.selectedItem = item;
		rateMovieModal.showModal = true;
	},

	hide: () => {
		rateMovieModal.showModal = false;
	},

	showEmpty: () => {
		rateMovieModal.selectedItem = undefined;
		rateMovieModal.showModal = true;
	}
});

export const crosspostModal: {
	showModal: boolean;
	uri: string | undefined;
	review: string | undefined;
	rating: number | undefined;
	title: string | undefined;
	backdrop: string | undefined;
	poster: string | undefined;

	show: (
		uri: string,
		review: string,
		rating: number,
		title: string,
		backdrop: string,
		poster: string
	) => void;
	hide: () => void;
} = $state({
	showModal: false,
	uri: undefined,
	review: undefined,
	rating: undefined,
	title: undefined,
	backdrop: undefined,
	poster: undefined,

	show: (
		uri: string,
		review: string,
		rating: number,
		title: string,
		backdrop: string,
		poster: string
	) => {
		crosspostModal.uri = uri;
		crosspostModal.review = review;
		crosspostModal.rating = rating;
		crosspostModal.title = title;
		crosspostModal.backdrop = backdrop;
		crosspostModal.poster = poster;
		crosspostModal.showModal = true;
	},

	hide: () => {
		crosspostModal.showModal = false;
		crosspostModal.uri = undefined;
		crosspostModal.review = undefined;
		crosspostModal.rating = undefined;
		crosspostModal.title = undefined;
	}
});
