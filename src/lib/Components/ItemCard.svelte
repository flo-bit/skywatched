<script lang="ts">
	import { rateMovieModal, watchedItems } from '$lib/state.svelte';
	import { cn } from '$lib/utils';
	import Rating from './Rating.svelte';

	const {
		item,
		showMark
	}: {
		item: {
			poster_path: string;
			title?: string;
			name?: string;
			movieId?: number;
			showId?: number;
			rating?: number;
		};
		showMark?: boolean;
	} = $props();
</script>

<div class="group relative">
	<div
		class="pointer-events-none relative z-20 aspect-[2/3] h-auto min-h-44 w-full overflow-hidden rounded-md border border-base-800 bg-base-900/50 transition-opacity duration-75 group-hover:opacity-75 sm:min-h-44"
	>
		{#if item.poster_path}
			<img
				src="https://image.tmdb.org/t/p/w342{item.poster_path}"
				alt="movie poster for {item.title ?? item.name}"
				class="size-full object-cover object-center lg:size-full"
			/>
		{/if}

		{#if item.rating}
			<div
				class="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/30 to-black/70"
			></div>
			<div class="absolute bottom-2 left-0 right-0 z-10 flex justify-center">
				<Rating rating={item.rating} />
			</div>
		{:else if showMark}
			{#if watchedItems.hasRated(item)}
				<div
					class="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/30 to-black/70"
				></div>
				<div class="absolute bottom-2 left-0 right-0 z-10 flex justify-center">
					<Rating rating={watchedItems.getRating(item)?.rating ?? 0} />
				</div>
			{:else}
				<button
					class={cn(
						'pointer-events-auto absolute bottom-2 right-2 z-10 rounded-full border border-base-50/20 bg-black/30 p-2 text-base-50 opacity-100 backdrop-blur-sm transition-opacity duration-300 ease-in-out group-hover:opacity-100 sm:opacity-0',
						watchedItems.hasRated(item)
							? 'border-green-500/20 bg-green-900/60 text-green-500 sm:opacity-100'
							: 'hover:border-accent-800/50 hover:bg-accent-900/50 hover:text-accent-400 hover:duration-0'
					)}
					onclick={() => {
						rateMovieModal.show({
							movieId: item.movieId,
							showId: item.showId,
							kind: item.movieId ? 'movie' : 'tv',
							name: item.title ?? item.name,
							currentRating: 0,
							currentReview: '',
							posterPath: item.poster_path
						});
					}}
				>
					<span class="sr-only">rate</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2.5"
						stroke="currentColor"
						class="size-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
				</button>
			{/if}
		{/if}
	</div>
	<div class="mt-2 flex justify-between">
		<h3 class="sm:text-md text-sm font-medium text-base-50">
			<a href="/{item.movieId ? 'movie' : 'tv'}/{item.movieId ?? item.showId}">
				<span aria-hidden="true" class="absolute inset-0"></span>
				<div class="line-clamp-2 max-w-full">
					{item.title ?? item.name}
				</div>
			</a>
		</h3>
	</div>
</div>
