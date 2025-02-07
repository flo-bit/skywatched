<script lang="ts">
	import type { Item } from '$lib/types';
	import { cn } from '$lib/utils';
	import ItemCard from './ItemCard.svelte';

	const {
		items,
		class: className,
		showMark
	}: {
		items: Item[];
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
