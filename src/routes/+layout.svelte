<script lang="ts">
	import Footer from '$lib/Components/Footer.svelte';
	import Logo from '$lib/Components/Logo.svelte';
	import { Toaster } from 'svelte-sonner';
	import { watchedItems } from '$lib/state.svelte';
	import '../app.css';
	import RateMovieModal from '$lib/Components/RateMovieModal.svelte';

	let { children, data } = $props();

	import { showLoginModel } from '$lib/state.svelte';
	import LoginModal from '$lib/Components/LoginModal.svelte';
	let loginModal = showLoginModel();

	watchedItems.ratedMovies = new Map(data.watchedMovies);
	watchedItems.ratedShows = new Map(data.watchedShows);
</script>

<header class="absolute inset-x-0 top-0 z-50">
	<nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
		<div class="flex lg:flex-1">
			<a href="/" class="-m-1.5 p-1.5">
				<span class="sr-only">nyx</span>

				<Logo class="size-8" />
			</a>
		</div>
		<div class="flex flex-1 justify-end gap-4">
			{#if data.user}
				<a
					href="/search"
					class="text-sm/6 font-semibold text-white transition-colors duration-75 hover:text-accent-400"
				>
					<span class="sr-only">add movie</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
				</a>
			{/if}
			{#if !data.user}
				<button
					onclick={() => loginModal.toggle()}
					class="text-sm/6 font-semibold text-white transition-colors duration-75 hover:text-accent-400"
				>
					login
				</button>
			{:else}
				<a
					href="/user/{data.user.handle}"
					class="text-sm/6 font-semibold text-white transition-colors duration-75 hover:text-accent-400"
				>
					account <span aria-hidden="true">&rarr;</span>
				</a>
			{/if}
		</div>
	</nav>
</header>

<div class="min-h-screen">
	{@render children()}
</div>
<Footer />

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

<div
	style="background-image: url(/nnnoise.svg)"
	class="pointer-events-none fixed inset-0 z-50 size-full opacity-70"
></div>
