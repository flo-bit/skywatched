<script lang="ts">
	import { cn } from '../utils';
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

<div class={cn('flex gap-x-6 overflow-x-auto', className)}>
	{#each items as item}
		<ItemCard {item} {showMark} />
	{/each}
</div>
