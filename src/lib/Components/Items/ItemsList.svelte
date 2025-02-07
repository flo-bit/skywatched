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

<div class={cn('flex gap-x-6 overflow-x-auto', className)}>
	{#each items as item}
		<ItemCard {item} {showMark} />
	{/each}
</div>
