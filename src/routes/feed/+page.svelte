<script lang="ts">
	import Container from '$lib/Components/Container.svelte';
	import { onMount } from 'svelte';
	import { type PageData } from './$types';
	import ReviewList from '$lib/Components/ReviewList.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>feed | skywatched</title>
</svelte:head>

<Container class="relative z-10 py-8 sm:py-16">
	<div class="flex flex-col gap-4 px-4">
		<h1 class="pb-4 text-2xl font-bold">Recent reviews</h1>
	</div>

	{#if data.feed.length > 0}
		<ReviewList reviews={data.feed} />
	{/if}
</Container>
