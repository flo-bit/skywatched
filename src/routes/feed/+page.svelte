<script lang="ts">
	import Container from '$lib/Components/Container.svelte';
	import { onMount } from 'svelte';
	import { type PageData } from './$types';
	import ReviewCard from '$lib/Components/ReviewCard.svelte';

	let { data }: { data: PageData } = $props();

	onMount(async () => {
		console.log(data);
	});
</script>

<Container class="relative z-10 py-8 sm:py-16">
	<div class="flex flex-col gap-4 px-4">
		<h1 class="pb-4 text-2xl font-bold">Feed</h1>
	</div>

	{#if data.feed.length > 0}
		<div class="mx-auto flex max-w-2xl flex-col gap-4 px-4">
			{#each data.feed as record}
				<ReviewCard data={record} />
			{/each}
		</div>
	{/if}
</Container>
