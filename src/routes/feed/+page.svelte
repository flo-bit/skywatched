<script lang="ts">
	import { type PageData } from './$types';

	import Container from '$lib/Components/Layout/Container.svelte';
	import ReviewList from '$lib/Components/Items/ReviewList.svelte';
	import BaseHeadTags from '$lib/Components/Layout/BaseHeadTags.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>feed | skywatched</title>
</svelte:head>

<BaseHeadTags />

<Container class="relative z-10 w-full py-8 sm:py-16">
	<div class="mx-auto w-full max-w-2xl">
		<div class="flex flex-col gap-4 px-4">
			<h1 class="pb-4 text-2xl font-bold">Recent reviews</h1>
		</div>

		{#if data.feed.length > 0}
			<ReviewList reviews={data.feed} />
		{/if}
	</div>
</Container>
