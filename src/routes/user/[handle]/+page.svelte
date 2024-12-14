<script lang="ts">
	import Container from '$lib/Components/Container.svelte';
	import ItemsGrid from '$lib/Components/ItemsGrid.svelte';
	import Profile from '$lib/Components/Profile.svelte';

	let { data } = $props();
</script>

<Container>
	<Profile profile={data.profile} />

	<ItemsGrid
		class="py-8 px-4"
		items={data.items.map((movie) => ({
			poster_path: movie.poster_path ?? '',
			original_title: movie.original_title ?? movie.original_name,
			movieId: movie.movieId ?? undefined,
			showId: movie.showId ?? undefined,
			rating: movie.rating ?? undefined,
			ratingText: movie.ratingText ?? undefined
		}))}
	/>
</Container>
