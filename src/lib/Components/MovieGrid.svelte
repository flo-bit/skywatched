<script lang="ts">
	import { cn } from '../utils';
	import MovieCard from './MovieCard.svelte';

	const {
		movies,
		class: className,
		showMark,
		watchedMovies
	}: {
		movies: { poster_path: string; original_title: string; id: number; movieId: number }[];
		class?: string;
		showMark?: boolean;
		watchedMovies?: Set<number>;
	} = $props();
</script>

<div
	class={cn(
		'mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8',
		className
	)}
>
	{#each movies as movie}
		<MovieCard {movie} {showMark} {watchedMovies} />
	{/each}
</div>
