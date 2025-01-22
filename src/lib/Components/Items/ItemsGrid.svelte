<script lang="ts">
	import { cn } from '$lib/utils';
	import ItemCard from './ItemCard.svelte';

	const {
		items,
		class: className,
		showMark
	}: {
		items: { poster_path: string; original_title: string; movieId?: number; showId?: number }[];
		class?: string;
		showMark?: boolean;
	} = $props();
</script>

<div
	class={cn(
		'mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8',
		className
	)}
>
	{#each items as item}
		<ItemCard {item} {showMark} />
	{/each}
</div>
