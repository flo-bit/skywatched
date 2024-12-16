<script lang="ts">
	import type { MainRecord } from '$lib/db';
	import { cn } from '$lib/utils';
	import ReviewCard from './ReviewCard.svelte';

	let {
		reviews,
		class: className,
		showMovieDetails
	}: { reviews: MainRecord[]; class?: string; showMovieDetails?: boolean } = $props();
</script>

<div class={cn('flex w-full flex-col divide-y divide-base-900', className)}>
	{#each reviews as review}
		<ReviewCard data={review} {showMovieDetails} />
	{/each}
</div>
