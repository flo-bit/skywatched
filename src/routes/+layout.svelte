<script lang="ts">
	import '../app.css';

	import Footer from '$lib/Components/Layout/Footer.svelte';
	import { Toaster } from 'svelte-sonner';
	import { settings, user, watchedItems } from '$lib/state/user.svelte';
	import RateMovieModal from '$lib/Components/Modals/RateMovieModal.svelte';

	import LoginModal from '$lib/Components/Modals/LoginModal.svelte';
	import Sidebar from '$lib/Components/Layout/Sidebar.svelte';
	import VideoPlayer from '$lib/Components/Utils/VideoPlayer.svelte';

	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { slide } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import CrosspostModal from '$lib/Components/Modals/CrosspostModal.svelte';

	let { children, data } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		// if user goes from and to the same page, don't animate
		if (navigation?.from?.url === navigation?.to?.url) {
			return;
		}

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	onMount(async () => {
		// check if user is logged in
		if (!data.user) return;

		settings.streamingRegion = data.settings?.streaming_region.code;
		settings.crosspostEnabled = data.settings?.crosspost_enabled;

		user.displayName = data.user.displayName;
		user.handle = data.user.handle;
		user.avatar = data.user.avatar;
		user.did = data.user.did;

		watchedItems.load();
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
				'bg-base-900/70 backdrop-blur-sm border border-base-800 rounded-md shadow-md p-4 flex items-center gap-2 fixed top-4 right-0 mx-2',
			title: 'text-white',
			description: 'text-white'
		}
	}}
	position="top-right"
/>

<RateMovieModal />

<LoginModal />

<VideoPlayer />

<CrosspostModal />

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
