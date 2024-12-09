<script lang="ts">
	import Logo from '$lib/Components/Logo.svelte';
	import { watchedItems } from '$lib/state.svelte';
	import '../app.css';
	let { children, data } = $props();

	watchedItems.watchedMovies = new Set(data.watchedMovies);
	watchedItems.watchedShows = new Set(data.watchedShows);
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
			<a
				href="/login"
				class="text-sm/6 font-semibold text-white transition-colors duration-75 hover:text-accent-400"
				>account <span aria-hidden="true">&rarr;</span></a
			>
		</div>
	</nav>
</header>

{@render children()}

<div
	style="background-image: url(/nnnoise.svg)"
	class="pointer-events-none fixed inset-0 z-50 size-full opacity-70"
></div>
