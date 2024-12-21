<script lang="ts">
	import '../app.css';

	import Footer from '$lib/Components/Footer.svelte';
	import { toast, Toaster } from 'svelte-sonner';
	import { watchedItems } from '$lib/state.svelte';
	import RateMovieModal from '$lib/Components/RateMovieModal.svelte';

	import LoginModal from '$lib/Components/LoginModal.svelte';
	import Sidebar from '$lib/Components/Sidebar.svelte';
	import VideoPlayer from '$lib/Components/VideoPlayer.svelte';

	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { slide } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	let { children, data } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	function useCachedRatedItems() {
		try {
			// if no version number is set or it's not 1, clear the cache
			const version = localStorage.getItem('skywatched-version');
			if (!version || version !== '1') {
				localStorage.clear();
				return false;
			}

			const cachedRatedItems = localStorage.getItem(`ratedItems-${data.user.did}`);
			const lastUpdate = localStorage.getItem(`ratedItems-${data.user.did}-lastUpdate`);
			if (
				cachedRatedItems &&
				lastUpdate &&
				new Date(lastUpdate).getTime() + 10 * 60 * 1000 > Date.now()
			) {
				watchedItems.ratedMovies = new Map(
					JSON.parse(cachedRatedItems).movies.map((movie: any) => [movie.id, movie])
				);
				watchedItems.ratedShows = new Map(
					JSON.parse(cachedRatedItems).shows.map((show: any) => [show.id, show])
				);

				return true;
			}
		} catch (error) {
			console.error('Error fetching rated items', error);
		}

		return false;
	}

	async function fetchRatedItems() {
		try {
			// if not, fetch them
			const response = await fetch(`/api/getAllRated?did=${data.user.did}`);
			const items = await response.json();

			watchedItems.ratedMovies = new Map(items.movies.map((movie: any) => [movie.id, movie]));
			watchedItems.ratedShows = new Map(items.shows.map((show: any) => [show.id, show]));
			localStorage.setItem(`ratedItems-${data.user.did}`, JSON.stringify(items));
			localStorage.setItem(`ratedItems-${data.user.did}-lastUpdate`, new Date().toISOString());

			console.log('fetched rated items');

			return true;
		} catch (error) {
			console.error('Error fetching rated items', error);
			return false;
		}
	}

	onMount(async () => {
		// check if user is logged in
		if (!data.user) return;

		if (useCachedRatedItems()) {
			console.log('using cached rated items');
		} else {
			console.log('fetching rated items');
			if (!(await fetchRatedItems())) {
				console.error('Error fetching rated items');
				toast.error('Error getting your rated items');
			}
		}
	});
</script>

{#if $navigating}
	<div
		class="fixed left-0 right-0 top-0 z-50 h-0.5 bg-accent-500"
		in:slide={{ delay: 200, duration: 10000, axis: 'x', easing: expoOut }}
	></div>
{/if}

<div class="min-h-screen bg-base-950">
	{@render children()}
</div>

<Footer />

<Sidebar user={data.user} />

<Toaster
	toastOptions={{
		unstyled: true,
		classes: {
			toast:
				'bg-base-900/70 backdrop-blur-sm border border-base-800 rounded-md shadow-md p-4 flex items-center gap-2 fixed bottom-4 right-4',
			title: 'text-white',
			description: 'text-white'
		}
	}}
/>

<RateMovieModal />

<LoginModal />

<VideoPlayer />

<div
	style="background-image: url(/nnnoise.svg)"
	class="pointer-events-none fixed inset-0 z-50 size-full opacity-20"
></div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	:root::view-transition-old(root) {
		animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
	}

	:root::view-transition-new(root) {
		animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in;
	}
</style>
