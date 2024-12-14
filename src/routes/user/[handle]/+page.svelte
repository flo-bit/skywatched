<script lang="ts">
	import Container from '$lib/Components/Container.svelte';
	import ItemsGrid from '$lib/Components/ItemsGrid.svelte';
	import Profile from '$lib/Components/Profile.svelte';
	import ReviewCard from '$lib/Components/ReviewCard.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	let items: {
		showId?: number;
		movieId?: number;
		poster_path?: string;
		original_title?: string;
		original_name?: string;
		rating?: number;
		ratingText?: string;
		updatedAt: string;
	}[] = $state([]);

	let loading = $state(true);

	onMount(async () => {
		const response = await fetch(`/api/getRatedWithDetails?did=${data.profile.did}`);
		const itemsData = await response.json();
		items = itemsData.items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
		loading = false;
		console.log(items);
	});
</script>

<Container>
	<Profile profile={data.profile} />

	{#if items.length > 0}
		<!-- <ItemsGrid
			class="px-4 py-8"
			items={items.map((movie) => ({
				poster_path: movie.poster_path ?? '',
				original_title: movie.original_title ?? movie.original_name ?? '',
				movieId: movie.movieId ?? undefined,
				showId: movie.showId ?? undefined,
				rating: movie.rating ?? undefined,
				ratingText: movie.ratingText ?? undefined
			}))}
		/> -->
		<div class="flex flex-col gap-8 w-full items-center py-8 px-4">
			{#each items as item}
				<ReviewCard item={item} user={data.profile} review={item} />
			{/each}
		</div>
	{:else if loading}
		<p class="text-center text-base-500 py-8">Loading reviews...</p>
	{:else}
		<p class="text-center text-base-500 py-8">No movies or tv shows rated yet.</p>
	{/if}
</Container>
