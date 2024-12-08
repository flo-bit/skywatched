<script lang="ts">
	import { cn } from '../utils';
	import MovieCard from './MovieCard.svelte';
	
	const {
		movies,
		class: className,
		showMark,
		watchedMovies
	}: {
		movies: { poster_path: string; original_title: string; id: number }[];
		class?: string;
		showMark?: boolean;
		watchedMovies?: Set<number>;
	} = $props();
</script>

<div
	class={cn(
		'flex gap-x-6 gap-y-10 overflow-x-auto',
		className
	)}
>
	{#each movies as movie}
		<MovieCard {movie} {showMark} {watchedMovies} />
	{/each}
</div>
