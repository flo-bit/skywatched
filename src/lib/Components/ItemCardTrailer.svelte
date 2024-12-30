<script lang="ts">
	import { nameToId } from '$lib/utils';

	const {
		item,
		onclick
	}: {
		item: {
			poster_path: string;
			title?: string;
			backdrop_path: string;
		};
		onclick: () => void;
	} = $props();
</script>

<div class="group relative">
	<div
		class="pointer-events-none relative z-20 aspect-2 h-32 w-auto overflow-hidden rounded-md border border-base-800 bg-base-900/50 transition-opacity duration-75 group-hover:opacity-75"
	>
		{#if item.backdrop_path}
			<img
				src="https://image.tmdb.org/t/p/w780{item.backdrop_path}"
				alt="movie poster for {item.title}"
				class="poster size-full object-cover object-center lg:size-full"
				loading="lazy"
			/>
		{/if}
	</div>
	<div class="mt-2 flex justify-between">
		<h3 class="sm:text-md text-sm font-medium text-base-50">
			<button onclick={onclick}>
				<span aria-hidden="true" class="absolute inset-0"></span>
				<div class="line-clamp-1 max-w-full">
					{item.title}
				</div>
			</button>
		</h3>
	</div>
</div>
