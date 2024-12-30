<script lang="ts">
	import ItemsGrid from '$lib/Components/ItemsGrid.svelte';
	import Container from '$lib/Components/Container.svelte';
	import BaseHeadTags from '$lib/Components/BaseHeadTags.svelte';

	import { type PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>search | skywatched</title>
</svelte:head>

<BaseHeadTags />

<Container>
	<div class="px-4 py-16">
		<h1 class="pb-8 text-4xl font-bold tracking-tight text-base-50">search for a movie or show</h1>

		<form class="relative mt-6 flex items-center" method="GET">
			<input
				value={data.query}
				type="text"
				name="query"
				id="query"
				class="block w-full rounded-xl border-0 bg-base-900 py-1.5 pr-14 text-base-50 shadow-sm ring-1 ring-inset ring-base-700 placeholder:text-base-400 focus:ring-2 focus:ring-inset focus:ring-accent-600 sm:text-sm/6"
			/>
			<button
				onsubmit={(event) => {
					if (data.query.length === 0) {
						event.preventDefault();
						return;
					}
				}}
				type="submit"
				class="absolute inset-y-0 right-0 flex py-2 px-2 text-accent-500 hover:text-accent-400 bg-accent-950/50 hover:bg-accent-950/70 border border-accent-800 rounded-r-xl"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-5"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>

				<span class="sr-only">search</span>
			</button>
		</form>

		{#if data.results.length > 0}
			<h2 class="mt-8 text-2xl font-bold tracking-tight text-base-50">results</h2>

			<ItemsGrid items={data.results} showMark={!!data.user} />
		{:else if data.query}
			<p class="text-md mt-8 text-base-50">no results found</p>
		{/if}
	</div>
</Container>
