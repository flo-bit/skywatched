<script lang="ts">
	import { type PageData } from './$types';
	import { enhance } from '$app/forms';
	import { cn } from '$lib/utils';
	import { rateMovieModal, watchedItems } from '$lib/state.svelte';

	import Container from '$lib/Components/Container.svelte';
	import VideoPlayer from '$lib/Components/VideoPlayer.svelte';
	import ItemsList from '$lib/Components/ItemsList.svelte';
	import Rating from '$lib/Components/Rating.svelte';

	let { data }: { data: PageData } = $props();
</script>

<img
	src="https://image.tmdb.org/t/p/w780{data.result.backdrop_path}"
	alt=""
	class="fixed -z-20 h-full w-full object-cover object-center opacity-20"
/>
<div class="fixed inset-0 -z-10 h-full w-full bg-black/70"></div>

<Container>
	<div class="flex gap-4 pt-8">
		<img
			src="https://image.tmdb.org/t/p/w500{data.result.poster_path}"
			alt=""
			class="h-36 w-24 shrink-0 rounded-lg border border-white/10 sm:h-64 sm:w-44"
		/>
		<div class="flex flex-col gap-4">
			<div class="max-w-xl text-2xl font-semibold text-white sm:text-4xl">
				{data.result.original_title ?? data.result.original_name}
			</div>
			{#if data.user}
				<div class="flex gap-4">
					<button
						class={cn(
							'inline-flex items-center gap-2 rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-75 hover:bg-white/20 ',
							watchedItems.hasRated(data.result)
								? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
								: ''
						)}
						onclick={() => {
							rateMovieModal.selectedItem = {
								movieId: data.result.movieId,
								showId: data.result.showId,
								kind: data.result.movieId ? 'movie' : 'tv',
								name: data.result.original_title ?? data.result.original_name,
								currentRating: watchedItems.getRating(data.result) ?? 0,
								currentReview: ''
							};

							rateMovieModal.showModal = true;
						}}
					>
						{#if watchedItems.hasRated(data.result)}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2.5"
								stroke="currentColor"
								class="size-5"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
							rated
						{:else}
							rate
						{/if}
					</button>

					<Rating rating={watchedItems.getRating(data.result) ?? 0} />
				</div>
			{/if}

			{#if data.watchProviders.DE?.flatrate}
				<div class="mt-4 text-sm text-white">
					<div class="mb-2 flex flex-wrap gap-4 text-xs font-medium">
						stream on
						<span class="text-base-400"
							>(powered by <a
								href="https://www.justwatch.com"
								target="_blank"
								class="text-base-300 hover:text-accent-300">justwatch</a
							>)</span
						>
					</div>
					<a href={data.watchProviders.DE.link} target="_blank" class="flex flex-wrap gap-2">
						{#each data.watchProviders.DE.flatrate as provider}
							<img
								src="https://image.tmdb.org/t/p/w500{provider.logo_path}"
								alt={provider.provider_name}
								class="size-8 rounded-md border border-base-800 md:size-12"
							/>
						{/each}
					</a>
				</div>
			{/if}
		</div>
	</div>

	<div class="my-8 text-sm text-white">
		<div class="my-8 max-w-2xl text-sm text-white">
			<div class="mb-2 text-lg font-semibold">overview</div>
			{data.result.overview}
		</div>

		{#if data.trailer}
			<div class="mb-2 text-lg font-semibold">trailer</div>

			<VideoPlayer id={data.trailer} />
		{/if}

		{#if data.recommendations.length > 0}
			<div class="mb-2 mt-8 text-lg font-semibold">recommendations</div>

			<ItemsList items={data.recommendations} showMark={!!data.user} />
		{/if}
	</div></Container
>
