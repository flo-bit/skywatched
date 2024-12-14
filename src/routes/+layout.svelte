<script lang="ts">
	import Footer from '$lib/Components/Footer.svelte';
	import Logo from '$lib/Components/Logo.svelte';
	import { Toaster } from 'svelte-sonner';
	import { showLoginModal, watchedItems } from '$lib/state.svelte';
	import '../app.css';
	import RateMovieModal from '$lib/Components/RateMovieModal.svelte';

	let { children, data } = $props();

	import LoginModal from '$lib/Components/LoginModal.svelte';
	import Sidebar from '$lib/Components/Sidebar.svelte';
	import VideoPlayer from '$lib/Components/VideoPlayer.svelte';


	console.log(data.watchedMovies);
	console.log(data.watchedShows);
	
	watchedItems.ratedMovies = new Map(data.watchedMovies);
	watchedItems.ratedShows = new Map(data.watchedShows);

	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

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
	class="pointer-events-none fixed inset-0 z-50 size-full opacity-70"
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

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	:root::view-transition-old(root) {
		animation:
			90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation:
			210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
