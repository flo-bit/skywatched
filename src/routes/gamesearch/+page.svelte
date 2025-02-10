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
	<div class="flex-column px-4 py-16">
		<h1 class="pb-8 text-4xl font-bold tracking-tight text-base-50">search for a movie or show</h1>
		<div class="mt-10 w-full sm:mx-auto sm:max-w-sm">
			<form class="space-y-6" action="?/randomize" method="POST">
	
				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-xl bg-accent-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
						>randomize</button
					>
				</div>
			</form>
		</div>

		<form class="relative mt-6 flex items-center" method="GET">
			<input
				value={data.query}
				type="text"
				name="query"
				id="query"
				class="block w-full rounded-md border-0 bg-base-900 py-1.5 pr-14 text-base-50 shadow-sm ring-1 ring-inset ring-base-700 placeholder:text-base-400 focus:ring-2 focus:ring-inset focus:ring-accent-600 sm:text-sm/6"
			/>
			<input
				value={data.query2}
				type="text"
				name="query2"
				id="query2"
				class="block w-full rounded-md border-0 bg-base-900 py-1.5 pr-14 text-base-50 shadow-sm ring-1 ring-inset ring-base-700 placeholder:text-base-400 focus:ring-2 focus:ring-inset focus:ring-accent-600 sm:text-sm/6"
			/>
			<button
				onsubmit={(event) => {
					if (data.query.length === 0) {
						event.preventDefault();
						return;
					}
				}}
				type="submit"
				class="absolute inset-y-0 right-0 flex py-2 pr-2 text-accent-500 hover:text-accent-400"
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
			<div class="flex-row">
					<div class="flex-col"> 
				<h2 class="mt-8 text-2xl font-bold tracking-tight text-base-50">results</h2>
				

				<ItemsGrid items={data.results} showMark={!!data.user} />
				</div>
				<div class="flex-col"> 
				<h2 class="mt-8 text-2xl font-bold tracking-tight text-base-50">results</h2>

				<ItemsGrid items={data.results2} showMark={!!data.user} />
				</div>
			</div>
		{:else if data.query}
			<p class="text-md mt-8 text-base-50">no results found</p>
		{/if}

	</div>
</Container>
