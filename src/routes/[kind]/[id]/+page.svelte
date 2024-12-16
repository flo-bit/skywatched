<script lang="ts">
	import { type PageData } from './$types';
	import { cn } from '$lib/utils';
	import { rateMovieModal, videoPlayer, watchedItems } from '$lib/state.svelte';

	import Container from '$lib/Components/Container.svelte';
	import ItemsList from '$lib/Components/ItemsList.svelte';
	import Rating from '$lib/Components/Rating.svelte';
	import ReviewCard from '$lib/Components/ReviewCard.svelte';
	import ReviewList from '$lib/Components/ReviewList.svelte';

	let { data }: { data: PageData } = $props();
</script>

<img
	src="https://image.tmdb.org/t/p/w780{data.result.backdrop_path}"
	alt=""
	class="fixed h-full w-full object-cover object-center opacity-20"
/>
<div class="fixed inset-0 h-full w-full bg-black/50"></div>

<Container class="relative z-10">
	<div class="flex gap-4 px-4 pt-8">
		<img
			src="https://image.tmdb.org/t/p/w500{data.result.poster_path}"
			alt=""
			class="h-36 w-24 shrink-0 rounded-lg border border-white/10 sm:h-64 sm:w-44"
		/>
		<div class="flex flex-col gap-4">
			<div class="max-w-xl text-2xl font-semibold text-white sm:text-4xl">
				{data.result.original_title ?? data.result.original_name}
			</div>

			{#if data.watchProviders.US?.flatrate}
				<div class="mt-2 text-sm text-white sm:mt-4">
					<div class="mb-2 flex flex-wrap gap-4 text-xs font-medium">
						stream on
						<span class="flex items-center gap-2 text-base-400"
							>from <a
								href="https://www.justwatch.com"
								target="_blank"
								class="text-base-300 hover:text-accent-300"
							>
								<img src="/justwatch_logo.svg" alt="justwatch" class="h-3" />
							</a></span
						>
					</div>
					<a href={data.watchProviders.US.link} target="_blank" class="flex flex-wrap gap-2">
						{#each data.watchProviders.US.flatrate as provider}
							<img
								src="https://image.tmdb.org/t/p/w500{provider.logo_path}"
								alt={provider.provider_name}
								class="size-8 rounded-md border border-base-800 md:size-12"
							/>
						{/each}
					</a>
				</div>
			{/if}

			{#if data.trailer}
				<button
					onclick={() => videoPlayer.show(data.trailer ?? '')}
					type="button"
					class="hidden w-fit items-center gap-x-1.5 rounded-md border border-accent-500/30 bg-accent-700/20 px-3 py-2 text-sm font-semibold text-accent-400 shadow-sm transition-all duration-100 hover:bg-accent-700/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 sm:inline-flex"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="-ml-0.5 size-5"
					>
						<path
							d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z"
						/>
					</svg>

					Trailer
				</button>
			{/if}
		</div>
	</div>

	<div class="px-4 py-8 text-sm text-white">
		{#if data.trailer}
			<button
				onclick={() => videoPlayer.show(data.trailer ?? '')}
				type="button"
				class="mb-4 inline-flex w-fit items-center gap-x-1.5 rounded-md border border-accent-500/30 bg-accent-700/20 px-3 py-2 text-sm font-semibold text-accent-400 shadow-sm transition-all duration-100 hover:bg-accent-700/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 sm:hidden"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="-ml-0.5 size-5"
				>
					<path
						d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z"
					/>
				</svg>

				Trailer
			</button>
		{/if}

		{#if data.user}
			<div class="flex gap-4">
				{#if !watchedItems.hasRated(data.result)}
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
								currentRating: watchedItems.getRating(data.result)?.rating ?? 0,
								currentReview: watchedItems.getRating(data.result)?.ratingText ?? ''
							};

							rateMovieModal.showModal = true;
						}}
					>
						rate {data.kind === 'movie' ? 'movie' : 'show'}
					</button>
				{/if}
			</div>
		{/if}
		<div class="my-8 max-w-2xl text-sm text-white">
			<div class="mb-2 text-lg font-semibold">overview</div>
			{data.result.overview}
		</div>

		{#if data.recommendations.length > 0}
			<div class="mb-2 mt-8 text-lg font-semibold">recommendations</div>

			<ItemsList items={data.recommendations} showMark={!!data.user} />
		{/if}

	</div>

	{#if data.ratings.length > 0}
	<div class="mb-2 mt-8 text-lg font-semibold px-4">recent reviews</div>
	
	<ReviewList reviews={data.ratings} showMovieDetails={false} class="pb-8"/>
{/if}
</Container>
